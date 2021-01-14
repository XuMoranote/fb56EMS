// pages/cfrom/cf_password/password.js
const app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    tipText: '请输入您的身份证最后六位',
    // 用于页面样式的
    valueIsShow: true,
    // 记录临时的值，点击按钮后再保存到对应变量中
    currentValue: '',
    serverPwd: '' //记录身份证最后六位密码
  },
  onLoad() {
    var ServerPwd = app.globalData.userInfo.IDCardStr.toUpperCase(); //IDCardStr 身份证后六位密码 转换大写
    if (ServerPwd == '?') {
      this.setData({
        error: '请联系人资,维护您的身份证信息!'
      });
    }
    this.setData({ //获取当前用户信息
      serverPwd: ServerPwd,
    });
  },
  onShow: function (e) {
    this.passwordBox = this.selectComponent('#passwordBox');
    var ClintePwd = wx.getStorageSync('IDCardStr');
    // console.info("IDCardStr:" + ClintePwd);
    this.setData({
      valueIsShow: false,
      currentValue: '',
      tipText: '请输入您的身份证最后六位'
    });
    this.passwordBox.clearCurrentValue();
    if (!util.strIsEmpty(ClintePwd)) {
      this.setData({
        valueIsShow: false,
        currentValue: ''
      });
      this.passwordBox._setCurrentValue({
        detail: {
          value: ClintePwd
        }
      });
    }
  },
  // 调用组件中的方法
  toggleValue() {
    this.setData({
      valueIsShow: !this.data.valueIsShow
    });
    this.passwordBox.toggleValue();
  },
  inputChange(e) {
    let currentValue = e.detail;
    this.setData({
      currentValue
    })
    // if (this.data.valueIsShow) {
    this.checkPassword();
    // }
  },
  checkPassword() {
    let value = this.data.currentValue
    if (value.length < 6) {
      return
    }
    var _tipText = '';
    var ClintePwd = value.toUpperCase(); //身份证后六位密码 转换大写    
    if (this.data.serverPwd == '?') {
      _tipText = '请联系人资,维护您的身份证信息!';
    } else if (this.data.serverPwd == ClintePwd) {
      wx.setStorageSync('IDCardStr', '');
      _tipText = '验证成功!'
      wx.navigateTo({
        url: '../../afrom/af_gz/gzquery'
      })
    } else {
      _tipText = '身份证后六位输入错误！';
    }
    // 调用组件中的方法，清除之前的值
    this.passwordBox.clearCurrentValue();
    this.passwordBox.toggleValue(false)
    this.setData({
      valueIsShow: false,
      tipText: _tipText
    });
  },
  /* 下拉恢复 情况 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
})