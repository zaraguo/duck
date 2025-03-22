// pages/cart/cart.js
const app = getApp()

Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    shippingFee: 20,
    isEmpty: true,
  },

  onShow: function () {
    this.loadCartItems()
  },

  loadCartItems: function () {
    const cartItems = app.globalData.cart
    const isEmpty = cartItems.length === 0
    const totalPrice = this.calculateTotal(cartItems)

    this.setData({
      cartItems,
      isEmpty,
      totalPrice,
      shippingFee: isEmpty ? 0 : 20,
    })
  },

  calculateTotal: (items) =>
    items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0),

  updateQuantity: function (e) {
    const { id, action } = e.currentTarget.dataset
    const cartItems = this.data.cartItems
    const itemIndex = cartItems.findIndex((item) => item.id === id)

    if (itemIndex === -1) return

    if (action === "decrease") {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1
      }
    } else if (action === "increase") {
      // 检查库存
      const product = app.globalData.products.find((p) => p.id === id)
      if (cartItems[itemIndex].quantity < product.stock) {
        cartItems[itemIndex].quantity += 1
      } else {
        wx.showToast({
          title: "已达到最大库存",
          icon: "none",
        })
        return
      }
    }

    app.globalData.cart = cartItems

    this.setData({
      cartItems,
      totalPrice: this.calculateTotal(cartItems),
    })
  },

  removeItem: function (e) {
    const id = e.currentTarget.dataset.id
    let cartItems = this.data.cartItems

    cartItems = cartItems.filter((item) => item.id !== id)
    app.globalData.cart = cartItems

    const isEmpty = cartItems.length === 0
    const totalPrice = this.calculateTotal(cartItems)

    this.setData({
      cartItems,
      isEmpty,
      totalPrice,
      shippingFee: isEmpty ? 0 : 20,
    })

    wx.showToast({
      title: "已移除商品",
      icon: "success",
    })
  },

  checkout: function () {
    if (this.data.isEmpty) {
      wx.showToast({
        title: "购物车为空",
        icon: "none",
      })
      return
    }

    // 创建新订单
    const newOrder = {
      id: "ORD-" + Date.now().toString().substr(-6),
      customer: "当前用户",
      date: new Date().toISOString().split("T")[0],
      items: this.data.cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: this.data.totalPrice + this.data.shippingFee,
      status: "pending", // 待付款
    }

    // 添加到订单列表
    app.globalData.orders.unshift(newOrder)

    // 清空购物车
    app.globalData.cart = []

    // 跳转到订单页面
    wx.switchTab({
      url: "/pages/orders/orders",
    })

    wx.showToast({
      title: "下单成功",
      icon: "success",
    })
  },
})

