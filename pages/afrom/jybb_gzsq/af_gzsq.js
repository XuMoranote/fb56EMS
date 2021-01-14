// pages/afrom/jybb_gzsq/af_gzsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //所属业务选择事件
    ssyw_index: 0,
    ssyw_array: ['请选择', '加盟省区', '加盟网点'],
    //签订性质选择事件
    qdxz_index: 0,
    qdxz_array: ['请选择', '新签', '续签', '换签', '转让'],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      ssyw: '', //所属业务
      yzzt: '飞豹物流集团有限公司', // 印章主体
      sqwdmc: '', //网点名称
      sqwddm: '', //网点代码
      qdxz: '', //签订性质      
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
  /*所属业务选中事件*/
  bindPickerChange_ssyw(e) {
    let ssyw = this.data.ssyw_array[e.detail.value];
    this.setData({
      'ssyw_index': e.detail.value,
      'formData.ssyw': ssyw,
    });
  },
  /*签订性质选中事件*/
  bindPickerChange_qdxz(e) {
    let qdxz = this.data.qdxz_array[e.detail.value];
    this.setData({
      'qdxz_index': e.detail.value,
      'formData.qdxz': qdxz,
    });
  },
  /*获取页面 印章主体文本框的值*/
  input_wdmc(e) {
    this.setData({
      'formData.yzzt': e.detail.value
    });
  },
  /*获取页面 网点名称文本框的值*/
  input_sqwdmc(e) {
    this.setData({
      'formData.sqwdmc': e.detail.value
    });
  },
  /*获取页面 网点代码文本框的值*/
  input_sqwddm(e) {
    this.setData({
      'formData.sqwddm': e.detail.value
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
  /*提交 加盟合同签订盖章申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交

    if (util.strIsEmpty(self.data.formData.ssyw) || self.data.formData.ssyw == '请选择') {
      self.setData({
        error: '请选择所属业务'
      });
      return;
    }
    // if (util.strIsEmpty(self.data.formData.yzzt)) {
    //   self.setData({
    //     error: '请输入印章主体！'
    //   });
    //   return;
    // }
    if (util.strIsEmpty(self.data.formData.sqwdmc)) {
      self.setData({
        error: '请输入省区/网点名称！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sqwddm)) {
      self.setData({
        error: '请输入省区/网点代码！'
      });
      return;
    }
    if ((util.strIsEmpty(self.data.formData.qdxz) || self.data.formData.qdxz == '请选择')) {
      self.setData({
        error: '请选择 签订性质'
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
        var menuid = munePage.GetMenuCode("加盟合同签订盖章申请");
        if (Number(menuid) <= 0) {
          self.setData({
            error: '获取菜单ID异常！'
          });
          return;
        }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_fb_applyfranchisecontractseal",
      // "_flowid": "ceda285f-64b8-46a4-980c-b5f5e303eace",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "Business": self.data.formData.ssyw, // 所属业务 
      "SealBody": self.data.formData.yzzt, // 印章主体
      "ProvincialAreaOrStationName": self.data.formData.sqwdmc, //网点名称
      "ProvincialAreaOrStationID": self.data.formData.sqwddm, //网点代码
      "NatureOfSigning": self.data.formData.qdxz, //签订性质      
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})