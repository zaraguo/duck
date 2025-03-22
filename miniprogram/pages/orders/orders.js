// pages/orders/orders.js
const app = getApp()

Page({
  data: {
    orders: [],
    currentTab: "all",
    statusMap: {
      pending: "待付款",
      processing: "处理中",
      shipped: "已发货",
      completed: "已完成",
      cancelled: "已取消",
    },
  },

  onShow: function () {
    this.loadOrders()
  },

  loadOrders: function () {
    // 根据用户角色加载不同的订单
    const isSeller = app.globalData.isSeller
    let orders = app.globalData.orders

    if (!isSeller) {
      // 如果是买家，只显示自己的订单
      orders = orders.filter((order) => order.customer === "当前用户")
    }

    this.setData({
      orders,
    })
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
    })
  },

  getFilteredOrders: function () {
    if (this.data.currentTab === "all") {
      return this.data.orders
    }
    return this.data.orders.filter((order) => order.status === this.data.currentTab)
  },

  navigateToOrderDetail: (e) => {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`,
    })
  },

  payOrder: function (e) {
    const id = e.currentTarget.dataset.id
    const orderIndex = app.globalData.orders.findIndex((order) => order.id === id)

    if (orderIndex !== -1) {
      // 更新订单状态为处理中
      app.globalData.orders[orderIndex].status = "processing"

      this.loadOrders()

      wx.showToast({
        title: "支付成功",
        icon: "success",
      })
    }
  },

  confirmReceipt: function (e) {
    const id = e.currentTarget.dataset.id
    const orderIndex = app.globalData.orders.findIndex((order) => order.id === id)

    if (orderIndex !== -1) {
      // 更新订单状态为已完成
      app.globalData.orders[orderIndex].status = "completed"

      this.loadOrders()

      wx.showToast({
        title: "已确认收货",
        icon: "success",
      })
    }
  },
})

