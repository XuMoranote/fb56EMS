// pages/afrom/af_yy/afrom.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ['请选择', '合同章', '人事章', '财务章', '公章', '法人章', '各类证照'],
    index: 0,
    array2: [{
        name: '合同章',
        value: '10'
      },
      {
        name: '人事章',
        value: '11'
      },
      {
        name: '财务章',
        value: '12'
      },
      {
        name: '公章',
        value: '13'
      },
      {
        name: '法人章',
        value: '14'
      },
      {
        name: '各类证照',
        value: '15'
      },
    ],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      useType: '',
      UseTypeText: '',
      fileAttach: [],
      UseCount: '', //用印次数
      IfFinance: '', //是否财务相关
      Reason: '' //原因及明细
    },
    isManySubmit: true, //提交时，不允许多次提交 变量设置。
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ //获取当前人员姓名用户信息
      isManySubmit: true, //初始化允许提交
      'formData.UserName': app.globalData.userInfo.UserName,
      'formData.UserCode': app.globalData.userInfo.UserCode,
    });
  },
  /*是否财务相关 输入选择*/
  radiochange: function (e) {
    this.setData({
      'formData.IfFinance': e.detail.value
    });
  },
  /*用户输入的用印次数*/
  getUseCount: function (e) {
    this.setData({
      'formData.UseCount': e.detail.value
    });
  },
  /*用户选择的用印类型*/
  bindPickerChange(e) { //下拉框值改变事件
    let useName = this.data.array[e.detail.value];
    if (useName == "请选择") {
      return;
    }
    let useValue = this.data.array2.find(function (itme) {
      return itme.name == useName;
    }).value;
    this.setData({
      'index': e.detail.value,
      'formData.useType': useValue,
      'formData.UseTypeText': useName,
    });
  },
  /*用户输入用印原因及明细*/
  getReason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },
  /*选择附件上传的方法*/
  chooseImage() {
    basicCommon.afromUploadFile(this);
  },
  /*清除附件*/
  onClearAttachTap() {
    basicCommon.afromClearfileAttach(this);
  },
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.UseCount)) {
      self.setData({
        error: '请输入用印次数！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.IfFinance)) {
      self.setData({
        error: '请选择是否财务相关！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.useType)) {
      self.setData({
        error: '请选择申请类型！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请填写原因以及明细！'
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
    var menuid = munePage.GetMenuCode("用印（资质）申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_yongyin",
      // "_flowid": "17e72d77-509f-4362-8dea-197d5c461e63",
      "SubTitle": "FB-ZCB-",
      "UseCount": self.data.formData.UseCount,
      "IfFinance": self.data.formData.IfFinance,
      "UseType": self.data.formData.useType,
      "UseTypeText": self.data.formData.UseTypeText,
      "Reason": self.data.formData.Reason,
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})