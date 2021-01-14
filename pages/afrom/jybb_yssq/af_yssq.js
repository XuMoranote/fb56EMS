// pages/afrom/jybb_yssq/af_yssq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //验收类型 选择事件
    yslx_index: 0,
    yslx_array: ['请选择', '证照验收', '装修验收'],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      wdmc: '', //网点名称
      wddm: '', //网点代码
      xtsxrq: '', //系统生效日期
      yzzt: '飞豹物流集团有限公司', //印章主体
      yslx: '', //验收类型
      rwsfjnbzj: '', //入网是否缴纳保证金
      sfsjtk: '', //入网是否涉及退款
      sqtkje: '', //申请退款金额
      Reason: '', //申请原因
      fileAttach: [], //附件
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
  /*获取页面 网点名称文本框的值*/
  input_wdmc(e) {
    this.setData({
      'formData.wdmc': e.detail.value
    });
  },
  /*获取页面 网点代码文本框的值*/
  input_wddm(e) {
    this.setData({
      'formData.wddm': e.detail.value
    });
  },
  /*选择 系统生效日期 */
  xtsxrqDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " +
      util.padLeft(date[3], 2) + ":" +
      util.padLeft(date[4], 2);
    self.setData({
      'formData.xtsxrq': selectDate
    });
  },
  /*获取页面 印章主体 文本框的值*/
  input_yzzt(e) {
    this.setData({
      yslx_index: e.detail.value,
      'formData.yzzt': e.detail.value
    });
  },
  /*获取页面 验收类型 选项*/
  bindPickerChange_yslx(e) {
    let yslx = this.data.yslx_array[e.detail.value];
    this.setData({
      'yslx_index': e.detail.value,
      'formData.yslx': yslx,
    });
  },
  /*入网是否缴纳保证金 输入选择*/
  radiochange_rwsfjnbzj: function (e) {
    this.setData({
      'formData.rwsfjnbzj': e.detail.value
    });
  },
  /*是否涉及退款 输入选择*/
  radiochange_sfsjtk: function (e) {
    this.setData({
      'formData.sfsjtk': e.detail.value
    });
  },
  /*获取页面 申请退款金额 文本框的值*/
  input_sqtkje(e) {
    this.setData({
      'formData.sqtkje': e.detail.value
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
  /*提交验收申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.wdmc)) {
      self.setData({
        error: '请输入网点名称！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wddm)) {
      self.setData({
        error: '请输入网点代码！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.xtsxrq)) {
      self.setData({
        error: '请输入系统生效日期'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.yzzt)) {
      self.setData({
        error: '请输入印章主体'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.yslx)) {
      self.setData({
        error: '请选择验收类型'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.rwsfjnbzj)) {
      self.setData({
        error: '请选择入网是否缴纳保证金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfsjtk)) {
      self.setData({
        error: '请选择入网是否涉及退款'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sqtkje)) {
      self.setData({
        error: '请输入申请退款金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入申请原因'
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
    var menuid = munePage.GetMenuCode("加盟网点证照/装修验收申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "503c34b7-6b63-4976-b2ec-d85269012f11",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "StationName": self.data.formData.wdmc, //网点名称
      "StationID": self.data.formData.wddm, //网点代码      
      "EffectiveDate": self.data.formData.xtsxrq, //系统生效日期
      "SealBody": self.data.formData.yzzt, //印章主体
      "AcceptanceType": self.data.formData.yslx, //验收类型
      "IsDeposit": self.data.formData.rwsfjnbzj, //入网是否缴纳保证金
      "IsRefundInvolved": self.data.formData.sfsjtk, //是否涉及退款
      "RefundAmount": self.data.formData.sqtkje, //申请退款金额
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})