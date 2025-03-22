"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { products } from "@/lib/data"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">商品不存在</h1>
        <Button onClick={() => router.push("/")}>返回首页</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "库存不足",
        description: "该商品已售罄",
        variant: "destructive",
      })
      return
    }

    if (quantity > product.stock) {
      toast({
        title: "库存不足",
        description: `当前库存仅剩 ${product.stock} 件`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "已添加到购物车",
      description: `${quantity} 件 ${product.name} 已成功添加到购物车`,
    })
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        返回首页
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
            <Image
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                  index === currentImageIndex ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - 图片 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.featured && <Badge variant="secondary">精选</Badge>}
          </div>
          <p className="text-2xl font-bold text-primary mb-4">¥{product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="flex items-center mb-6">
            <span className="mr-4">库存: {product.stock} 件</span>
            <span className="mr-4">类别: {product.category}</span>
          </div>

          <Separator className="mb-6" />

          {product.stock > 0 ? (
            <>
              <div className="flex items-center mb-6">
                <span className="mr-4">数量:</span>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stock}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  加入购物车
                </Button>
                <Button variant="secondary" className="flex-1">
                  立即购买
                </Button>
              </div>
            </>
          ) : (
            <Button disabled className="w-full">
              已售罄
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

