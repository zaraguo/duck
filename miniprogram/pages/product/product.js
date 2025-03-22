// pages/product/product.js
const app = getApp()

Page({
  data: {
    product: null,
    currentImageIndex: 0,
    quantity: 1,
  },

  onLoad: function (options) {
    const id = options.id
    const product = app.globalData.products.find((p) => p.id === id)

    if (product) {
      this.setData({
        product,
        quantity: 1,
      })
    } else {
      wx.showToast({
        title: "商品不存在",
        icon: "none",
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  changeImage: function (e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentImageIndex: index,
    })
  },

  decreaseQuantity: function () {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1,
      })
    }
  },

  increaseQuantity: function () {
    if (this.data.quantity < this.data.product.stock) {
      this.setData({
        quantity: this.data.quantity + 1,
      })
    } else {
      wx.showToast({
        title: "已达到最大库存",
        icon: "none",
      })
    }
  },

  addToCart: function () {
    const product = this.data.product

    if (product.stock <= 0) {
      wx.showToast({
        title: "商品已售罄",
        icon: "none",
      })
      return
    }

    if (this.data.quantity > product.stock) {
      wx.showToast({
        title: `当前库存仅剩 ${product.stock} 件`,
        icon: "none",
      })
      return
    }

    const cart = app.globalData.cart
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // 如果购物车中已有该商品，增加数量
      existingItem.quantity += this.data.quantity
    } else {
      // 否则添加新商品到购物车
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: this.data.quantity,
      })
    }

    app.globalData.cart = cart

    wx.showToast({
      title: "已加入购物车",
      icon: "success",
    })
  },

  buyNow: function () {
    const product = this.data.product

    if (product.stock <= 0) {
      wx.showToast({
        title: "商品已售罄",
        icon: "none",
      })
      return
    }

    if (this.data.quantity > product.stock) {
      wx.showToast({
        title: `当前库存仅剩 ${product.stock} 件`,
        icon: "none",
      })
      return
    }

    // 清空购物车，只添加当前商品
    app.globalData.cart = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: this.data.quantity,
      },
    ]

    // 跳转到购物车页面
    wx.switchTab({
      url: "/pages/cart/cart",
    })
  },
})

