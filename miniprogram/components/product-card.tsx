"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "库存不足",
        description: "该商品已售罄",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "已添加到购物车",
      description: `${product.name} 已成功添加到购物车`,
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-60 cursor-pointer" onClick={nextImage}>
        <Image
          src={product.images[currentImageIndex] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg py-1 px-3">
              已售罄
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg hover:underline">{product.name}</h3>
          </Link>
          {product.featured && <Badge variant="secondary">精选</Badge>}
        </div>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-primary">¥{product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">库存: {product.stock}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={product.stock <= 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          加入购物车
        </Button>
      </CardFooter>
    </Card>
  )
}

