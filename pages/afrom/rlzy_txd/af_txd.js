// pages/afrom/rlzy_dxd/af_dexd.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      startDate: '', //开始时间
      endDate: '', //结束时间
      DutyAgentName: '', //职务代理
      Tel: '', //代理电话
      totalHour: null, //合计天数
      fileAttach: [], //附件集合
      RoadFlowUserID: '', //职务代理的ID
      Reason: '', //调休事由  
    },
    //下拉选择职务代理人控件
    inputVal: [],
    userArraylist: [], //职务代理人 选择集合列表
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
      // 'formData.szfb': app.globalData.userInfo.PdepartmentName,
      // 'formData.szfbbm': app.globalData.userInfo.PdepartmentCode,
    });
  },
  /*选择 开始时间 */
  startDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" + //年
      util.padLeft(date[1], 2) + "-" + //月
      util.padLeft(date[2], 2) + " "  //日
      +util.padLeft(date[3], 2) + ":" +
      util.padLeft(date[4], 2);

    if (!util.strIsEmpty(self.data.formData.endDate) && util.atimeDbtime(selectDate, self.data.formData.endDate)) {
      self.setData({
        error: '开始时间不能大于结束时间！'
      });
      return;
    }
    self.setData({
      'formData.startDate': selectDate
    });
    // 暂时不算时间
    // if (this.data.formData.startDate !== '' && this.data.formData.endDate !== '') {
    //   this.computeTotalHour();
    // }
  },
  /*选择 结束时间 */
  endDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +  //年
      util.padLeft(date[1], 2) + "-" + //月
      util.padLeft(date[2], 2) + " " //日
       +util.padLeft(date[3], 2) + ":" +
      util.padLeft(date[4], 2);
    if (!util.strIsEmpty(self.data.formData.startDate) && util.atimeDbtime(self.data.formData.startDate, selectDate)) {
      self.setData({
        error: '开始时间不能大于结束时间！'
      });
      return;
    }
    self.setData({
      'formData.endDate': selectDate
    });
    // 暂时不算时间
    // if (this.data.formData.startDate !== '' && this.data.formData.endDate !== '') {
    //   this.computeTotalHour();
    // }
  },
  /*获取合计天数输入的值 */
  getsumDay: function (e) {
    this.setData({
      "formData.totalHour": e.detail.value
    });
  },
  /*获取职务代理人输入的值*/
  getSpUserValue: function (e) {
    this.setData({
      "formData.DutyAgentName": e.detail.value
    });
  },
  /*获取备注输入代理人电话的值*/
  getTel: function (e) {
    this.setData({
      "formData.Tel": e.detail.value
    });
  },
  /*选择职务代理人事件*/
  scanSpUser: function (e) {
    var that = this;
    if (that.data.formData.DutyAgentName == '') {
      this.setData({
        error: '职务代理人输入不能为空'
      });
      return
    }
    basicCommon.GetUserItem(that, JSON.stringify({
      q: that.data.formData.DutyAgentName,
    }));
  },
  /*选中后重新赋值给代理人*/
  delSPUser: function (e) {
    let that = this;
    var rdata = e.currentTarget.dataset.set; //当前索引
    that.setData({
      'formData.RoadFlowUserID': rdata.RoadFlowUserID,
      "formData.DutyAgentName": rdata.UserCode + '-' + rdata.UserName,
      "formData.Tel": rdata.Phone,
      inputVal: [], //组件Value
      userArraylist: [], //组件数组
    });
  },
  /*获取事由输入的值*/
  getReason: function (e) {
    this.setData({
      "formData.Reason": e.detail.value
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
  /*提交申请的方法*/
  onSubmit() {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.startDate)) {
      self.setData({
        error: '请输入调休开始时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.endDate)) {
      self.setData({
        error: '请输入调休结束时间！'
      });
      return;
    }
    if (util.atimeDbtime(self.data.formData.startDate, self.data.formData.endDate)) {
      self.setData({
        error: '开始时间不能大于结束时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.totalHour)) {
      self.setData({
        error: '请输入合计天数！'
      });
      return;
    }
    if (parseFloat(self.data.formData.totalHour) % 0.5 != 0) {
      self.setData({
        error: '合计天数必须是0.5的倍数'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.RoadFlowUserID)) {
      self.setData({
        error: '请输入职务代理！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Tel)) {
      self.setData({
        error: '请输入代理电话！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入调休事由！'
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    //获取菜单ID
    var menuid = munePage.GetMenuCode("调休单");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "ad1bcdda-85a2-4d69-9ca1-0b63f7506e5f",
      "SubTitle": "FB-RLZY-", //副标题 固定值
      "StartTime": self.data.formData.startDate, //开始时间
      "EndTime": self.data.formData.endDate, //结束时间     
      "SumDays": self.data.formData.totalHour, //总天数   
      "DutyAgent": self.data.formData.RoadFlowUserID,
      "Tel": self.data.formData.Tel,
      "Reason": self.data.formData.Reason,
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  },
})