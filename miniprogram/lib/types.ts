export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  featured: boolean
  images: string[]
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customer: string
  date: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled"
}

