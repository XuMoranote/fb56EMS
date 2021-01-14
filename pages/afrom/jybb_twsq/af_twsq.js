// pages/afrom/jybb_twsq/af_twsq.js
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
    //退网原因1
    twyy1_index: 0,
    twyy1_array: ['请选择', '质控类', '运营类', '经营类', '网点类', '其他类'],
    //退网原因2
    twyy2_index: 0,
    twyy2_array: [],
    //退网原因3
    twyy3_index: 0,
    twyy3_array: [],
    //退网原因数据集
    _waydata: [{
      text: '质控类',
      children: [{
        text: '罚款',
        children: [{
          text: '差错罚款高'
        }, {
          text: '投诉罚款高'
        }, {
          text: '理赔罚款高'
        }]
      }, {
        text: '品质',
        children: [{
          text: '支线时效差'
        }, {
          text: '货物破损多'
        }, {
          text: '货物遗失多'
        }, {
          text: '相关人员服务态度差'
        }]
      }]
    }, {
      text: '运营类',
      children: [{
        text: '操作',
        children: [{
          text: '分拨留仓'
        }, {
          text: '分批配载'
        }]
      }, {
        text: '时效',
        children: [{
          text: '干线时效差'
        }]
      }, {
        text: '规划',
        children: [{
          text: '路由不合理'
        }]
      }]
    }, {
      text: '经营类',
      children: [{
        text: '价格',
        children: [{
          text: '中转费高'
        }, {
          text: '增值服务费高'
        }, {
          text: '派费不合理'
        }, {
          text: '乱收费'
        }]
      }, {
        text: '组织',
        children: [{
          text: '网点归属调整'
        }, {
          text: '升降级'
        }]
      }, {
        text: '管理',
        children: [{
          text: '货量指标高'
        }, {
          text: '资质不合理'
        }, {
          text: '强制清理'
        }, {
          text: '网点未培训'
        }]
      }]
    }, {
      text: '网点类',
      children: [{
        text: '网点自身原因',
        children: [{
          text: '资金缺乏'
        }, {
          text: '家庭原因'
        }, {
          text: '合伙纠纷'
        }, {
          text: '转行'
        }, {
          text: '其他'
        }]
      }]
    }, {
      text: '其他类',
      children: [{
        text: '不可抗力',
        children: [{
          text: '自然灾害'
        }, {
          text: '交通事故'
        }, {
          text: '政府要求整顿及责令停业'
        }, ]
      }]
    }],
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
      sqtysj: '', //申请停业时间
      sfyht: '', //是否有合同
      twyy1: '', //退网原因1
      twyy2: '', //退网原因2
      twyy3: '', //退网原因3
      Reason: '', //退网原因描述
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
  /*网点层级选中事件*/
  bindPickerChange_wdcj(e) {
    let wdcj = this.data.wdcj_array[e.detail.value];
    this.setData({
      'wdcj_index': e.detail.value,
      'formData.wdcj': wdcj,
    });
  },
  /*退网原因1选中事件*/
  bindPickerChange_twyy1(e) {
    let twyy1 = this.data.twyy1_array[e.detail.value];
    let twyy2 = [];
    this.data._waydata.forEach(element => {
      if (element.text == twyy1) {
        twyy2.push('请选择');
        element.children.forEach(item => {
          twyy2.push(item.text);
        });
      }
    });
    this.setData({
      'twyy1_index': e.detail.value,
      'formData.twyy1': twyy1,
      'twyy2_index': 0,
      'twyy2_array': twyy2,
      'twyy3_index': 0,
      'twyy3_array': [],
    });
  },
  /*退网原因2选中事件*/
  bindPickerChange_twyy2(e) {
    let twyy2 = this.data.twyy2_array[e.detail.value];
    let twyy3 = [];
    this.data._waydata.forEach(element => {
      element.children.forEach(item => {
        if (item.text == twyy2) {
          twyy3.push('请选择');
          item.children.forEach(ite => {
            twyy3.push(ite.text);
          });
        }
      });
    });
    this.setData({
      'twyy2_index': e.detail.value,
      'formData.twyy2': twyy2,
      'twyy3_index': 0,
      'twyy3_array': twyy3,
    });
  },
  /*退网原因3选中事件*/
  bindPickerChange_twyy3(e) {
    let twyy3 = this.data.twyy3_array[e.detail.value];
    this.setData({
      'twyy3_index': e.detail.value,
      'formData.twyy3': twyy3,
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
  /*选择申请停业 时间 */
  DatePicker_sqtysj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " +
      util.padLeft(date[3], 2) + ":" +
      util.padLeft(date[4], 2);
    self.setData({
      'formData.sqtysj': selectDate
    });
  },
  /*获取页面 用户是否有合同*/
  radio_sfyht(e) {
    this.setData({
      'formData.sfyht': e.detail.value
    });
  },
  /*获取页面 退网原因描述文本框的值*/
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
  /*提交退网原因申请*/
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
    if (util.strIsEmpty(self.data.formData.wdcj)) {
      self.setData({
        error: '请输入网点层级！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sqtysj)) {
      self.setData({
        error: '请输入申请停业时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfyht)) {
      self.setData({
        error: '请选择是否有合同！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.twyy1) ||
      util.strIsEmpty(self.data.formData.twyy2) ||
      util.strIsEmpty(self.data.formData.twyy3)) {
      self.setData({
        error: '请选择所有退网原因！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入退网原因描述'
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
    var menuid = munePage.GetMenuCode("退网申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_fb_applystop",
      // "_flowid": "e98fb1f9-830f-4dee-85f9-c9229c401f5e",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      'ProvinceText': self.data.formData.sheng, //省
      'ProvinceCode': self.data.formData.shengCode, //省编码
      'ProvinceType': self.data.formData.szsqxz, //所在省区性质
      'StationCode': self.data.formData.wddm, //网点代码  
      'StationText': self.data.formData.wdmc, //网点名称
      'StationContacts': self.data.formData.wdfzr, //网点负责人
      'StationContactsTel': self.data.formData.wdfzrdh, //网点负责人电话
      'StationAddress': self.data.formData.wddz, //网点地址  
      'StationLevel': self.data.formData.wdcj, //网点层级  
      'UpStationStopTime': self.data.formData.sqtysj, //申请停业时间
      'IfContract': self.data.formData.sfyht, //是否有合同
      'UpStationStopWay1': self.data.formData.twyy1, //退网原因1
      'UpStationStopWay2': self.data.formData.twyy2, //退网原因2
      'UpStationStopWay3': self.data.formData.twyy3, //退网原因3
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})