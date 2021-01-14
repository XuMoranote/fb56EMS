// pages/index/wf/cwgl/dh_cwgl.js 
var munePage = require("../../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serversData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData({
      serversData: munePage.CWGL_List()
    })
  },
  bindNavigator: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  }
})