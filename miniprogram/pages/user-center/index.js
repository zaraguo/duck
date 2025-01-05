const {envList} = require('../../envList');

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isRegistered: false,
    userInfo: null,
    showRegisterModal: false,
    registerUsername: ''
  },

  onLoad: function () {
    this.checkUserRegistration();
  },

  checkUserRegistration: async function () {
    const userStr = wx.getStorageSync('user');
    if (userStr) {
      this.setData({
        userInfo: JSON.parse(userStr),
        isRegistered: true
      });
    } else {
      const res = await wx.cloud.callFunction({
        name: "duck",
        data: {
          type: "getMyInfo",
        },
      });

      const user = res?.result;
      if (user) {
        this.setData({
          isRegistered: true,
          userInfo: user
        });
        wx.setStorageSync('user', JSON.stringify(user));
      } else {
        this.setData({
          isRegistered: false
        });
      }
    }
  },

  showRegisterModal: function () {
    this.setData({
      showRegisterModal: true
    });
  },

  onUsernameInput: function (e) {
    this.setData({
      registerUsername: e.detail.value
    });
  },

  cancelRegister: function () {
    this.setData({
      showRegisterModal: false,
      registerUsername: ''
    });
  },

  confirmRegister: async function () {
    if (!this.data.registerUsername.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {
        type: "register",
        data: {
          name: this.data.registerUsername,
        }
      },
    });

    const user = res?.result;
    if (user) {
      wx.showToast({
        title: '注册成功',
        icon: 'success'
      });
      this.setData({
        showRegisterModal: false
      });
      this.checkUserRegistration();
    }
  },

  preventTouchMove: function () {
    // 防止背景滚动
  }
});
