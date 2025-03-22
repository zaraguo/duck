// pages/index/index.js
const app = getApp()

Page({
  data: {
    currentTab: "all",
    products: [],
    featuredProducts: [],
    categories: ["全部", "项链", "戒指", "手镯"],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    banners: ["/images/ring.png", "/images/necklack.png"],
  },

  onLoad: function () {
    this.loadProducts()
  },

  onShow: function () {
    // 每次显示页面时重新加载产品，以确保库存等信息是最新的
    this.loadProducts()
  },

  loadProducts: function () {
    const products = app.globalData.products
    const featuredProducts = products.filter((p) => p.featured)

    this.setData({
      products,
      featuredProducts,
    })
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
    })
  },

  getFilteredProducts: function () {
    if (this.data.currentTab === "all") {
      return this.data.products
    }
    return this.data.products.filter((p) => p.category === this.data.currentTab)
  },

  navigateToProduct: (e) => {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/product?id=${id}`,
    })
  },

  addToCart: function (e) {
    const id = e.currentTarget.dataset.id
    const product = this.data.products.find((p) => p.id === id)

    if (product.stock <= 0) {
      wx.showToast({
        title: "商品已售罄",
        icon: "none",
      })
      return
    }

    const cart = app.globalData.cart
    const existingItem = cart.find((item) => item.id === id)

    if (existingItem) {
      // 如果购物车中已有该商品，增加数量
      existingItem.quantity += 1
    } else {
      // 否则添加新商品到购物车
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      })
    }

    app.globalData.cart = cart

    wx.showToast({
      title: "已加入购物车",
      icon: "success",
    })
  },
})

