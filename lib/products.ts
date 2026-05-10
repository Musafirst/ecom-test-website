import { categoryDetails, collectionDetails } from '@/data/collections'
import { allProducts, electronicsProducts, getProductByHandle, perfumeProducts } from '@/data/products'

export const featuredProducts = perfumeProducts.slice(0, 4)

export const collectionProducts = {
  oud: perfumeProducts.filter((product) => product.collection === 'oud'),
  amber: perfumeProducts.filter((product) => product.collection === 'amber'),
  daily: perfumeProducts.filter((product) => product.collection === 'daily'),
}

export {
  allProducts,
  categoryDetails,
  collectionDetails,
  electronicsProducts,
  getProductByHandle,
}
