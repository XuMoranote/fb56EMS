// pages/afrom/jybb_fyba/af_fyba.js --新开网点--费用备案
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
    //城市级选择事件
    cheng_index: 0,
    cheng_array_select: [],
    cheng_array: [],
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
      cheng: '', //市
      chengCode: '', //市代码
      sfdj: '', //网点是否到件
      sffgmq: '', //是否覆盖盲区
      ssjmf: '', //实收加密费
      ssbzj: '', //实收保证金
      sswgf: '', //实收网管费
      sszzzzbzj: '', //实收证照资质保证金
      sszxbzj: '', //实收装修保证金
      jmfjmje: '', //加盟费减免金额
      bzjjmje: '', //保证金减免金额
      wgfjmje: '', //网管费减免金额
      zzzzbzjjmje: '', //证照资质保证金减免金额
      zxbzjjmje: '', //装修保证金减免金额
      jmzje: '', //减免总金额
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
    let sheng = this.data.sheng_array[e.detail.value];
    this.setData({
      'sheng_index': e.detail.value,
      'formData.sheng': sheng.name,
      'formData.shengCode': sheng.value,
      'cheng_index': 0
    });
    if (sheng.value == "0") {
      return; //未选择
    }
    //查找绑定城市级级选项
    basicCommon.GetDBData_Cheng(that, sheng.value); //获取市级信息
  },
  /*城市 选中事件*/
  bindPickerChange_cheng(e) {
    let cheng = this.data.cheng_array[e.detail.value];
    this.setData({
      'cheng_index': e.detail.value,
      'formData.cheng': cheng.name,
      'formData.chengCode': cheng.value,
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
  /*获取页面 用户选择是否到件*/
  radio_sfdj: function (e) {
    this.setData({
      'formData.sfdj': e.detail.value
    });
  },
  /*获取页面 用户选择是否覆盖盲区*/
  radio_sffgmq: function (e) {
    this.setData({
      'formData.sffgmq': e.detail.value
    });
  },
  /*获取页面 实收加盟费 文本框的值*/
  input_ssjmf(e) {
    this.setData({
      'formData.ssjmf': e.detail.value
    });
  },
  /*获取页面 实收保证金 文本框的值*/
  input_ssbzj(e) {
    this.setData({
      'formData.ssbzj': e.detail.value
    });
  },
  /*获取页面 实收网管费 文本框的值*/
  input_sswgf(e) {
    this.setData({
      'formData.sswgf': e.detail.value
    });
  },
  /*获取页面 实收证照资质保证金 文本框的值*/
  input_sszzzzbzj(e) {
    this.setData({
      'formData.sszzzzbzj': e.detail.value
    });
  },
  /*获取页面 实收装修保证金 文本框的值*/
  input_sszxbzj(e) {
    this.setData({
      'formData.sszxbzj': e.detail.value
    });
  },

  /*获取页面 加盟费减免 文本框的值*/
  input_jmfjmje(e) {
    this.setData({
      'formData.jmfjmje': e.detail.value
    });
    this.sum_jmzje(); //计算减免总金额
  },

  /*获取页面 保证金减免 文本框的值*/
  input_bzjjmje(e) {
    this.setData({
      'formData.bzjjmje': e.detail.value
    });
    this.sum_jmzje(); //计算减免总金额
  },
  /*获取页面 网络管理费减免 文本框的值*/
  input_wgfjmje(e) {
    this.setData({
      'formData.wgfjmje': e.detail.value
    });
    this.sum_jmzje(); //计算减免总金额
  },

  /*获取页面 证照资质保证金减免 文本框的值*/
  input_zzzzbzjjmje(e) {
    this.setData({
      'formData.zzzzbzjjmje': e.detail.value
    });
    this.sum_jmzje(); //计算减免总金额
  },
  /*获取页面 装修保证金减免 文本框的值*/
  input_zxbzjjmje(e) {
    this.setData({
      'formData.zxbzjjmje': e.detail.value
    });
    this.sum_jmzje(); //计算减免总金额
  },
  /*获取页面 减免总金额 文本框的值*/
  input_jmzje(e) {
    this.setData({
      'formData.jmzje': e.detail.value
    });
  },
  /*获取页面 申请原因 文本框的值*/
  input_Reason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },
  /*自动计算减免费用总金额*/
  sum_jmzje() {
    let jmzje = Number(this.data.formData.jmfjmje) //加盟费减免金额
      +
      Number(this.data.formData.bzjjmje) //保证金减免金额
      +
      Number(this.data.formData.wgfjmje) //网管费减免金额
      +
      Number(this.data.formData.zzzzbzjjmje) //证照资质保证金减免金额
      +
      Number(this.data.formData.zxbzjjmje); //装修保证金减免金额
    this.setData({
      'formData.jmzje': jmzje
    });
  },

  /*选择附件上传的方法*/
  chooseImage() {  basicCommon.afromUploadFile(this); },

  /*清除附件*/
  onClearAttachTap() { basicCommon.afromClearfileAttach(this); },

  /*提交费用备案*/
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
    if (util.strIsEmpty(self.data.formData.wdcj) || self.data.formData.wdcj == '请选择') {
      self.setData({
        error: '请选择网点层级'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.shengCode) ||
      self.data.formData.shengCode == '0' || util.strIsEmpty(self.data.formData.chengCode)) {
      self.setData({
        error: '请选择省或者市 地址！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfdj)) {
      self.setData({
        error: '请选择是否到件！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sffgmq)) {
      self.setData({
        error: '请选择是否覆盖盲区'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.ssjmf)) {
      self.setData({
        error: '请输入实收加盟费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.ssbzj)) {
      self.setData({
        error: '请输入实收保证金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sswgf)) {
      self.setData({
        error: '请输入实收网络管理费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sszzzzbzj)) {
      self.setData({
        error: '请输入实收证照资质保证金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sszxbzj)) {
      self.setData({
        error: '请输入实收装修保证金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jmfjmje)) {
      self.setData({
        error: '请输入加盟费减免金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.bzjjmje)) {
      self.setData({
        error: '请输入保证金减免金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wgfjmje)) {
      self.setData({
        error: '请输入网络管理费减免金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zzzzbzjjmje)) {
      self.setData({
        error: '请输入证照资质保证金减免金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zxbzjjmje)) {
      self.setData({
        error: '请输入装修保证金减免金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jmzje)) {
      self.setData({
        error: '请输入减免总金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入申请原因'
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    //获取菜单ID
    var menuid = munePage.GetMenuCode("新开网点费用备案");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_fb_newstationfeeapplication",
      // "_flowid": "f355bfef-ca79-4db5-a5a7-f1a858349864",
      "SubTitle": "FB-JYBB-",
      "Division": self.data.formData.szfb, //所在分部
      "DivisionID": self.data.formData.szfbbm, // 所在分部编码
      "StationName": self.data.formData.wdmc, //网点名称
      "StationID": self.data.formData.wddm, //网点代码
      "StationLevel": self.data.formData.wdcj, //网点层级 
      "province": self.data.formData.sheng, //省 
      "provinceID": self.data.formData.shengCode, //省代码 
      "City": self.data.formData.cheng, //市 
      "CityID": self.data.formData.chengCode, //市代码 
      "IsArrival": self.data.formData.sfdj, //网点是否到件 
      "IsCoverageHole": self.data.formData.sffgmq, //是否覆盖盲区 
      "ApplyPaidInFranchiseFee": self.data.formData.ssjmf, //实收加盟费 
      "ApplyPaidInMargin": self.data.formData.ssbzj, //实收保证金 
      "ApplyNetworkManagementFee": self.data.formData.sswgf, //实收网管费 
      "ApplyCertificateQualificationDeposit": self.data.formData.sszzzzbzj, //实收证照资质保证金 
      "ApplyDecorationDeposit": self.data.formData.sszxbzj, //实收装修保证金
      "AmountOfFranchiseFeeDeduction": self.data.formData.jmfjmje, //加盟费减免金额
      "AmountOfMarginRelief": self.data.formData.bzjjmje, //保证金减免金额
      "FreeNetworkManagement": self.data.formData.wgfjmje, //网管费减免金额
      "CertificateMarginDeduction": self.data.formData.zzzzbzjjmje, //证照资质保证金减免金额
      "DeductionOfDecorationDeposit": self.data.formData.zxbzjjmje, //装修保证金减免金额
      "TotalDeduction": self.data.formData.jmzje, //减免总金额
      "ReasonsForApplication": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self,paramData);    
  }
})