Page({
  data: {
    task: {},
    memberMap: {},
    members: [],
    records: [],
    sumRecords: [],
    showCheckInModal: false,
    checkInQuantity: '',
    checkInRemarks: '',
    isCheckingIn: false,
    openId: '',
    selectedDate: '',
    currentDate: '',
    isToday: true,
  },

  onDateChange: function(e) {
    const selectedDate = e.detail.value;
    const isToday = selectedDate === this.data.currentDate;
    this.setData({
      selectedDate,
      isToday
    });
    this.loadSumCheckInRecord(this.data.task._id);
    this.loadTaskCheckInRecords(this.data.task._id);
  },

  async onLoad(options) {
    const user = await this.checkUserRegistration();

    if (user) {
      this.setData({openId: user.open_id});
      wx.setStorageSync('user', JSON.stringify(user));
    } else {
      await wx.showToast({
        title: '请先前往进行注册',
        icon: 'error',
      })
      await wx.switchTab({
        url: '/pages/user-center/index',
      });
      return;
    }

    const taskId = options?.id;
    await this.loadTaskDetails(taskId);

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.setData({
      selectedDate: formattedDate,
      currentDate: formattedDate,
      isToday: true
    });
    await this.loadSumCheckInRecord(taskId);
    await this.loadTaskCheckInRecords(taskId);
  },

  checkUserRegistration: async function () {
    const userStr = wx.getStorageSync('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {
        type: "getMyInfo",
      },
    });

    return res?.result;
  },

  async loadTaskDetails(taskId) {
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {
        type: "fetchTaskList", data: {id: taskId}
      },
    });
    const tasks = res?.result?.tasks;
    if (tasks?.length) {
      const task = tasks[0];
      const members = task?.members || [];

      if (!members.length) {
        this.setData({task});
        return;
      }

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
        members: Object.keys(memberMap),
        task
      });
    }
  },

  async loadSumCheckInRecord(taskId) {
    const selectedDateParts = this.data.selectedDate.split('-');
    const checkInDate = new Date(selectedDateParts[0], parseInt(selectedDateParts[1]) - 1, selectedDateParts[2]) / 1;
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {type: "sumCheckInRecord", data: {taskId, checkInDate}},
    });
    const sumRecords = res?.result?.list;
    const sumRecordsMap = sumRecords.reduce((map, item) => {
      map[item._id] = item.sum;
      return map;
    }, {});
    const members = this.data.members.sort((a, b) => {
      return (sumRecordsMap[b] || 0) - (sumRecordsMap[a] || 0);
    });
    this.setData({
      sumRecords,
      members
    });
  },

  async loadTaskCheckInRecords(taskId) {
    const selectedDateParts = this.data.selectedDate.split('-');
    const checkInDate = new Date(selectedDateParts[0], parseInt(selectedDateParts[1]) - 1, selectedDateParts[2]) / 1;
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {type: "fetchCheckInRecordList", data: {taskId, checkInDate}},
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

    const quantity = parseFloat(this.data.checkInQuantity);
    if (quantity < 0.1) {
      wx.showToast({
        title: '最小打卡量为 0.1 L',
        icon: 'none'
      });
      return;
    }

    await this.submitCheckIn(quantity, this.data.checkInRemarks);
  },

  async quickCheckIn(e) {
    const quantity = e.currentTarget.dataset.quantity;
    await this.submitCheckIn(parseFloat(quantity));
  },

  async submitCheckIn(quantity, remarks) {
    if (this.data.isCheckingIn) {
      return;
    }

    this.setData({isCheckingIn: true});

    const taskId = this.data.task._id;
    try {
      const res = await wx.cloud.callFunction({
        name: "duck",
        data: {
          type: "checkIn",
          data: {
            taskId,
            quantity,
            remarks: remarks,
          }
        },
      });

      if (res?.result?.success) {
        if (!(this.data?.task?.members || []).includes(this.data?.openId)) {
          await wx.cloud.callFunction({
            name: "duck",
            data: {
              type: "joinTask",
              data: {
                taskId,
              }
            },
          });
          this.setData({showCheckInModal: false});
          await this.loadTaskDetails(taskId);
        } else {
          this.setData({showCheckInModal: false});
        }

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
      wx.showToast({
        title: '打卡失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({isCheckingIn: false});
    }
  }
});

