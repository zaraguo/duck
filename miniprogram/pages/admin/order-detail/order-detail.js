// pages/admin/order-detail/order-detail.js
const app = getApp()

Page({
  data: {
    order: null,
    statusMap: {
      pending: "待付款",
      processing: "处理中",
      shipped: "已发货",
      completed: "已完成",
      cancelled: "已取消",
    },
    statusOptions: [
      { value: "pending", label: "待付款" },
      { value: "processing", label: "处理中" },
      { value: "shipped", label: "已发货" },
      { value: "completed", label: "已完成" },
      { value: "cancelled", label: "已取消" },
    ],
  },

  onLoad: function (options) {
    const id = options.id
    const order = app.globalData.orders.find((o) => o.id === id)

    if (order) {
      this.setData({
        order,
      })
    } else {
      wx.showToast({
        title: "订单不存在",
        icon: "none",
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  updateStatus: function (e) {
    const status = e.detail.value
    const orderIndex = app.globalData.orders.findIndex((o) => o.id === this.data.order.id)

    if (orderIndex !== -1) {
      // 更新订单状态
      app.globalData.orders[orderIndex].status = status

      // 更新页面数据
      this.setData({
        "order.status": status,
      })

      wx.showToast({
        title: "状态已更新",
        icon: "success",
      })
    }
  },
})

