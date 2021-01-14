// pages/index/us/Set/set.js
const app = getApp();
var call = require("../../../../utils/request.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    personalList: {
      onItemTap: 'handleListItemTap',
      header: '',
      data: []
    },
  },
  onShow() {
    this.loadUserInfo();
  }, // 页面显示
  loadUserInfo() { //页面用户加载
    let that = this;
    let queryWaitCount = wx.getStorageSync('QueryWaitCount'); //加载 消息通知开关
    if (queryWaitCount == "") {
      app.AppLogin().then(res => {
        queryWaitCount = wx.getStorageSync('QueryWaitCount'); //加载 消息通知开关
        that.setDataPage(queryWaitCount);
      });
      return;
    }
    that.setDataPage(queryWaitCount);
  },
  setDataPage(queryWaitCount) {
    this.setData({
      IsMessageTell: queryWaitCount.IfDingMessage,
      'personalList.data': [
        // {  id: 1,
        //   title: '工号',
        //   extra: userInfo.UserCode, //userInfo.data.JobNumber
        //   thumb: '/utils/icon/image/gonghao.png'
        // }, {
        //   id: 2,
        //   title: '用户名',
        //   extra: userInfo.UserName, //userInfo.data.JobNumber
        //   thumb: '/utils/icon/image/zhiwei.png'
        // }, {
        //   id: 3,
        //   title: '单位',
        //   extra: userInfo.UnitName,
        //   thumb: '/utils/icon/image/danwei.png'
        // }, {
        //   id: 4,
        //   title: '单位代码',
        //   extra: userInfo.UnitCode,
        //   thumb: '/utils/icon/image/logo.png'
        // },
        {
          id: 5,
          title: '重新登陆',
          extra: '(将以主职重新登陆)',
          thumb: '/utils/icon/image/biz_errorview.png'
        }
      ],
    });
  },
  handleListItemTap(e) {
    if (e.currentTarget.dataset.id == 5) { //避免通过下标取不到值
      wx.showToast({
        title: '重新登陆中', // eData.data.Message,
        icon: 'loading',
        duration: 3000
      });
      app.AppLogin().then(res => {
        wx.switchTab({
          url: '/pages/index/gw/index'
        });
      });
    }
  },
  //选择是否
  switchChange(e) {
    let self = this;
    let paramData = JSON.stringify({
      IfDingMessage: e.detail.value == true ? 1 : 0 //1推送0不推送
    });
    wx.showLoading({
      content: '加载中...',
    });
    call.request("/Setdingtalkconfig", paramData, function (res) {
      if (res.Code == 1) {
        let queryWaitCount = wx.getStorageSync('QueryWaitCount');
        queryWaitCount.IfDingMessage = e.detail.value
        wx.setStorageSync('QueryWaitCount', queryWaitCount); //刷新本地的存储   
        self.setData({
          IsMessageTell: e.detail.value,
          success: "保存成功!"
        });
      } else {
        self.setData({
          IsMessageTell: !e.detail.value,
          error: "保存失败！"
        }); //将按钮状态恢复到点击前状态(取反)
      }
    }, function (res) {
      self.setData({
        error: res.Message
      });
    });
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  }, // 页面被下拉 


})