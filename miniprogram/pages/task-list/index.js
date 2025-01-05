Page({
  data: {
    tasks: [],
  },

  onShow(options) {
    this.loadTaskList();
  },

  async loadTaskList() {
    const res = await wx.cloud.callFunction({
      name: "duck",
      data: {
        type: "fetchTaskList"
      },
    });
    const tasks = res?.result?.tasks;
    if (tasks?.length) {
      this.setData({tasks});
    }
  },

  navigateToTaskDetail: function (e) {
    const taskId = e.currentTarget.dataset.taskId;
    wx.navigateTo({
      url: `/pages/task-detail/index?id=${taskId}`
    });
  }
});

