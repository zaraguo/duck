"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft } from "lucide-react"
import { orders } from "@/lib/orders"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")

  const getFilteredOrders = () => {
    if (activeTab === "all") return orders
    return orders.filter((order) => order.status === activeTab)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100">
            待付款
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100">
            处理中
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100">
            已发货
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100">
            已完成
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100">
            已取消
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">我的订单</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>订单列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">全部订单</TabsTrigger>
              <TabsTrigger value="pending">待付款</TabsTrigger>
              <TabsTrigger value="processing">处理中</TabsTrigger>
              <TabsTrigger value="shipped">已发货</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="cancelled">已取消</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {getFilteredOrders().map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-muted-foreground">订单号: </span>
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">下单时间: </span>
                      <span className="font-medium">{order.date}</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="p-4">
                    <div className="grid gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">数量: {item.quantity}</div>
                          </div>
                          <div className="font-medium">¥{item.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div>
                        <span className="text-sm text-muted-foreground">总计: </span>
                        <span className="font-bold text-lg">¥{order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                        {order.status === "pending" && <Button size="sm">去付款</Button>}
                        {order.status === "shipped" && <Button size="sm">确认收货</Button>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

