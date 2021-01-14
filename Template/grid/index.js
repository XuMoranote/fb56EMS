const app = getApp()

Page({
  data: {
    servers:[]
  },
  onLoad: function () {    
  },
  /**
   * 当点击Item的时候传递过来
   */
  bindNavigator: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    }) 
  },
})