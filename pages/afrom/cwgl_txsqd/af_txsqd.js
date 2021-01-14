// pages/afrom/cwgl_txsqd/af_txsqd.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {    
    //提现类型
    txlx_index: 0,
    txlx_array: ['请选择', '正常提现', '退网提现', '押金抵欠款提现'],
    formData: {   
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      wdmc: '',//网点名称
      wddm: '',//网点代码
      dqye: '',//当前余额
      txlx: '',//提现类型
      txje: '',//提现金额
      khr: '',//开户人
      khrzh: '',//开户人账户
      KHBank: '',//开户银行
      Reason: '', //申请原因
      fileAttach: [], //附件   
    },
    isManySubmit: true, //提交时，不允许多次提交 变量设置。
    operation_fylxItem: {}, //运算变量,临时存放费用类型item集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ //获取当前人员姓名用户信息
      isManySubmit: true, //初始化允许提交      
      'formData.UserName': app.globalData.userInfo.UserName,
      'formData.UserCode': app.globalData.userInfo.UserCode,
      "formData.szfb": app.globalData.userInfo.PdepartmentName,
      'formData.szfbbm': app.globalData.userInfo.PdepartmentCode,
    });
  },
     
  /** 网点名称 */
  input_wdmc (e) {
    this.setData({
      'formData.wdmc': e.detail.value
    });
  },

  /** 网点代码 */
  input_wddm (e) {
    this.setData({
      'formData.wddm': e.detail.value
    })
  },
  /** 当前余额 */
  input_dqye:function(event) {
    this.setData({
      'formData.dqye': this.money(event.detail.value)  //money匹配金额输入规则，返回输入值
    })
  },
  /** 提现类型 */
  bindPickerChange_txlx(e) {
    let txlx = this.data.txlx_array[e.detail.value];
    this.setData({
      'txlx_index': e.detail.value,
      'formData.txlx': txlx,
    })
  },
  /* 提现金额*/
  input_txje:function(event) {
    this.setData({
      'formData.txje': this.money(event.detail.value)  //money匹配金额输入规则，返回输入值
    });
  },
  /** 开户人 */
  input_khr(e) {
    this.setData({
      'formData.khr': e.detail.value
    });
  },
  /* 开户人账户 */
  input_khrzh(e) {
    var card = e.detail.value;
    card = card.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    this.setData({
      'formData.khrzh': card,
    });
  },
  /*获取页面 开户银行 文本框的值*/
  input_KHBank(e) {
    this.setData({
      'formData.KHBank': e.detail.value
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
    if (util.strIsEmpty(self.data.formData.wddm)) {
      self.setData({
        error: '请输入网点代码！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.dqye)) {
      self.setData({
        error: '请输入当前余额！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.txlx) || self.data.formData.txlx == '请选择') {
      self.setData({
        error: '请选择提现类型! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.txje)) {
      self.setData({
        error: '请输入提现金额！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.khr)) {
      self.setData({
        error: '请输入开户人! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.khrzh)) {
      self.setData({
        error: '请输入开户人账号! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.KHBank)) {
      self.setData({
        error: '请输入开户银行! '
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
    var menuid = munePage.GetMenuCode("提现申请单");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "6d718142-8ffd-467b-b302-1a6a3ba22719",
      "SubTitle": "FB-TXSQD-",
      "Division": self.data.formData.szfb, //所在分部
      "DivisionID": self.data.formData.szfbbm, // 所在分部编码
      "StationName": self.data.formData.wdmc,//网点名称
      "StationID": self.data.formData.wddm,//网点代码
      "Balance": self.data.formData.dqye,//当前余额
      "WithdrawDepositType": self.data.formData.txlx,//提现类型
      "CashWithdrawalAmount": self.data.formData.txje,//提现金额
      "AccountHolder": self.data.formData.khr,//开户人
      "AccountNumber": self.data.formData.khrzh,//开户人账户
      "BankOfDeposit": self.data.formData.KHBank,//开户银行
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self,paramData);    
  },
})