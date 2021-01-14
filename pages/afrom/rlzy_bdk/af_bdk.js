// pages/afrom/af_bdk.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //补卡原因
    bkyy_index: 0,
    bkyy_array: ['请选择', '因公', '因私'],
    //补卡类型
    bklx_index: 0,
    bklx_array: ['请选择', '上班打卡', '下班打卡'], //'上下班打卡', 
    //上下班时间隐藏
    hidden_sbsj: true,
    hidden_xbsj: true,
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      bkrq: '', //补卡日期
      bkyy: '', //补卡原因
      bklx: '', //补卡类型
      sbsj: '', //上班时间
      xbsj: '', //下班时间
      hjts: '', //合计天数 
      fileAttach: [], //附件集合
      Reason: '', //加班原因 
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
      'formData.szfb': app.globalData.userInfo.PdepartmentName,
      'formData.szfbbm': app.globalData.userInfo.PdepartmentCode,
    });
  },
  /*选择 补卡日期 */
  bindPickerChange_bkrq(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " 
      // +  util.padLeft(date[3], 2) + ":" +
      // util.padLeft(date[4], 2);
    self.setData({
      'formData.bkrq': selectDate
    });
  },
  /*补卡原因选中事件*/
  bindPickerChange_bkyy(e) {
    let bkyy = this.data.bkyy_array[e.detail.value];
    this.setData({
      'bkyy_index': e.detail.value,
      'formData.bkyy': bkyy,
    });
  },
  /*补卡类型选中事件*/
  bindPickerChange_bklx(e) {
    let bklx = this.data.bklx_array[e.detail.value];
    this.setData({
      'bklx_index': e.detail.value,
      'formData.bklx': bklx,
    });
    if (bklx == "上班打卡") {
      this.setData({
        'hidden_sbsj': false,
        'hidden_xbsj': true,
        'formData.hjts': 0.5,
        'formData.sbsj':'9:00',
        'formData.xbsj':''
      });
    } else if (bklx == "下班打卡") {
      this.setData({
        'hidden_xbsj': false,
        'hidden_sbsj': true,
        'formData.hjts': 0.5,
        'formData.xbsj':'18:00',
        'formData.sbsj':''
      });
    } else if (bklx == "上下班打卡") {
      this.setData({
        'hidden_sbsj': false,
        'hidden_xbsj': false,
        'formData.hjts': 1,
        'formData.sbsj':'9:00',
        'formData.xbsj':'18:00'
      });
    } else {
      this.setData({
        'hidden_sbsj': true,
        'hidden_xbsj': true,
        'formData.hjts': '',
      });
    }
  },
  /*上班时间选中事件*/
  timePicker_sbsj(e) {
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    this.setData({
      'formData.sbsj': selectDate
    });
  },
  /*下班时间选中事件*/
  timePicker_xbsj(e) {
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    this.setData({
      'formData.xbsj': selectDate
    });
  },
  /*获取合计天数输入的值*/
  input_hjts: function (e) {
    this.setData({
      'formData.hjts': e.detail.value,
    });
  },
  /*获取页面 申请原因文本框的值*/
  input_Reason(e) {
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
  /*提交补打卡申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.bkrq)) {
      self.setData({
        error: '请选择补卡日期！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.bkyy) || self.data.formData.bkyy == '请选择') {
      self.setData({
        error: '请选择补卡原因！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.bklx) || self.data.formData.bklx == '请选择') {
      self.setData({
        error: '请选择补卡类型！'
      });
      return;
    } else if (self.data.formData.bklx == "上下班打卡" &&
      (util.strIsEmpty(self.data.formData.sbsj) || util.strIsEmpty(self.data.formData.xbsj))) {
      self.setData({
        error: '请选上下班时间！'
      });
      return;
    } else if (self.data.formData.bklx == "上班打卡" && util.strIsEmpty(self.data.formData.sbsj)) {
      self.setData({
        error: '请选上班时间！'
      });
      return;
    } else if (self.data.formData.bklx == "下班打卡" && util.strIsEmpty(self.data.formData.xbsj)) {
      self.setData({
        error: '请选下班班时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.hjts)) {
      self.setData({
        error: '请输入合计天数！'
      });
      return;
    }
    if (parseFloat(self.data.formData.hjts) % 0.5 != 0) {
      self.setData({
        error: '合计天数必须是0.5的倍数'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入具体原因'
      });
      return;
    }
    // if (this.data.formData.fileAttach.length < 1) {
    //   self.setData({
    //     error: '请上传附件信息'
    //   });
    //   return;
    // }
    wx.showLoading({
      title: '加载中...',
    });
    //获取菜单ID
    var menuid = munePage.GetMenuCode("补打卡");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let pArray = {
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "0df8f809-2c77-4d0f-8d26-4b32c46d1eda",
      "SubTitle": "FB-RLZY-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "RepairDate":self.data.formData.bkrq , //补卡日期
      "RepairType":self.data.formData.bkyy , //补卡原因
      "RepairAction":self.data.formData.bklx , //补卡类型      
      "timespinnerup":self.data.formData.sbsj , //上班时间
      "timespinnerdown":self.data.formData.xbsj , //下班时间
      "SumDays":self.data.formData.hjts , //合计天数 
      "Reason": self.data.formData.Reason, //具体原因
      "fileAttach": self.data.formData.fileAttach,
    };
    // if(pArray.RepairAction == '上班打卡'){
    //   delete pArray.timespinnerdown
    // }else if(pArray.RepairAction == '下班打卡'){
    //   delete pArray.timespinnerup
    // }
    let paramData = JSON.stringify(pArray);
    basicCommon.gotoSubmit(self, paramData);
  }
})