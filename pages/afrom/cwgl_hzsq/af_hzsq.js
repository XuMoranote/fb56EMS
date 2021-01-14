// pages/afrom/cwgl_hzsq/af_hzsq.js
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
    gzllx_array: ['请选择', '调账申请工作流'],
    gzllx2_index: 0,
    gzllx2_array: [],
    gzllx3_index: 0,
    gzllx3_array: [],
    //退网原因数据集
    _waydata: [{
      text: '调账申请工作流',
      children: [{
        text: '营业外支出',
        children: [{
          text: '加盟网点'
        }, {
          text: '总部项目客户'
        }]
      }]
    }],
    //公司主体
    gszt_index: 0,
    gszt_array: ['请选择', '飞豹物流集团有限公司', '上海中铁迅驰货物运输有限公司', '中铁物流江苏有限公司', '中铁物流集团湖北有限公司', '中铁物流集团浙江物流有限公司', '飞豹智行供应链有限公司', '中铁物流集团飞豹物流有限公司上海分公司'],
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
      khgsmc: '', //客户公司名称
      djr: '', //对接人
      lxdh: '', //联系电话
      khdz: '', //客户地址 
      hzje: '', //坏账金额
      hzjedx: '', //坏账金额 
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
  /*公司主体*/
  bindPickerChange_gszt(e) {
    let gszt = this.data.gszt_array[e.detail.value];
    this.setData({
      'gszt_index': e.detail.value,
      'formData.gszt': gszt,
    })
  },
  /*获取页面 客户公司名称文本框的值*/
  input_khgsmc(e) {
    this.setData({
      'formData.khgsmc': e.detail.value
    });
  },

  /*获取页面 对接人文本框的值*/
  input_djr(e) {
    this.setData({
      'formData.djr': e.detail.value
    });
  },

  /*获取页面 联系电话文本框的值*/
  input_lxdh(e) {
    this.setData({
      'formData.lxdh': e.detail.value
    });
  },

  /*获取页面 客户地址文本框的值*/
  input_khdz(e) {
    this.setData({
      'formData.khdz': e.detail.value
    });
  },

  /*获取页面 坏账金额 文本框的值*/
  input_hzje: function (event) {
    this.setData({
      'formData.hzje': this.money(event.detail.value),
      'formData.hzjedx': util.ZHMoney(this.money(event.detail.value))
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
    num = num.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
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
    if (util.strIsEmpty(self.data.formData.khgsmc)) {
      self.setData({
        error: '请输入客户公司名称！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.djr)) {
      self.setData({
        error: '请输入对接人！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.lxdh)) {
      self.setData({
        error: '请输入联系电话！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.khdz)) {
      self.setData({
        error: '请输入客户地址！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.hzje)) {
      self.setData({
        error: '请输入坏账金额！'
      });
      return;
    }
    if (Number(this.data.formData.hzje) < 0) {
      self.setData({
        error: '坏账金额不能小于0'
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
    var menuid = munePage.GetMenuCode("坏账申请报账单");
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
      // "_flowid": "f63db906-63bf-4ff5-b726-9d167bb80bc3",
      "SubTitle": "FB-HZSQBZD-",
      "Division": self.data.formData.szfb, //所在分部
      "DivisionID": self.data.formData.szfbbm, // 所在分部编码
      "FlowLevel1Name": self.data.formData.gzllx, //工作流类型
      "FlowLevel2Name": self.data.formData.gzllx2, //工作流类型2
      "FlowLevel3Name": self.data.formData.gzllx3, //工作流类型3
      "CompanyName": self.data.formData.gszt, //公司主体
      "ClientCompanyName": self.data.formData.khgsmc, //客户公司名称
      "MeetPeople": self.data.formData.djr, //对接人 
      "ContactNumber": self.data.formData.lxdh, //联系电话
      "CustomerAddress": self.data.formData.khdz, //客户地址
      "BadDebtAmount": self.data.formData.hzje, //坏账金额
      "Currency": "RMB", //币种
      "BadDebtAmountCH": self.data.formData.hzjedx, //付款金额大写
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})