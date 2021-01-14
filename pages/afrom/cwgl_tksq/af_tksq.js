// pages/afrom/cwgl_tksq/af_tksq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //工作流类型
    gzllx_index: 0,
    gzllx_array: ['请选择', '网点类退款申请工作流', '线路类退款申请工作流', '项目退保证金申请工作流'],
    gzllx2_index: 0,
    gzllx2_array: [],
    gzllx3_index: 0,
    gzllx3_array: [],
    //工作流类型数据集
    _waydata: [{
      text: '网点类退款申请工作流',
      children: [{
        text: '网点',
        children: [{
          text: '退加盟保证金'
        }, {
          text: '退意向金'
        }]
      }]
    }, {
      text: '线路类退款申请工作流',
      children: [{
        text: '退线路押金',
        children: [{
          text: '退线路押金'
        }]
      }, {
        text: '退招标保证金',
        children: [{
          text: '退招标保证金'
        }]
      }, {
        text: '退履约保证金',
        children: [{
          text: '退履约保证金'
        }]
      }]
    }, {
      text: '项目退保证金申请工作流',
      children: [{
        text: '退履约保证金-仓配',
        children: [{
          text: '退履约保证金-仓配'
        }]
      }, {
        text: '退招标保证金-仓配',
        children: [{
          text: '退招标保证金-仓配'
        }]
      }, {
        text: '退履约保证金-运输',
        children: [{
          text: '退履约保证金-运输'
        }]
      }, {
        text: '退招标保证金-运输',
        children: [{
          text: '退招标保证金-运输'
        }]
      }]
    }],
    //公司主体
    gszt_index: 0,
    gszt_array: ['请选择', '飞豹物流集团有限公司', '上海中铁迅驰货物运输有限公司', '中铁物流江苏有限公司', '中铁物流集团湖北有限公司', '中铁物流集团浙江物流有限公司'],
    //账户性质选择事件
    zhxz_index: 0,
    zhxz_array: ['请选择', '职员', '供应商', '客户'],
    //收款账户性质
    skzhxz_index: 0,
    skzhxz_array: ['请选择', '对私账户', '对公账户'],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      gzllx: '', //工作流类型
      gzllx2: '', //工作流类型
      gzllx3: '', //工作流类型
      gszt: '', //公司主体
      skf: '', //收款方  
      zhxz: '', //账户性质
      skzhxz: '', //收款账户性质
      BankAccount: '', //银行账号
      KHBank: '', //开户银行
      KHZHBank: '', //开户支行
      bxj: null, //报销金额
      kkj: '', //扣款金额
      fkj: '', //付款金额
      yfjk: '', //预付(借款)金额
      fkjdx: '', //付款金额大写
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
      "formData.szfb": app.globalData.userInfo.PdepartmentName,
      'formData.szfbbm': app.globalData.userInfo.PdepartmentCode,
    });
    basicCommon.GetSub(this, "MainCompany"); //获取公司主体
  },

  /*工作流类型*/
  bindPickerChange_gzllx(e) {
    let gzllx = this.data.gzllx_array[e.detail.value];
    let gzllx2 = [];
    let gzllx3 = [];
    this.data._waydata.forEach(element => {
      if (element.text == gzllx) {
        gzllx2.push('请选择');
        element.children.forEach(item => {
          gzllx2.push(item.text);
        });
      }
    });
    this.setData({
      'gzllx_index': e.detail.value,
      'formData.gzllx': gzllx,
      'gzllx2_index': 0,
      'gzllx2_array': gzllx2,
      'gzllx3_index': 0,
      'gzllx3_array': [],
    });
  },
  bindPickerChange_gzllx2(e) {
    let gzllx2 = this.data.gzllx2_array[e.detail.value];
    let gzllx3 = [];
    this.data._waydata.forEach(element => {
      element.children.forEach(item => {
        if (item.text == gzllx2) {
          gzllx3.push('请选择');
          item.children.forEach(ite => {
            gzllx3.push(ite.text);
          });
        }
      });
    });
    gzllx3 = this.unique(gzllx3);
    this.setData({
      'gzllx2_index': e.detail.value,
      'formData.gzllx2': gzllx2,
      'gzllx3_index': 0,
      'gzllx3_array': gzllx3,
    });
  },
  bindPickerChange_gzllx3(e) {
    let gzllx3 = this.data.gzllx3_array[e.detail.value];
    this.setData({
      'gzllx3_index': e.detail.value,
      'formData.gzllx3': gzllx3,
    });
  },
  /**数组去重方法 */
  unique: function (arr) {
    if (!Array.isArray(arr)) {
      console.log('type error!')
      return
    }
    let res = [arr[0]]
    for (let i = 1; i < arr.length; i++) {
      let flag = true
      for (let j = 0; j < res.length; j++) {
        if (arr[i] === res[j]) {
          flag = false;
          break
        }
      }
      if (flag) {
        res.push(arr[i])
      }
    }
    return res
  },
  /*公司主体*/
  bindPickerChange_gszt(e) {
    let gszt = this.data.gszt_array[e.detail.value];
    this.setData({
      'gszt_index': e.detail.value,
      'formData.gszt': gszt,
    })
  },
  /*账户性质选中事件*/
  bindPickerChange_zhxz(e) {
    let zhxz = this.data.zhxz_array[e.detail.value];
    this.setData({
      'zhxz_index': e.detail.value,
      'formData.zhxz': zhxz,
    });
  },
  /*收款账户性质选中事件 */
  bindPickerChange_skzhxz(e) {
    let skzhxz = this.data.skzhxz_array[e.detail.value];
    this.setData({
      'skzhxz_index': e.detail.value,
      'formData.skzhxz': skzhxz,
    })
  },
  /*获取页面 收款方文本框的值*/
  input_skf(e) {
    this.setData({
      'formData.skf': e.detail.value
    });
  },
  /*获取页面 银行账号 文本框的值*/
  input_BankAccount(e) {
    var card = e.detail.value;
    card = card.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    this.setData({
      'formData.BankAccount': card,
    });
  },
  /*获取页面 开户银行 文本框的值*/
  input_KHBank(e) {
    this.setData({
      'formData.KHBank': e.detail.value
    });
  },
  /*获取页面 开户支行 文本框的值*/
  input_KHZHBank(e) {
    this.setData({
      'formData.KHZHBank': e.detail.value
    });
  },
  /*获取页面 报销金额 文本框的值*/
  input_bxj: function (event) {
    this.setData({
      'formData.bxj': this.money(event.detail.value) //money匹配金额输入规则，返回输入值
    });
    this.sub_fkj(); //计算付款金额
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
    num = num.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (num.indexOf(".") < 0 && num != "") {
      num = parseFloat(num);
    }
    return num
  },
  /*获取页面 扣款金额 文本框的值*/
  input_kkj: function (event) {
    this.setData({
      'formData.kkj': this.money(event.detail.value)
    });
    this.sub_fkj(); //计算付款金额
  },

  /*获取页面 付款金额 文本框的值*/
  input_fkj: function (event) {
    this.setData({
      'formData.fkj': this.money(event.detail.value),
      'formData.fkjdx': util.ZHMoney(this.money(event.detail.value))
    });
  },
  /*自动计算付款金额 */
  sub_fkj() {
    let fkj = Number(this.data.formData.bxj) //报销金额
      -
      Number(this.data.formData.kkj); //扣款金额
    this.setData({
      'formData.fkj': fkj,
      'formData.fkjdx': util.ZHMoney(fkj)
    });
  },
  /*获取页面 预付(借款)金额 文本框的值*/
  input_yfjk: function (event) {
    this.setData({
      'formData.yfjk': this.money(event.detail.value)
    });
  },
  /*获取页面 申请原因 文本框的值*/
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

  /*提交费用备案*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.gzllx) || self.data.formData.gzllx == '请选择') {
      self.setData({
        error: '请选择工作流类型1! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.gzllx2) || self.data.formData.gzllx2 == '请选择') {
      self.setData({
        error: '请选择工作流类型2! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.gzllx3) || self.data.formData.gzllx3 == '请选择') {
      self.setData({
        error: '请选择工作流类型3! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.gszt) || self.data.formData.gszt == '请选择') {
      self.setData({
        error: '请选择公司主体!'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.skf)) {
      self.setData({
        error: '请输入收款方！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zhxz) || self.data.formData.zhxz == '请选择') {
      self.setData({
        error: '请选择账户性质! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.skzhxz) || self.data.formData.skzhxz == '请选择') {
      self.setData({
        error: '请选择收款账户性质!'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.BankAccount)) {
      self.setData({
        error: '请输入银行账号! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.KHBank)) {
      self.setData({
        error: '请输入开户银行! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.KHZHBank)) {
      self.setData({
        error: '请输入开户支行! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.bxj)) {
      self.setData({
        error: '请输入报销金额 '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.kkj)) {
      self.setData({
        error: '请输入扣款金额'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.fkj)) {
      self.setData({
        error: '请输入付款金额'
      });
      return;
    }
    if (Number(this.data.formData.fkj) < 0) {
      self.setData({
        error: '付款金额不能小于0'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.yfjk)) {
      self.setData({
        error: '请输入预付(借款)金额'
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
    //获取菜单ID
    var menuid = munePage.GetMenuCode("退款申请报账单");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "d4b34d54-fc54-4e4c-9195-398e59d5d2e2",
      "SubTitle": "FB-TKSQBZD-",
      "Division": self.data.formData.szfb, //所在分部
      "DivisionID": self.data.formData.szfbbm, // 所在分部编码
      "FlowLevel1Name": self.data.formData.gzllx, //工作流类型
      "FlowLevel2Name": self.data.formData.gzllx2, //工作流类型2
      "FlowLevel3Name": self.data.formData.gzllx3, //工作流类型3
      "CompanyName": self.data.formData.gszt, //公司主体
      "Payee": self.data.formData.skf, //收款方
      "AccountNature": self.data.formData.zhxz, //账户性质 
      "PayeeAccountNature": self.data.formData.skzhxz, //收款账户性质
      "BankNum": self.data.formData.BankAccount, //银行账号
      "BankName": self.data.formData.KHBank, //开户银行
      "BankBranch": self.data.formData.KHZHBank, //开户支行
      "bxMoney": self.data.formData.bxj, //报销金额 
      "kkMoney": self.data.formData.kkj, //扣款金额
      "fkMoney": self.data.formData.fkj, //付款金额
      "yfMoney": self.data.formData.yfjk, //预付借款金额
      "Currency": "RMB", //币种
      "CapsMoneyCH": self.data.formData.fkjdx, //付款金额大写
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})