// pages/afrom/jybb_xgsq/af_xgsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //网点层级选择事件
    wdcj_index: 0,
    wdcj_array: ['请选择', '一级', '二级'],
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
      wdcj: '', //网点层级  
      sheng: '', //省
      shengCode: '', //省代码
      wddz: '', //网点地址     
      dldh: '', //代理电话
      sfdj: '', //网点是否到件
      sfxgGIS: '', //是否修改GIS
      sfxgwdly: '', //是否修改网点路由
      sfxgwdjg: '', //是否修改网点价格      
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
  /*网点层级选中事件*/
  bindPickerChange_wdcj(e) {
    let wdcj = this.data.wdcj_array[e.detail.value];
    this.setData({
      'wdcj_index': e.detail.value,
      'formData.wdcj': wdcj,
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
      'cheng_index': 0
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
  /*获取页面 网点地址文本框的值*/
  input_wddz(e) {
    this.setData({
      'formData.wddz': e.detail.value
    });
  },
  /*获取页面 代理电话文本框的值*/
  input_dldh(e) {
    this.setData({
      'formData.dldh': e.detail.value
    });
  },
  /*获取页面 申请原因文本框的值*/
  input_Reason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },
  /*获取页面 用户选择是否到件*/
  radio_sfdj(e) {
    this.setData({
      'formData.sfdj': e.detail.value
    });
  },
  /*获取页面 用户选择是否修改GIS*/
  radio_sfxgGIS(e) {
    this.setData({
      'formData.sfxgGIS': e.detail.value
    });
  },
  /*获取页面 用户选择是否修改网点路由*/
  radio_sfxgwdly(e) {
    this.setData({
      'formData.sfxgwdly': e.detail.value
    });
  },
  /*获取页面 用户选择是否修改网点价格*/
  radio_sfxgwdjg(e) {
    this.setData({
      'formData.sfxgwdjg': e.detail.value
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

  /*提交网点信息修改申请*/
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
    if (util.strIsEmpty(self.data.formData.wdcj) || self.data.formData.wdcj == '请选择') {
      self.setData({
        error: '请选择网点层级'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.shengCode) || self.data.formData.shengCode == '0') {
      self.setData({
        error: '请选择 省区'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wddz)) {
      self.setData({
        error: '请输入网点地址'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.dldh)) {
      self.setData({
        error: '请输入代理电话'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfdj)) {
      self.setData({
        error: '请选择是否开关到件！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfxgGIS)) {
      self.setData({
        error: '请选择是否修改GIS地图！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfxgwdly)) {
      self.setData({
        error: '请选择是否修改网点路由！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfxgwdjg)) {
      self.setData({
        error: '请选择是否修改网点价格！'
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
    var menuid = munePage.GetMenuCode("网点信息修改申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_fb_applyupdateStationinformator",
      // "_flowid": "17f0658a-c006-4078-98c7-209c65516c3f",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "Input_StationName": self.data.formData.wdmc, //网点名称
      "Input_StationCode": self.data.formData.wddm, //网点代码
      "Input_StationLevel": self.data.formData.wdcj, //网点层级 
      'Input_ShengName': self.data.formData.sheng, //省
      'Input_Sheng': self.data.formData.shengCode, //省
      'Input_Address': self.data.formData.wddz, //网点地址
      'Input_Phone': self.data.formData.dldh, //代理电话
      'IsSwitchToPiece': self.data.formData.sfdj, //网点是否到件
      'IsUpdateGisMap': self.data.formData.sfxgGIS, //网点是否修改GIS地图
      'IsUpdateStationRoute': self.data.formData.sfxgwdly, //网点是否修改网点路由
      'IsUpdateStationFee': self.data.formData.sfxgwdjg, //网点是否修改网点价格
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self,paramData);   
  }
})