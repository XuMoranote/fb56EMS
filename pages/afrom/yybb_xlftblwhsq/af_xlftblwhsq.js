// pages/afrom/yybb_xlftblwhsq/af_xlftblwhsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //目的组织机构省区
    sheng_index: 0,
    sheng_array: [],
    sheng_array_select: [],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      xlmc: '',//线路名称
      sqlx: '',//申请类型
      ejsqlx: '',//二级申请类型
      mdsqmc: '',//目的省区名称
      mdsqdm: '',//目的省区代码
      Reason: '', //需求分析
      fileAttach: [], //附件   
      fjsm: '',//附件说明
    },
    isManySubmit: false, //提交时，不允许多次提交 变量设置。
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

    //初始化 加载 组织机构省区 选择数据源
    var page = this;
    basicCommon.GetHRZZJGSheng(this, function (res) {
      if (res.Code == "1") {
        var shengSelect = [],
          sheng = [];
        shengSelect.push('请选择');
        sheng.push({
          name: '请选择',
          value: '0'
        });
        res.Data.forEach(element => {
          shengSelect.push(element.StationName);
          sheng.push({
            name: element.StationName,
            value: element.StationCode
          });
        });
        page.setData({
          sheng_array_select: shengSelect,
          sheng_array: sheng
        });
      }
    }); //获取组织机构省区信息 
  },
  /*组织机构省区信息 选中事件*/
  bindPickerChange_sheng(e) {
    let sheng = this.data.sheng_array[e.detail.value];
    var mdsqmc = sheng.name;
    var mdsqdm = sheng.value;
    this.setData({
      'sheng_index': e.detail.value,
      'formData.mdsqmc': mdsqmc,
      'formData.mdsqdm': mdsqdm
    });
    if (sheng.value == "0") {
      return; //未选择
    }
  },
  /*获取页面 需求分析 文本框的值*/
  input_Reason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },
  /*选择附件上传的方法*/
  chooseImage() {  basicCommon.afromUploadFile(this); },
  /*清除附件*/
  onClearAttachTap() { basicCommon.afromClearfileAttach(this); },
  /*获取页面 附件说明 文本框的值*/
  input_fjsm(e) {
    this.setData({
      'formData.fjsm': e.detail.value
    });
  },
  /*提交线路需求申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.mdsqmc) || self.data.formData.mdsqdm == '0') {
      self.setData({
        error: '请选择目的省区'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入需求分析!'
      });
      return;
    }
    
    if (util.strIsEmpty(self.data.formData.fjsm)) {
      self.setData({
        error: '请输入附件说明!'
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
    var menuid = munePage.GetMenuCode("线路分摊比例维护申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "4e29f6bd-d154-4b37-a33f-fec494627490",
      "SubTitle": "FB-YYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      'HappenStationCode_B_Txt': self.data.formData.mdsqmc,//目的省区名称
      'HappenStationCode_B': self.data.formData.mdsqdm,//目的省区代码
      'SQLX': '调整',//申请类型
      "XQFC": self.data.formData.Reason, //需求分析
      "fileAttach": self.data.formData.fileAttach,//附件
      "FJSM": self.data.formData.fjsm,//附件说明
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})