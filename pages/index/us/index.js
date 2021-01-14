// pages/index/us/index.js 
const app = getApp();
var call = require("../../../utils/request.js");
Page({
  data: {
    userName: '', //用户名   
    userHead: "/utils/icon/image/userhead.png",
    objectArray: [], //切换职级
    arrIndex: 0, //切换职级索引
    personalList: { //列表
      onItemTap: 'handleListItemTap', //事件
      header: '',
      data: []
    },
  },
  // 页面显示
  onShow() {
    this.loadUserInfo();
  },
  //页面用户加载
  loadUserInfo() {
    let that = this;
    //加载用户信息
    let userInfo = app.globalData.userInfo = wx.getStorageSync('FBUserInfo');
    if (userInfo == undefined) {
      app.AppLogin().then(res => {
        userInfo = app.globalData.userInfo = wx.getStorageSync('FBUserInfo');
        that.setDataPage(userInfo);
      });
      return;
    }
    that.setDataPage(userInfo);
  },
  //setDataPage
  setDataPage(userInfo) {
    this.setData({
      objectArray: userInfo.JZ,
      arrIndex: this.getArrayidex(userInfo.JZ, userInfo.UserCode),
      userName: userInfo.UserName,
      'personalList.data': [{
          id: 1,
          title: '工号',
          extra: userInfo.UserCode, //userInfo.data.JobNumber
          thumb: '/utils/icon/image/gonghao.png'
        }, {
          id: 2,
          title: '用户名',
          extra: userInfo.UserName, //userInfo.data.JobNumber
          thumb: '/utils/icon/image/zhiwei.png'
        }, {
          id: 3,
          title: '单位',
          extra: userInfo.UnitName,
          thumb: '/utils/icon/image/danwei.png'
        }, {
          id: 4,
          title: '单位代码',
          extra: userInfo.UnitCode,
          thumb: '/utils/icon/image/logo.png'
        },
        // {
        //   id: 5,
        //   title: '重新登陆',
        //   extra: '',
        //   thumb: '/utils/icon/image/biz_errorview.png'
        // }
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
      app.AppLogin();
    }
  },
  /* 更新自动升级 */
  updatemManager: function () {
    var app = getApp();
    app.updatemManager();
  },
  /* 跳转去设置页面 */
  GoSetPage(e) { //去设置页面
    wx.navigateTo({
      url: '/pages/index/us/Set/set'
    });
  },

  //职级切换 
  bindObjPickerChange(e) {
    let self = this;
    let jobInfo = self.data.objectArray[e.detail.value];
    if (jobInfo.JobName === '请选择') {
      return;
    }

    let paramData = JSON.stringify({
      jobNumber: jobInfo.UserCode,
    });
    wx.showModal({
      title: '友好提示',
      content: '是否确认职位切换？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({title: '加载中...',});
          call.request('/LoginJZ', paramData, function (res) {
            wx.hideLoading();
            if (res.Code === 1) {
              app.globalData.userInfo = res.Data; //刷新本地存储  
              wx.setStorageSync('FBUserInfo', app.globalData.userInfo);
              self.loadUserInfo();
              self.setData({
                arrIndex: 0,//e.detail.value
                success: "职位切换成功!"
              });
            } else {
              self.setData({
                error: res.Message
              });
            }
          }, function (res) {
            self.setData({
              error: res.Message
            });
          });
        }
      }
    });
  },
  // 页面被下拉
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  //获取职级列表集合下标
  getArrayidex(arr, value) {
    if (arr == null || arr == undefined || arr == '') {
      return 0;
    }
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i].UserCode) {
        return i;
      }
    }
    return 0;
  }
});