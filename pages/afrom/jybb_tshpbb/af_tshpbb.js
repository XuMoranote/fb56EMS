// pages/afrom/jybb_tshpbb/af_tshpbb.js
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
    gjspcycl_index: 0,
    gjspcycl_array: ['请选择', '是', '否'],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      wddm: '', //网点代码  
      wdmc: '', //网点名称
      yskssj: '', //运输开始时间
      ysjssj: '', //运输结束时间
      khmc: '', //客户名称  
      lxfs: '', //联系方式  
      hwmc: '', //货物名称
      hwlx: '', //货物类型
      yjhl: '', //月均货量
      cpbz: '', //产品包装
      hwlx2: '',//货物流向
      hwwh: '',//货物危害
      djcc: '',//单件尺寸
      djzl: '',//单件重量
      pslcnz: '',//十万件破损率承诺值
      tshwbzj: '',//特殊货物保证金
      gjspcycl: '',//是否有国家审批承运材料
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
  /*选择 运输开始时间 */
  bindPickerChange_yskssj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " 
      // +  util.padLeft(date[3], 2) + ":" +
      // util.padLeft(date[4], 2);
    self.setData({
      'formData.yskssj': selectDate
    });
  },
  /*选择 运输结束时间 */
  bindPickerChange_ysjssj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " 
      // +  util.padLeft(date[3], 2) + ":" +
      // util.padLeft(date[4], 2);
    self.setData({
      'formData.ysjssj': selectDate
    });
  },
  /*获取页面 客户名称文本框的值*/
  input_khmc(e) {
    this.setData({
      'formData.khmc': e.detail.value
    });
  },
  /*获取页面 联系方式文本框的值*/
  input_lxfs(e) {
    this.setData({
      'formData.lxfs': e.detail.value
    });
  },
  /*获取页面 货物名称文本框的值*/
  input_hwmc(e) {
    this.setData({
      'formData.hwmc': e.detail.value
    });
  },
  /*获取页面 货物类型文本框的值*/
  input_hwlx(e) {
    this.setData({
      'formData.hwlx': e.detail.value
    });
  },
  /*获取页面 月均货量文本框的值*/
  input_yjhl(e) {
    this.setData({
      'formData.yjhl': e.detail.value
    });
  },
  /*获取页面 产品包装文本框的值*/
  input_cpbz(e) {
    this.setData({
      'formData.cpbz': e.detail.value
    });
  },
  /*获取页面 货物流向文本框的值*/
  input_hwlx2(e) {
    this.setData({
      'formData.hwlx2': e.detail.value
    });
  },
  /*获取页面 货物危害文本框的值*/
  input_hwwh(e) {
    this.setData({
      'formData.hwwh': e.detail.value
    });
  },
  /*获取页面 单件尺寸文本框的值*/
  input_djcc(e) {
    this.setData({
      'formData.djcc': e.detail.value
    });
  },
  /*获取页面 单件重量文本框的值*/
  input_djzl(e) {
    this.setData({
      'formData.djzl': e.detail.value
    });
  },
  /*获取页面 十万件破损率承诺值文本框的值*/
  input_pslcnz(e) {
    this.setData({
      'formData.pslcnz': e.detail.value
    });
  },
  /*获取页面 特殊货物保证金文本框的值*/
  input_tshwbzj(e) {
    this.setData({
      'formData.tshwbzj': this.money(e.detail.value)
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
  /* 是否有国家审批承运材料 */
  bindPickerChange_gjspcycl(e) {
    let gjspcycl = this.data.gjspcycl_array[e.detail.value];
    this.setData({
      'gjspcycl_index': e.detail.value,
      'formData.gjspcycl': gjspcycl,
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
  /*提交特殊货品报备*/
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
    if (util.strIsEmpty(self.data.formData.yskssj)) {
      self.setData({
        error: '请选择运输开始时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.ysjssj)) {
      self.setData({
        error: '请选择运输结束时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.khmc)) {
      self.setData({
        error: '请输入客户名称！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.lxfs)) {
      self.setData({
        error: '请输入联系方式！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.hwmc)) {
      self.setData({
        error: '请输入货物名称！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.hwlx)) {
      self.setData({
        error: '请输入货物类型！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.yjhl)) {
      self.setData({
        error: '请输入月均货量！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.cpbz)) {
      self.setData({
        error: '请输入产品包装！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.hwlx2)) {
      self.setData({
        error: '请输入货物流向！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.hwwh)) {
      self.setData({
        error: '请输入货物危害！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.djcc)) {
      self.setData({
        error: '请输入单件尺寸！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.djzl)) {
      self.setData({
        error: '请输入单件重量！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.pslcnz)) {
      self.setData({
        error: '请输入十万件破损率承诺值！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.tshwbzj)) {
      self.setData({
        error: '请输入特殊货物保证金！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.gjspcycl) || self.data.formData.gjspcycl == '请选择') {
      self.setData({
        error: '请选择是否有国家审批承运材料'
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
    var menuid = munePage.GetMenuCode("特殊货品报备");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "db18b94d-079e-44e0-ba3f-7cbdce96e8a2",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      'Input_StationCode': self.data.formData.wddm, //网点代码  
      'Input_StationName': self.data.formData.wdmc, //网点名称
      'ysksjj': self.data.formData.yskssj,//运输开始时间
      'ysjsjj': self.data.formData.ysjssj,//运输结束时间
      'khmc': self.data.formData.khmc,//客户名称
      'lxfs': self.data.formData.lxfs,//联系方式
      'hwmc': self.data.formData.hwmc, //货物名称
      'hwlxType': self.data.formData.hwlx, //货物类型
      'yjhl': self.data.formData.yjhl, //月均货量  
      'cpbz': self.data.formData.cpbz, //产品包装  
      'hwlx': self.data.formData.hwlx2,//货物流向
      'hwwh': self.data.formData.hwwh,//货物危害
      'djcc': self.data.formData.djcc,//单件尺寸
      'djzl': self.data.formData.djzl,//单件重量
      'swjpslcnz': self.data.formData.pslcnz,//十万件破损率承诺值
      'tshwbzj': self.data.formData.tshwbzj,//特殊货物保证金
      'sfygjspcycl': self.data.formData.gjspcycl,//是否有国家审批承运材料
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})