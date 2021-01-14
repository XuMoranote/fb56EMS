// pages/afrom/jybb_twjmlc/af_twjmlc.js
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
    //所在省区性质选择事件
    szsqxz_index: 0,
    szsqxz_array: ['请选择', '加盟', '直营'],
    //网点层级选择事件
    wdcj_index: 0,
    wdcj_array: ['请选择', '一级', '二级'],
    //申请减免项1
    sqjmx1_index: 0,
    sqjmx1_array: ['请选择', '质控类', '经营类', '财务类'],
    //申请减免项2
    sqjmx2_index: 0,
    sqjmx2_array: [],
    //申请减免项3
    sqjmx3_index: 0,
    sqjmx3_array: [],
    _waydata: [{
      text: '质控类',
      children: [{
        text: '品质管理中心',
        children: [{
          text: '时效类'
        }, {
          text: '差错类'
        }]
      }, {
        text: '仲裁管理中心',
        children: [{
          text: '行为类'
        }, {
          text: '破损类'
        }]
      }]
    }, {
      text: '经营类',
      children: [{
        text: '网络经营中心',
        children: [{
          text: '货量考核类'
        },{
          text: '营销考核类'
        }]
      }]
    }, {
      text: '财务类',
      children: [{
        text: '结算管理中心',
        children: [{
          text: '滞纳金类'
        }]
      }]
    }],
    showViewTable: true, //是否显示表格相关控件
    //费用列表
    fyTabel: {
      content: [],
      titles: ['操作', '一级费用类型', '二级费用类型', '三级费用类型', '费用'],
      props: ['Option', 'FeeType1', 'FeeType2', 'FeeType3', 'FeeValue'],
      columnWidths: ['80rpx', '200rpx', '280rpx', '200rpx', '200rpx'],
      border: true,
      stripe: true,
      headbgcolor: '#2F7DCD'
    },
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      sheng: '', //网点所在省区
      shengCode: '', //所在省区性质
      wddm: '', //网点代码  
      wdmc: '', //网点名称
      wdfzr: '', //网点负责人
      wdfzrdh: '', //网点负责人电话
      wddz: '', //网点地址  
      wdcj: '', //网点层级  
      twlcbh: '', //退网流程编号
      sqjmx1: '', //申请减免1
      sqjmx2: '', //申请减免2
      sqjmx3: '', //申请减免3
      fy: '',//费用
      sqjmhjje: '',//申请减免合计金额
      Reason: '', //减免描述
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
      'formData.szfb': app.globalData.userInfo.PdepartmentName,
      'formData.szfbbm': app.globalData.userInfo.PdepartmentCode,
      'showViewTable': true,
    });
    basicCommon.GetDBData_Sheng(this); //获取省级信息   
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
  /*所在省区性质 选中事件*/
  bindPickerChange_szsqxz(e) {
    let that = this;
    let szsqxz = that.data.szsqxz_array[e.detail.value];
    that.setData({
      'szsqxz_index': e.detail.value,
      'formData.szsqxz': szsqxz,
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
  /*获取页面 网点负责人文本框的值*/
  input_wdfzr(e) {
    this.setData({
      'formData.wdfzr': e.detail.value
    });
  },
  /*获取页面 网点负责人电话文本框的值*/
  input_wdfzrdh(e) {
    this.setData({
      'formData.wdfzrdh': e.detail.value
    });
  },
  /*获取页面 网点地址文本框的值*/
  input_wddz(e) {
    this.setData({
      'formData.wddz': e.detail.value
    });
  },
  /*网点层级选中事件*/
  bindPickerChange_wdcj(e) {
    let wdcj = this.data.wdcj_array[e.detail.value];
    this.setData({
      'wdcj_index': e.detail.value,
      'formData.wdcj': wdcj,
    });
  },
  /* 退网流程编号 */
  input_twlcbh(e) {
    this.setData({
      'formData.twlcbh': e.detail.value
    })
  },
  txfymx(e) {
    this.setData({
      'showViewTable': !this.data.showViewTable,
    })
  },
  bindPickerChange_sqjmx1(e) {
    let sqjmx = this.data.sqjmx1_array[e.detail.value];
    let sqjmx2 = [];
    let sqjmx3 = [];
    this.data._waydata.forEach(element => {
      if (element.text == sqjmx) {
        sqjmx2.push('请选择');
        element.children.forEach(item => {
          sqjmx2.push(item.text);
        });
      }
    });
    this.setData({
      'sqjmx1_index': e.detail.value,
      'formData.sqjmx1': sqjmx,
      'sqjmx2_index': 0,
      'sqjmx2_array': sqjmx2,
      'sqjmx3_index': 0,
      'sqjmx3_array': sqjmx3,
    });
  },
  bindPickerChange_sqjmx2(e) {
    let sqjmx2 = this.data.sqjmx2_array[e.detail.value];
    let sqjmx3 = [];
    this.data._waydata.forEach(element => {
      element.children.forEach(item => {
        if (item.text == sqjmx2) {
          sqjmx3.push('请选择');
          item.children.forEach(ite => {
            sqjmx3.push(ite.text);
          });
        }
      });
    });
    this.setData({
      'sqjmx2_index': e.detail.value,
      'formData.sqjmx2': sqjmx2,
      'sqjmx3_index': 0,
      'sqjmx3_array': sqjmx3,
    });
  },
  bindPickerChange_sqjmx3(e) {
    let sqjmx3 = this.data.sqjmx3_array[e.detail.value];
    this.setData({
      'sqjmx3_index': e.detail.value,
      'formData.sqjmx3': sqjmx3,
    });
  },
  /* 费用 */
  input_fy(e) {
    this.setData({
      'formData.fy': this.money(e.detail.value)
    })
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
  /*添加费用类型*/
  addFeeType (e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } 
    //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.sqjmx1) || self.data.formData.sqjmx1 == '请选择') {
      self.setData({
        error: '请选择申请减免项1! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sqjmx2) || self.data.formData.sqjmx2 == '请选择') {
      self.setData({
        error: '请选择申请减免项2! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sqjmx3) || self.data.formData.sqjmx3 == '请选择') {
      self.setData({
        error: '请选择申请减免项3! '
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.fy)) {
      self.setData({
        error: '请输入费用! '
      });
      return;
    }
    //给费用数组赋值
    self.data.operation_fylxItem = {
      "FeeType1": self.data.formData.sqjmx1,
      "FeeType2": self.data.formData.sqjmx2,
      "FeeType3": self.data.formData.sqjmx3,
      "FeeValue": self.data.formData.fy,
      "Option": '删除',
    }
    let fyItem = self.data.operation_fylxItem;
    //添加重复校验
    let isCF = false;
    self.data.fyTabel.content.find(item => {
      if (item.FeeType1 == fyItem.FeeType1 && item.FeeType2 == fyItem.FeeType2 && item.FeeType3 == fyItem.FeeType3) {
        isCF = true;
      }
    })
    if (isCF) {
      self.setData({
        error: '添加费用类型[' + fyItem.FeeType1 + fyItem.FeeType2 + fyItem.FeeType3 + ']重复！',
        'formData.fy': '', // 清空费用
        'formData.fy': '', // 清空费用
       'formData.sqjmx1': '',
       'sqjmx1_index': 0,
       'formData.sqjmx2': '',
       'sqjmx2_index': 0,
       'formData.sqjmx3': '',
       'sqjmx3_index': 0,
      });
      return;
    }
    //给数组添加
    self.data.fyTabel.content.push(fyItem);
    //费用类型
    let feeDetails = self.data.fyTabel.content;
    // ;
    var feeVlueSum = 0;
    for (let i in feeDetails) {  
      feeVlueSum = feeVlueSum + Number(feeDetails[i].FeeValue); 
    }
    //添加数组
    self.setData({
      'fyTabel.content': self.data.fyTabel.content,
      'formData.fy': '', // 清空费用
      'formData.sqjmx1': '',
      'sqjmx1_index': 0,
      'formData.sqjmx2': '',
      'sqjmx2_index': 0,
      'formData.sqjmx3': '',
      'sqjmx3_index': 0,
      'formData.sqjmhjje': feeVlueSum,
    });
  },
  /*点击删除加班人操作*/
  deleteRowfy(e) {
    let that = this;
    let fyItem = e.detail.currentTarget.dataset.item;
    // console.info(fyItem)
    let fylist = that.data.fyTabel.content;
    //获取数组下标
    for (var i = 0; i < fylist.length; i++) {
      if (fylist[i].FeeType1 == fyItem.FeeType1 && fylist[i].FeeType2 == fyItem.FeeType2 && fylist[i].FeeType3 == fyItem.FeeType3) {
        fylist.splice(i, 1);
        break;
      }
    }
    
    // ;
    var feeVlueSum = 0;
    for (let i in fylist) {  
      feeVlueSum = feeVlueSum + Number(fylist[i].FeeValue); 
    }
    that.setData({
      'fyTabel.content': fylist,
      'formData.fy': '', // 清空费用
      'formData.sqjmx1': '',
      'sqjmx1_index': 0,
      'formData.sqjmx2': '',
      'sqjmx2_index': 0,
      'formData.sqjmx3': '',
      'sqjmx3_index': 0,
      'formData.sqjmhjje': feeVlueSum,
    });
  },
  input_sqjmhjje(e) {
    this.setData({
      'formData.sqjmhjje': e.detail.value
    });
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
    if (util.strIsEmpty(self.data.formData.shengCode) || self.data.formData.shengCode == '0') {
      self.setData({
        error: '请选择 省区'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.szsqxz) || self.data.formData.szsqxz == '请选择') {
      self.setData({
        error: '请选择 所在省区性质'
      });
      return;
    }
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
    if (util.strIsEmpty(self.data.formData.wdfzr)) {
      self.setData({
        error: '请输入网点负责人！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wdfzrdh)) {
      self.setData({
        error: '请输入网点负责人电话！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wddz)) {
      self.setData({
        error: '请输入网点地址！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wdcj) || self.data.formData.wdcj == '请选择') {
      self.setData({
        error: '请选择网点层级！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.twlcbh)) {
      self.setData({
        error: '请输入退网流程编号！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sqjmhjje) || self.data.formData.sqjmhjje <= 0) {
      self.setData({
        error: '请输入申请减免合计金额！'
      });
      return;
    }
    //费用类型
    let feeDetails = self.data.fyTabel.content;
    for (let i in feeDetails) {  
      delete feeDetails[i].Option;
    }
    let feeJosnStr = JSON.stringify(feeDetails);
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入减免描述'
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
    var menuid = munePage.GetMenuCode("退网减免流程");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "cd5af5d5-97e3-4dc1-97c7-778e4383bf46",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      'ProvinceText': self.data.formData.sheng, //省
      'ProvinceCode': self.data.formData.shengCode, //省编码
      'ProvinceType': self.data.formData.szsqxz, //所在省区性质
      'Input_StationCode': self.data.formData.wddm, //网点代码  
      'Input_StationName': self.data.formData.wdmc, //网点名称
      'StationContacts': self.data.formData.wdfzr, //网点负责人
      'StationContactsTel': self.data.formData.wdfzrdh, //网点负责人电话
      'StationAddress': self.data.formData.wddz, //网点地址  
      'StationLevel': self.data.formData.wdcj, //网点层级  
      'TWLCBH': self.data.formData.twlcbh,//退网流程编号
      "FeeTypeDetails": feeJosnStr,
      'yfMoney': self.data.formData.sqjmhjje,//申请减免合计金额
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})