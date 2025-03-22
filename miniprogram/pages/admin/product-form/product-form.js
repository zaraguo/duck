// pages/admin/product-form/product-form.js
const app = getApp()

Page({
  data: {
    isEdit: false,
    product: {
      id: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "项链",
      featured: false,
      images: ["/images/placeholder.png", "/images/placeholder.png", "/images/placeholder.png"],
    },
    categories: ["项链", "戒指", "手镯"],
  },

  onLoad: function (options) {
    if (options.id) {
      // 编辑模式
      const product = app.globalData.products.find((p) => p.id === options.id)

      if (product) {
        this.setData({
          isEdit: true,
          product: { ...product, price: product.price.toString(), stock: product.stock.toString() },
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
    }
  },

  handleInput: function (e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail

    this.setData({
      [`product.${field}`]: value,
    })
  },

  handleCategoryChange: function (e) {
    this.setData({
      "product.category": this.data.categories[e.detail.value],
    })
  },

  toggleFeatured: function () {
    this.setData({
      "product.featured": !this.data.product.featured,
    })
  },

  chooseImage: function (e) {
    const index = e.currentTarget.dataset.index

    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const images = this.data.product.images
        images[index] = res.tempFilePaths[0]

        this.setData({
          "product.images": images,
        })
      },
    })
  },

  submitForm: function () {
    const product = this.data.product

    // 表单验证
    if (!product.name.trim()) {
      wx.showToast({
        title: "请输入商品名称",
        icon: "none",
      })
      return
    }

    if (!product.price.trim() || isNaN(Number.parseFloat(product.price)) || Number.parseFloat(product.price) <= 0) {
      wx.showToast({
        title: "请输入有效价格",
        icon: "none",
      })
      return
    }

    if (!product.stock.trim() || isNaN(Number.parseInt(product.stock)) || Number.parseInt(product.stock) < 0) {
      wx.showToast({
        title: "请输入有效库存",
        icon: "none",
      })
      return
    }

    // 处理数据
    const processedProduct = {
      ...product,
      price: Number.parseFloat(product.price),
      stock: Number.parseInt(product.stock),
    }

    if (this.data.isEdit) {
      // 更新现有商品
      const index = app.globalData.products.findIndex((p) => p.id === product.id)
      app.globalData.products[index] = processedProduct
    } else {
      // 添加新商品
      processedProduct.id = Date.now().toString()
      app.globalData.products.push(processedProduct)
    }

    wx.showToast({
      title: this.data.isEdit ? "更新成功" : "添加成功",
      icon: "success",
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },
})

