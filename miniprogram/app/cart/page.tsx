"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 模拟购物车数据
const initialCartItems = [
  {
    id: "1",
    name: "24K金项链",
    price: 3999.99,
    quantity: 1,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "2",
    name: "18K金戒指",
    price: 2499.99,
    quantity: 2,
    image: "/placeholder.svg?height=400&width=400",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const { toast } = useToast()

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))

    toast({
      title: "已移除商品",
      description: "商品已从购物车中移除",
    })
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal > 0 ? 20 : 0
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            继续购物
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">购物车</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>购物车商品 ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-24 h-24">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                        <p className="text-muted-foreground text-sm">单价: ¥{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-between">
                  <span>小计</span>
                  <span>¥{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>运费</span>
                  <span>¥{shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>总计</span>
                  <span>¥{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">结算</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">您的购物车是空的</h2>
            <p className="text-muted-foreground mb-6">去添加一些商品吧！</p>
            <Link href="/">
              <Button>继续购物</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

