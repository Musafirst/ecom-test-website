// Shared product field set for every product-facing request.
// Add new Shopify product fields here first, then map them in lib/shopify.ts.
const productFields = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 8) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
`

export const productsQuery = /* GraphQL */ `
  ${productFields}
  query Products($first: Int = 60) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`

export const productByHandleQuery = /* GraphQL */ `
  ${productFields}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`

export const collectionsQuery = /* GraphQL */ `
  query Collections($first: Int = 30) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
          }
          products(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`

export const collectionByHandleQuery = /* GraphQL */ `
  ${productFields}
  query CollectionByHandle($handle: String!, $first: Int = 60) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
      }
      products(first: $first, sortKey: TITLE) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`

export const cartCreateMutation = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const cartLinesAddMutation = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const cartCreateFromLinesMutation = /* GraphQL */ `
  mutation CartCreateFromLines($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const shopPoliciesQuery = /* GraphQL */ `
  query ShopPolicies {
    shop {
      privacyPolicy { title body url }
      refundPolicy { title body url }
      shippingPolicy { title body url }
      termsOfService { title body url }
    }
  }
`
