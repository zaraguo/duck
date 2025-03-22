// pages/order-detail/order-detail.js
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

  payOrder: function () {
    if (this.data.order.status !== "pending") return

    const orderIndex = app.globalData.orders.findIndex((o) => o.id === this.data.order.id)

    if (orderIndex !== -1) {
      // 更新订单状态为处理中
      app.globalData.orders[orderIndex].status = "processing"

      // 更新页面数据
      this.setData({
        "order.status": "processing",
      })

      wx.showToast({
        title: "支付成功",
        icon: "success",
      })
    }
  },

  confirmReceipt: function () {
    if (this.data.order.status !== "shipped") return

    const orderIndex = app.globalData.orders.findIndex((o) => o.id === this.data.order.id)

    if (orderIndex !== -1) {
      // 更新订单状态为已完成
      app.globalData.orders[orderIndex].status = "completed"

      // 更新页面数据
      this.setData({
        "order.status": "completed",
      })

      wx.showToast({
        title: "已确认收货",
        icon: "success",
      })
    }
  },

  cancelOrder: function () {
    if (this.data.order.status !== "pending") return

    wx.showModal({
      title: "确认取消",
      content: "确定要取消这个订单吗？",
      success: (res) => {
        if (res.confirm) {
          const orderIndex = app.globalData.orders.findIndex((o) => o.id === this.data.order.id)

          if (orderIndex !== -1) {
            // 更新订单状态为已取消
            app.globalData.orders[orderIndex].status = "cancelled"

            // 更新页面数据
            this.setData({
              "order.status": "cancelled",
            })

            wx.showToast({
              title: "订单已取消",
              icon: "success",
            })
          }
        }
      },
    })
  },
})

