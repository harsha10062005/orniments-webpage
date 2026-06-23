export type Category = {
  _id: string
  name: string
  slug: string
}

export type ProductImage = {
  url: string
  publicId?: string
}

export type ProductCategoryRef = {
  _id: string
  name: string
  slug: string
}

export type Product = {
  _id: string
  productName: string
  category: string | ProductCategoryRef
  price: number
  discountPrice?: number
  description?: string
  images: ProductImage[]
  availabilityStatus: 'available' | 'out_of_stock' | 'coming_soon'
  featured: boolean
  trending: boolean
  newArrival: boolean
  stockQuantity: number
  visibility: boolean
  specifications?: { label: string; value: string }[]
  createdAt?: string
}

export function productCategoryName(
  category: Product['category'],
): string {
  if (typeof category === 'object' && category && 'name' in category) {
    return category.name
  }
  return ''
}

export function productPrimaryImage(p: Product): string {
  const url = p.images?.[0]?.url
  if (url) return url
  return 'https://placehold.co/600x720/0b0a0f/f5e6c8?text=1g+Gold'
}
