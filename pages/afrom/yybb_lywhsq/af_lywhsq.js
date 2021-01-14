// pages/afrom/yybb_lywhsq/af_lywhsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //申请类型
    sqlx_index: 0,
    sqlx_array: ['请选择', '新增', '调整'],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      sqlx: '',//申请类型
      Reason: '', //需求分析
      fileAttach: [], //附件   
      fjsm: '',//附件说明
    },
    isManySubmit: false, //提交时，不允许多次提交 变量设置。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ //获取当前人员姓名用户信息
      isManySubmit: true, //初始化允许提交      
      'formData.UserName': app.globalData.userInfo.UserName,
      'formData.UserCode': app.globalData.userInfo.UserCode,
      'formData.szfb': app.globalData.userInfo.PdepartmentName,
      'formData.szfbbm': app.globalData.userInfo.PdepartmentCode,
    });
  },
  /*申请类型 选中事件*/
  bindPickerChange_sqlx(e) {
    let that = this;
    let sqlx = that.data.sqlx_array[e.detail.value];
    that.setData({
      'sqlx_index': e.detail.value,
      'formData.sqlx': sqlx,
    });
  },
  /*获取页面 需求分析 文本框的值*/
  input_Reason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },
  /*选择附件上传的方法*/
  chooseImage() {  basicCommon.afromUploadFile(this); },
  /*清除附件*/
  onClearAttachTap() { basicCommon.afromClearfileAttach(this); },
  /*获取页面 附件说明 文本框的值*/
  input_fjsm(e) {
    this.setData({
      'formData.fjsm': e.detail.value
    });
  },
  /*提交路由维护申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    
    if (util.strIsEmpty(self.data.formData.sqlx) || self.data.formData.sqlx == '请选择') {
      self.setData({
        error: '请选择申请类型'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入需求分析!'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.fjsm)) {
      self.setData({
        error: '请输入附件说明!'
      });
      return;
    }
    if (this.data.formData.fileAttach.length < 1) {
      self.setData({
        error: '请上传附件信息'
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    //获取菜单ID
    var menuid = munePage.GetMenuCode("路由维护申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "97af0709-cec9-4d3c-81e0-10e6a5258cc2",
      "SubTitle": "FB-YYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      'SQLX': self.data.formData.sqlx, //申请类型  
      "XQFC": self.data.formData.Reason, //需求分析
      "fileAttach": self.data.formData.fileAttach,//附件
      "FJSM": self.data.formData.fjsm,//附件说明
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})