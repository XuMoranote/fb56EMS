// pages/afrom/jybb_wdjjjsjwhsq/af_wdjjjsjwhsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      wddm: '', //网点代码  
      wdmc: '', //网点名称
      jjjfbmc: '',//交接件分拨名称
      jjdksj: '',//..交件到达分拨时间
      jjlksj: '', //接件打卡离开时间
      Reason: '', //退网原因描述
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
  /*获取页面 网点代码文本框的值*/
  input_wddm(e) {
    this.setData({
      'formData.wddm': e.detail.value
    });
  },
  /*获取页面 网点名称文本框的值*/
  input_wdmc(e) {
    this.setData({
      'formData.wdmc': e.detail.value
    });
  },
  /*获取交接件分拨名称 */
  input_jjjfbmc(e) {
    this.setData({
      'formData.jjjfbmc': e.detail.value
    })
  },
  /*选择交件到达分拨时间 */
  timePicker_ddfbsj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    self.setData({
      'formData.jjdksj': selectDate
    });
  },
  /*选择接件打卡离开时间 */
  timePicker_jjlksj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    self.setData({
      'formData.jjlksj': selectDate
    });
  },
  /*获取页面 退网原因描述文本框的值*/
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
  /*提交退网原因申请*/
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
    if (util.strIsEmpty(self.data.formData.jjjfbmc)) {
      self.setData({
        error: '请输入交接件分拨名称！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jjdksj)) {
      self.setData({
        error: '请选择交件到达分拨时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jjlksj)) {
      self.setData({
        error: '请选择接件打卡离开时间！'
      });
      return;
    }
    // if (util.strIsEmpty(self.data.formData.Reason)) {
    //   self.setData({
    //     error: '请输入申请原因'
    //   });
    //   return;
    // }
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
    var menuid = munePage.GetMenuCode("网点交接件时间维护申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "8f53ee1f-2035-4282-ad32-04b24e941872",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      'Input_StationCode': self.data.formData.wddm, //网点代码  
      'Input_StationName': self.data.formData.wdmc, //网点名称
      'HandoverGroupName': self.data.formData.jjjfbmc, //交接件分拨名称
      'DeliverClockInTime': self.data.formData.jjdksj, //交件打卡时间
      'ReceiveClockInTime':self.data.formData.jjlksj,//接件离开时间
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})
