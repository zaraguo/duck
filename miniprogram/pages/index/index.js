Page({
  data: {
    task: {},
    memberMap: {},
    records: [],
    sumRecords: [],
    date: null,
    showCheckInModal: false,
    checkInQuantity: '',
    checkInRemarks: '',
    isCheckingIn: false,
  },

  onLoad(options) {
    const taskId = options?.id || '50de7f5d6778a8c2043667a754453442';
    const now = new Date();
    this.login();
    this.setData({
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate()) / 1
    });
    this.loadTaskDetails(taskId);
    this.loadTaskCheckInRecords(taskId);
    this.loadSumCheckInRecord(taskId);
  },

  async login() {
    wx.login({
      success: (rsp) => {
        console.log(rsp);
        wx.showToast({
          title: '登录成功',
          icon: 'none',
        })
      },
      fail: (err) => {
        logError('wx.login', err)
        wx.showToast({
          title: '登录失败',
          icon: 'error',
        })
      },
    });
  },

  async loadTaskDetails(taskId) {
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {
        type: "fetchTaskList", data: {id: taskId, checkInDate: this.data.date}
      },
    });
    const tasks = res?.result?.tasks;
    if (tasks?.length) {
      const task = tasks[0];
      const members = task?.members || [];

      const memberRes = await wx.cloud.callFunction({
        name: "duck",
        data: {
          type: "queryMemberList", data: {openIds: members}
        },
      });

      const memberMap = (memberRes?.result?.members || []).reduce((map, item) => {
        map[item.open_id] = item;
        return map;
      }, {});

      this.setData({
        memberMap,
        task
      });
    }
  },

  async loadSumCheckInRecord(taskId) {
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {type: "sumCheckInRecord", data: {taskId, checkInDate: this.data.date}},
    });
    this.setData({
      sumRecords: res?.result?.list || []
    });
  },

  async loadTaskCheckInRecords(taskId) {
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {type: "fetchCheckInRecordList", data: {taskId}},
    });
    const records = res?.result?.records || [];
    this.setData({
      records
    });
  },

  showCheckInModal() {
    if (!this.data.isCheckingIn) {
      this.setData({
        showCheckInModal: true,
        checkInQuantity: '',
        checkInRemarks: '',
      });
    }
  },

  onQuantityInput(e) {
    this.setData({
      checkInQuantity: e.detail.value
    });
  },

  onRemarksInput(e) {
    this.setData({
      checkInRemarks: e.detail.value
    });
  },

  cancelCheckIn() {
    this.setData({
      showCheckInModal: false
    });
  },

  async confirmCheckIn() {
    if (!this.data.checkInQuantity) {
      wx.showToast({
        title: '请输入数量',
        icon: 'none'
      });
      return;
    }

    await this.submitCheckIn(this.data.checkInQuantity, this.data.checkInRemarks);
  },

  async quickCheckIn(e) {
    const quantity = e.currentTarget.dataset.quantity;
    await this.submitCheckIn(quantity);
  },

  async submitCheckIn(quantity, remarks) {
    if (this.data.isCheckingIn) {
      return;
    }

    this.setData({isCheckingIn: true});

    const userId = wx.getStorageSync('userId') || '149016';
    const taskId = this.data.task._id;
    try {
      const res = await wx.cloud.callFunction({
        name: "duck",
        data: {
          type: "checkIn",
          data: {
            taskId,
            quantity: parseFloat(quantity),
            remarks: remarks,
            userId,
          }
        },
      });

      if (res?.result?.success) {
        this.setData({
          showCheckInModal: false
        });
        await this.loadTaskCheckInRecords(taskId);
        await this.loadSumCheckInRecord(taskId);
        wx.showToast({
          title: '打卡成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '打卡失败，请重试',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('Check-in error:', error);
      wx.showToast({
        title: '打卡失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({isCheckingIn: false});
    }
  }
});

