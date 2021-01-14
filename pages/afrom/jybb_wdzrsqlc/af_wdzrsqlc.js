// pages/afrom/jybb_wdzrsqlc/af_wdzrsqlc.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //省级选择事件
    sheng_index: 0,
    sheng_array_select: [],
    sheng_array: [],
    //城市级选择事件
    cheng_index: 0,
    cheng_array_select: [],
    cheng_array: [],
    //区县级选择事件
    qu_index: 0,
    qu_array_select: [],
    qu_array: [],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      zrwdmc: '', //转让网点名称
      zrwddm: '', //转让网点代码      
      sheng: '', //省
      shengCode: '', //省代码
      cheng: '', //市
      chengCode: '', //市代码
      qu: '', //区县
      quCode: '', //区县代码
      wddz: '', //网点地址
      sfdj: '', //转让网点是否到件
      wdjjqy: '',//网点经营区域
      zrffzr: '',//转让方负责人
      zrfgs: '',//转让方公司
      srffzr: '',//受让方负责人
      srfgs: '',//受让方公司
      zrfyjjmf: '', //转让方已交加盟费
      zrfyjyj: '', //转让方已交押金
      srfbjjmf: '', //受让方补交加盟费
      srfbjyj: '', //受让方补交押金
      sqsrffy: '', //收取受让方费用
      zrsxf: '', //转让手续费
      zrwdxtye: '', //转让网点系统余额
      zrqtzc: '', //转让其他资产
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

  /*获取页面 转让网点名称文本框的值*/
  input_zrwdmc(e) {
    this.setData({
      'formData.zrwdmc': e.detail.value
    });
  },
  /*获取页面 转让网点代码文本框的值*/
  input_zrwddm(e) {
    this.setData({
      'formData.zrwddm': e.detail.value
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
    if (cheng.value == "0") {
      return; //未选择
    }
    //查找绑定地区级级选项
    basicCommon.GetDBData_Qu(this, cheng.value); //获取地区
  },
  /*地区 选中事件*/
  bindPickerChange_qu(e) {
    let qu = this.data.qu_array[e.detail.value];
    if(qu !=null && qu != undefined){
      this.setData({
        'qu_index': e.detail.value,
        'formData.qu': qu.name,
        'formData.quCode': qu.value,
      });
    }
  },
  /*获取页面 网点地址文本框的值*/
  input_wddz(e) {
    this.setData({
      'formData.wddz': e.detail.value
    });
  },
  
  /*获取页面 用户选择是否到件*/
  radio_sfdj: function (e) {
    this.setData({
      'formData.sfdj': e.detail.value
    });
  },

  /*获取页面 网点经营区域的值 */
  input_wdjjqy(e) {
    this.setData({
      'formData.wdjjqy': e.detail.value
    });
  },
  
  /*获取页面 转让方负责人 */
  input_zrffzr(e) {
    this.setData({
      'formData.zrffzr': e.detail.value
    });
  },

  /*获取页面 转让方公司的值 */
  input_zrfgs(e) {
    this.setData({
      'formData.zrfgs': e.detail.value
    });
  },

  /*获取页面 受让方负责人的值 */
  input_srffzr(e) {
    this.setData({
      'formData.srffzr': e.detail.value
    });
  },

  /*获取页面 受让方公司的值 */
  input_srfgs(e) {
    this.setData({
      'formData.srfgs': e.detail.value
    });
  },
  
  /*获取页面 转让方已交加盟费 文本框的值*/
  input_zrfyjjmf(e) {
    this.setData({
      'formData.zrfyjjmf': this.money(e.detail.value)
    });
  },
  /*获取页面 转让方已交押金 文本框的值*/
  input_zrfyjyj(e) {
    this.setData({
      'formData.zrfyjyj': this.money(e.detail.value)
    });
  },
  /*获取页面 受让方补交加盟费 文本框的值*/
  input_srfbjjmf(e) {
    this.setData({
      'formData.srfbjjmf': this.money(e.detail.value)
    });
  },
  /*获取页面 受让方补交押金 文本框的值*/
  input_srfbjyj(e) {
    this.setData({
      'formData.srfbjyj': this.money(e.detail.value)
    });
  },
  /*获取页面 收取受让方费用 文本框的值*/
  input_sqsrffy(e) {
    this.setData({
      'formData.sqsrffy': this.money(e.detail.value)
    });
  },

  /*获取页面 转让手续费 文本框的值*/
  input_zrsxf(e) {
    this.setData({
      'formData.zrsxf': this.money(e.detail.value)
    });
  },

  /*获取页面 转让网点系统余额 文本框的值*/
  input_zrwdxtye(e) {
    this.setData({
      'formData.zrwdxtye': this.money(e.detail.value)
    });
  },
  /*获取页面 转让其他资产 文本框的值*/
  input_zrqtzc(e) {
    this.setData({
      'formData.zrqtzc': e.detail.value
    });
  },
  /**
  * @method: 金额输入限制
  * @params: val接收number值
  */
 money(val) {
  let num = val.toString(); //先转换成字符串类型
  if (num.indexOf('.') == 0) { //第一位就是 .
    num = '0' + num
  }
  num = num.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
  num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
  num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
  if (num.indexOf(".") < 0 && num != "") {
    num = parseFloat(num);
  }
  return num
},
  /*获取页面 申请原因 文本框的值*/
  input_Reason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },

  /*选择附件上传的方法*/
  chooseImage() {  basicCommon.afromUploadFile(this); },

  /*清除附件*/
  onClearAttachTap() { basicCommon.afromClearfileAttach(this); },

  /*提交网点转让申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.zrwddm)) {
      self.setData({
        error: '请输入转让网点代码！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zrwdmc)) {
      self.setData({
        error: '请输入转让网点名称！'
      });
      return;
    }
    
    if (util.strIsEmpty(self.data.formData.shengCode) 
      || self.data.formData.shengCode == '0' || util.strIsEmpty(self.data.formData.chengCode)
      ||util.strIsEmpty(self.data.formData.quCode)) {
      self.setData({
        error: '请选择 省/市/区 三个选项的地址！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wddz)) {
      self.setData({
        error: '请输入网点地址'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfdj)) {
      self.setData({
        error: '请选择是否到件！'
      });
      return;
    }
    
    if (util.strIsEmpty(self.data.formData.zrffzr)) {
      self.setData({
        error: '请输入转让方负责人'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zrfgs)) {
      self.setData({
        error: '请输入转让方公司'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.srffzr)) {
      self.setData({
        error: '请输入受让方负责人'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.srfgs)) {
      self.setData({
        error: '请输入受让方公司'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zrfyjjmf)) {
      self.setData({
        error: '请输入转让方已交加盟费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zrfyjyj)) {
      self.setData({
        error: '请输入转让方已交押金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.srfbjjmf)) {
      self.setData({
        error: '请输入受让方补交加盟费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.srfbjyj)) {
      self.setData({
        error: '请输入受让方补交押金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sqsrffy)) {
      self.setData({
        error: '请输入收取受让方费用'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zrsxf)) {
      self.setData({
        error: '请输入转让手续费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zrwdxtye)) {
      self.setData({
        error: '请输入转让网点系统余额'
      });
      return;
    }
    // if (util.strIsEmpty(self.data.formData.zrqtzc)) {
    //   self.setData({
    //     error: '请输入转让其他资产'
    //   });
    //   return;
    // }
    // if (util.strIsEmpty(self.data.formData.Reason)) {
    //   self.setData({
    //     error: '请输入申请原因'
    //   });
    //   return;
    // }
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
    var menuid = munePage.GetMenuCode("网点转让申请流程");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }

    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "abf3c5ef-db5b-4e2c-97a2-be0cecc83b04",
      "SubTitle": "FB-JYBB-",
      "Division": self.data.formData.szfb, //所在分部
      "DivisionID": self.data.formData.szfbbm, // 所在分部编码
      "ZRStationCode": self.data.formData.zrwddm, //转让网点代码
      "ZRStationName": self.data.formData.zrwdmc, //转让网点名称
      'ProvinceText':self.data.formData.sheng, //省
      'Input_Sheng':self.data.formData.shengCode, //省代码
      'CityText':self.data.formData.cheng, //市
      'Input_Shi':self.data.formData.chengCode, //市代码
      'CountyText':self.data.formData.qu, //区县
      'Input_qu':self.data.formData.quCode, //区县代码
      'Input_Address':self.data.formData.wddz,//网点地址
      "Input_Ifdaojian":self.data.formData.sfdj, //转让网点是否到件 
      "WDJYQY":self.data.formData.wdjjqy, //网点经营区域
      "ZRFFZR":self.data.formData.zrffzr, //转让方负责人
      "ZRFGS":self.data.formData.zrfgs, //转让方公司
      "SRFFZR":self.data.formData.srffzr, //受让方负责人
      "SRFGS":self.data.formData.srfgs, //受让方公司
      "ZRFYJJMF":self.data.formData.zrfyjjmf, //转让方已交加盟费
      "ZRFYJYJ":self.data.formData.zrfyjyj, //转让方已交押金
      "SRFBJJMF":self.data.formData.srfbjjmf, //受让方补交加盟费
      "SRFBJYJ":self.data.formData.srfbjyj, //受让方补交押金
      "SQSRFFY":self.data.formData.sqsrffy, //收取受让方费用
      "ZRSXF":self.data.formData.zrsxf, //转让手续费
      "ZRWDXTYE":self.data.formData.zrwdxtye, //转让网点系统余额
      "ZRQTZC":self.data.formData.zrqtzc, //转让其他资产
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self,paramData);    
  }
})