/**
 * Pushes individual theme files from shopify-theme/ to a live Shopify theme.
 *
 * deploy-shopify-theme.mjs uploads a whole archive as a new theme, which is the
 * right tool for a redesign. It is the wrong tool for a one-line fix: it creates
 * a new theme, drops any file the archive lacks, and overwrites the
 * admin-managed settings_data.json. This script instead updates named files in
 * place, so everything not named is left exactly as the merchant left it.
 *
 * It refuses to run unless the local file and the live file actually differ, and
 * it prints a diff summary first, so an accidental run is a no-op.
 *
 * Usage:
 *   node scripts/push-theme-files.mjs --theme <gid> [--dry-run] <path> [<path>...]
 *
 * Paths are relative to shopify-theme/, e.g. sections/footer.liquid
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const API_VERSION = '2026-04'
const THEME_ROOT = 'shopify-theme'

function loadEnvLocal() {
  const file = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
    if (!match) continue
    const value = match[2].trim().replace(/^["']|["']$/g, '')
    if (!process.env[match[1]]) process.env[match[1]] = value
  }
}

loadEnvLocal()

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const themeIndex = args.indexOf('--theme')
const THEME_ID = themeIndex === -1 ? process.env.SHOPIFY_THEME_ID : args[themeIndex + 1]
const filenames = args.filter((arg, index) => {
  if (arg.startsWith('--')) return false
  if (themeIndex !== -1 && index === themeIndex + 1) return false
  return true
})

const DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

if (!DOMAIN || !TOKEN) {
  console.error('SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN are required (set them in .env.local).')
  process.exit(1)
}

if (!THEME_ID) {
  console.error('Pass --theme <gid://shopify/OnlineStoreTheme/...> or set SHOPIFY_THEME_ID.')
  process.exit(1)
}

if (!filenames.length) {
  console.error('Pass at least one path relative to shopify-theme/, e.g. sections/footer.liquid')
  process.exit(1)
}

async function admin(query, variables) {
  const response = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables }),
  })

  const text = await response.text()
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 400)}`)

  const json = JSON.parse(text)
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

const READ_QUERY = `query ThemeFiles($id: ID!, $names: [String!]) {
  theme(id: $id) {
    name
    role
    files(first: 50, filenames: $names) {
      nodes {
        filename
        checksumMd5
        body { ... on OnlineStoreThemeFileBodyText { content } }
      }
    }
  }
}`

const UPSERT_MUTATION = `mutation PushFiles($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: $themeId, files: $files) {
    upsertedThemeFiles { filename }
    userErrors { filename field message }
  }
}`

async function main() {
  const data = await admin(READ_QUERY, { id: THEME_ID, names: filenames })
  if (!data.theme) throw new Error(`Theme not found: ${THEME_ID}`)

  console.log(`Theme: ${data.theme.name} (${data.theme.role})\n`)

  const liveByName = new Map(data.theme.files.nodes.map((node) => [node.filename, node]))
  const pending = []

  for (const filename of filenames) {
    const localPath = path.join(THEME_ROOT, filename)
    if (!fs.existsSync(localPath)) throw new Error(`missing locally: ${localPath}`)

    // Shopify stores theme files with LF endings; normalize so a checkout on
    // Windows does not look like a change to every line.
    const local = fs.readFileSync(localPath, 'utf8').replace(/\r\n/g, '\n')
    const live = liveByName.get(filename)
    const localMd5 = crypto.createHash('md5').update(local).digest('hex')

    if (!live) {
      console.log(`  ${filename}: not on the theme yet, will be created`)
      pending.push({ filename, body: { type: 'TEXT', value: local } })
      continue
    }

    const liveContent = (live.body?.content ?? '').replace(/\r\n/g, '\n')
    if (liveContent === local || live.checksumMd5 === localMd5) {
      console.log(`  ${filename}: already identical, skipping`)
      continue
    }

    const liveLines = liveContent.split('\n')
    const localLines = local.split('\n')
    const changed = liveLines.filter((line, index) => localLines[index] !== line).length
    console.log(`  ${filename}: differs (${liveLines.length} -> ${localLines.length} lines, ~${changed} changed)`)
    pending.push({ filename, body: { type: 'TEXT', value: local } })
  }

  if (!pending.length) {
    console.log('\nNothing to push.')
    return
  }

  if (DRY_RUN) {
    console.log(`\n${pending.length} file(s) would be pushed. (dry run)`)
    return
  }

  const result = await admin(UPSERT_MUTATION, { themeId: THEME_ID, files: pending })
  const errors = result.themeFilesUpsert.userErrors
  if (errors.length) throw new Error(JSON.stringify(errors))

  console.log(`\nPushed ${result.themeFilesUpsert.upsertedThemeFiles.length} file(s):`)
  for (const file of result.themeFilesUpsert.upsertedThemeFiles) console.log(`  ${file.filename}`)
}

main().catch((error) => {
  console.error('\nFailed:', error.message)
  process.exitCode = 1
})
