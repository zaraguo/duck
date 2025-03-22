"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingBag, Users, PlusCircle, Clock, CheckCircle, TruckIcon, XCircle } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { products } from "@/lib/data"
import { orders } from "@/lib/orders"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // 商品管理列
  const productColumns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "商品名称",
    },
    {
      accessorKey: "price",
      header: "价格",
      cell: ({ row }) => {
        return `¥${row.getValue("price").toFixed(2)}`
      },
    },
    {
      accessorKey: "stock",
      header: "库存",
    },
    {
      accessorKey: "category",
      header: "类别",
    },
    {
      accessorKey: "featured",
      header: "精选",
      cell: ({ row }) => {
        return row.getValue("featured") ? <Badge variant="secondary">是</Badge> : <Badge variant="outline">否</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              编辑
            </Button>
            <Button variant="destructive" size="sm">
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  // 订单管理列
  const orderColumns = [
    {
      accessorKey: "id",
      header: "订单号",
    },
    {
      accessorKey: "customer",
      header: "客户",
    },
    {
      accessorKey: "date",
      header: "日期",
    },
    {
      accessorKey: "total",
      header: "总金额",
      cell: ({ row }) => {
        return `¥${row.getValue("total").toFixed(2)}`
      },
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.getValue("status")

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
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              查看详情
            </Button>
            <Button variant="outline" size="sm">
              更新状态
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">商家管理后台</h1>
        <Link href="/">
          <Button variant="outline">返回商城</Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">控制面板</TabsTrigger>
          <TabsTrigger value="products">商品管理</TabsTrigger>
          <TabsTrigger value="orders">订单管理</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总销售额</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% 较上月</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">商品数量</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">+12 件新商品</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">订单数量</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">+19% 较上月</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">客户数量</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 新客户</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>最近订单</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={orderColumns} data={orders.slice(0, 5)} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>订单状态</CardTitle>
                <CardDescription>各状态订单数量统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span>待付款</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: "15%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span>处理中</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: "30%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon className="mr-2 h-4 w-4 text-purple-500" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span>已发货</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: "25%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span>已完成</span>
                        <span className="font-medium">42</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "55%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span>已取消</span>
                        <span className="font-medium">7</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: "10%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">商品管理</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              添加商品
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <DataTable columns={productColumns} data={products} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">订单管理</h2>
            <div className="flex gap-2">
              <Button variant="outline">导出订单</Button>
              <Button variant="outline">打印订单</Button>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">全部订单</TabsTrigger>
                  <TabsTrigger value="pending">待付款</TabsTrigger>
                  <TabsTrigger value="processing">处理中</TabsTrigger>
                  <TabsTrigger value="shipped">已发货</TabsTrigger>
                  <TabsTrigger value="completed">已完成</TabsTrigger>
                  <TabsTrigger value="cancelled">已取消</TabsTrigger>
                </TabsList>
              </Tabs>
              <DataTable columns={orderColumns} data={orders} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

