// pages/afrom/jybb_zcsq/af_zcsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //特殊区域 是否隐藏
    tsqylx_hidden:false,
    //网点层级选择事件
    sqlx_index: 0,
    sqlx_array: ['请选择', '价格调整', '特殊区域'],
    //特殊区域类型
    tsqylx_index: 0,
    tsqylx_array: ['请选择', '加收', '加时', '乡镇上自提', '网点自提'],
    //省级选择事件
    sheng_index: 0,
    sheng_array_select: [],
    sheng_array: [],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      wdmc: '', //网点名称
      wddm: '', //网点代码
      sqlx: '', //申请类型
      tsqylx: '', //特殊区域类型
      sheng: '', //省
      shengCode: '', //省代码
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
    basicCommon.GetDBData_Sheng(this); //获取省级信息    
  },
  /*申请类型选中事件*/
  bindPickerChange_sqlx(e) {
    let sqlx = this.data.sqlx_array[e.detail.value];
    this.setData({
      'sqlx_index': e.detail.value,
      'formData.sqlx': sqlx,
    });
    if(sqlx == "价格调整")
    {
      this.setData({     
        tsqylx_hidden:true,
        'formData.tsqylx':"请选择"
      });
    }else{
      this.setData({  
        tsqylx_hidden:false,
        'formData.tsqylx':"请选择"
      });
    }
  },
  /*特殊区域类型选中事件*/
  bindPickerChange_tsqylx(e) {
    let tsqylx = this.data.tsqylx_array[e.detail.value];
    this.setData({
      'tsqylx_index': e.detail.value,
      'formData.tsqylx': tsqylx,
    });
  },
  /*省选中事件*/
  bindPickerChange_sheng(e) {
    let that = this;
    let sheng = that.data.sheng_array[e.detail.value];
    that.setData({
      'sheng_index': e.detail.value,
      'formData.sheng': sheng.name,
      'formData.shengCode': sheng.value,
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
  /*提交特殊政策申请*/
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
    if (util.strIsEmpty(self.data.formData.sqlx) || self.data.formData.sqlx == '请选择') {
      self.setData({
        error: '请选择申请类型'
      });
      return;
    } else if ((self.data.formData.sqlx == '特殊区域') &&
      (util.strIsEmpty(self.data.formData.tsqylx) || self.data.formData.tsqylx == '请选择')) {
      self.setData({
        error: '请选择 特殊区域类型'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.shengCode) || self.data.formData.shengCode == '0') {
      self.setData({
        error: '请选择 省区'
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
    var menuid = munePage.GetMenuCode("特殊政策申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_fb_specialarea",
      // "_flowid": "2554c709-53ed-4917-ad15-de46797acd08",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "Input_StationName": self.data.formData.wdmc, //网点名称
      "Input_StationCode": self.data.formData.wddm, //网点代码
      "ApplicationType": self.data.formData.sqlx, //申请类型
      "SpecialAreaType": self.data.formData.tsqylx, //特殊区域类型      
      'ProvinceCH': self.data.formData.sheng, //省
      'ProvinceText': self.data.formData.shengCode, //省编码
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self,paramData);
  }
})