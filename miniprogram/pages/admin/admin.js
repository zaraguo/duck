// pages/admin/admin.js
const app = getApp()

Page({
  data: {
    currentTab: "dashboard",
    products: [],
    orders: [],
    statusCounts: {
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    },
    totalSales: 0,
  },

  onLoad: () => {
    // 设置为卖家模式
    app.globalData.isSeller = true
  },

  onShow: function () {
    this.loadData()
  },

  loadData: function () {
    const products = app.globalData.products
    const orders = app.globalData.orders

    // 计算各状态订单数量
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    }

    orders.forEach((order) => {
      statusCounts[order.status]++
    })

    // 计算总销售额
    const totalSales = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.total, 0)

    this.setData({
      products,
      orders,
      statusCounts,
      totalSales,
    })
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
    })
  },

  navigateToProductForm: (e) => {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: id ? `/pages/admin/product-form/product-form?id=${id}` : "/pages/admin/product-form/product-form",
    })
  },

  deleteProduct: function (e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: "确认删除",
      content: "确定要删除这个商品吗？",
      success: (res) => {
        if (res.confirm) {
          // 从产品列表中删除
          app.globalData.products = app.globalData.products.filter((p) => p.id !== id)

          // 重新加载数据
          this.loadData()

          wx.showToast({
            title: "删除成功",
            icon: "success",
          })
        }
      },
    })
  },

  navigateToOrderDetail: (e) => {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/admin/order-detail/order-detail?id=${id}`,
    })
  },

  updateOrderStatus: function (e) {
    const { id, status } = e.currentTarget.dataset
    const orderIndex = app.globalData.orders.findIndex((order) => order.id === id)

    if (orderIndex !== -1) {
      // 更新订单状态
      app.globalData.orders[orderIndex].status = status

      // 重新加载数据
      this.loadData()

      wx.showToast({
        title: "状态已更新",
        icon: "success",
      })
    }
  },
})

