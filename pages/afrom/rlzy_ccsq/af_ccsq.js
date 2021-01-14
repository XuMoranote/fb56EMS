// pages/afrom/rlzy_ccsq/af_ccsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //搜索同行人员
    inputVal: [],
    input_user: '', //用户输入查询检索的用户
    userArraylist: [], //选择用户集合代理控件
    //同行人员列表
    txrTabel: {
      content: [],
      titles: ['操作', '工号', '姓名', '单位', '部门', '职位', '职级', ],
      props: ['Option', 'UserCode', 'UserName', 'UnitName', 'DepartmentName', 'JobName', 'JobLevelCH'],
      columnWidths: ['68rpx', '165rpx', '165rpx', '255rpx', '255rpx', '275rpx', '165rpx'],
      border: true,
      stripe: true,
      headbgcolor: '#2F7DCD'
    },
    //出差行程列表
    ccxcTabel: {
      content: [],
      titles: ['操作', '出发日期', '结束日期', '出发城市', '目的城市','是否返程'],
      props: ['Option', 'BeginDate', 'EndDate', 'DepartureCity', 'ArrivalCity','IsSupportBack'],
      columnWidths: ['68rpx', '255rpx', '255rpx', '255rpx', '255rpx', '255rpx'],
      border: true,
      stripe: true,
      headbgcolor: '#2F7DCD'
    },
    startDate: '', //开始时间
    endDate: '', //结束时间
    cfcs: '', //出发城市
    mdcs: '', //目的城市
    sffc:'',// 是否返程
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', //所在分部编码
      fileAttach: [], //附件集合
      Reason: '', //出差事由 
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
  /*获取同行人输入的值*/
  input_user: function (e) {
    this.setData({
      "input_user": e.detail.value
    });
  },
  /*查询添加选择人员*/
  searchUser: function (e) {
    var that = this;
    if (that.data.input_user == '') {
      this.setData({
        error: '请选择输入您要查询的人员。'
      });
      return
    }
    basicCommon.GetUserItem(that, JSON.stringify({
      q: that.data.input_user,
    }));
  },
  /*选中后重新赋值给所选用户*/
  delSPUser: function (e) {
    let that = this;
    var rdata = e.currentTarget.dataset.set; //当前索引 
    that.setData({
      'input_user': rdata.UserCode + '-' + rdata.UserName,
      inputVal: [], //组件Value
      userArraylist: [], //组件数组
    });
    //给数组赋值
    let userItem = {
      'UserCode': rdata.UserCode,
      "UserName": rdata.UserName,
      "UnitName": rdata.UnitName,
      "DepartmentName": rdata.DepartmentName,
      "JobName": rdata.JobName,
      "JobLevelCH": rdata.JobLevelCH,
      "Option": '删除',
    }
    //添加重复人员校验
    let isCF = false;
    that.data.txrTabel.content.find(item => {
      if (item.UserCode == userItem.UserCode) {
        isCF = true;
      }
    })
    if (userItem.UserCode == this.data.formData.UserCode) {
      this.setData({
        error: '添加同行人员不能是自己！',
        'input_user': '', // 清空加班人选项
      });
      return;
    }
    if (isCF) {
      this.setData({
        error: '添加同行人员[' + userItem.UserName + ']重复！',
        'input_user': '', // 清空加班人选项
      });
      return;
    }
    //给数组添加
    that.data.txrTabel.content.push(userItem);
    //添加数组
    that.setData({
      'txrTabel.content': that.data.txrTabel.content,
      'input_user': '', // 清空加班人选项
    });
  },
  /*点击删除加班人操作*/
  deleteRowtxr(e) {
    let that = this;
    let userItem = e.detail.currentTarget.dataset.item;
    // console.info(userItem)
    let userlist = that.data.txrTabel.content;
    //获取数组下标
    for (var i = 0; i < userlist.length; i++) {
      if (userlist[i].UserCode == userItem.UserCode) {
        userlist.splice(i, 1);
        break;
      }
    }
    that.setData({
      'txrTabel.content': userlist,
      'input_user': '', // 清空加班人选项
    });
  },
  /*选择 开始日期 */
  startDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" + //年
      util.padLeft(date[1], 2) + "-" + //月
      util.padLeft(date[2], 2) + " " //日
    if (!util.strIsEmpty(self.data.endDate) && util.atimeDbtime(selectDate, self.data.endDate)) {
      self.setData({
        error: '开始时间不能大于结束时间！'
      });
      return;
    }
    self.setData({
      'startDate': selectDate
    });
  },
  /*选择 结束时间 */
  endDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " "
    if (!util.strIsEmpty(self.data.startDate) && util.atimeDbtime(self.data.startDate, selectDate)) {
      self.setData({
        error: '开始时间不能大于结束时间！'
      });
      return;
    }
    self.setData({
      'endDate': selectDate
    });
  },
  /*获取出发城市输入的值*/
  input_cfcs: function (e) {
    this.setData({
      "cfcs": e.detail.value
    });
  },
  /*获取目的城市输入的值*/
  input_mdcs: function (e) {
    this.setData({
      "mdcs": e.detail.value
    });
  },
    /*是否返程 输入选择*/
    radiochange: function (e) {
      this.setData({
        'sffc': e.detail.value
      });
    },
  /*添加出差行程的方法*/
  addCCXC(e) {
    if (util.strIsEmpty(this.data.startDate)) {
      this.setData({
        error: '请选择出发日期！'
      });
      return;
    }
    if (util.strIsEmpty(this.data.endDate)) {
      this.setData({
        error: '请选择结束日期！'
      });
      return;
    }
    if (util.strIsEmpty(this.data.cfcs)) {
      this.setData({
        error: '请输入出发城市！'
      });
      return;
    }
    if (util.strIsEmpty(this.data.mdcs)) {
      this.setData({
        error: '请输入目的城市！'
      });
      return;
    } 
    if (util.strIsEmpty(this.data.sffc)) {
      this.setData({
        error: '请输入是否返程！'
      });
      return;
    }
    //给数组添加
    this.data.ccxcTabel.content.push({
      'BeginDate': this.data.startDate,
      "EndDate": this.data.endDate,
      "DepartureCity": this.data.cfcs,
      "ArrivalCity": this.data.mdcs,
      "LimitTravelTool": '',
      "IsSupportBack": this.data.sffc == 'true'?'是':'否',
      "Option": '删除',
    });
    //添加数组
    this.setData({
      'ccxcTabel.content': this.data.ccxcTabel.content,
      'startDate': '', // 清空
      'endDate': '', // 清空
      'cfcs': '', // 清空
      'mdcs': '', // 清空
      //'sffc':false,
    });
  },
  /*点击删除同行人操作*/
  deleteRowccxc(e) {
    let that = this;
    let item = e.detail.currentTarget.dataset.item;
    // console.info(item)
    let list = that.data.ccxcTabel.content;
    //获取数组下标
    for (var i = 0; i < list.length; i++) {
      if (list[i].BeginDate == item.BeginDate &&
        list[i].EndDate == item.EndDate &&
        list[i].DepartureCity == item.DepartureCity &&
        list[i].ArrivalCity == item.ArrivalCity) {
        list.splice(i, 1);
        break;
      }
    }
    that.setData({
      'ccxcTabel.content': list,
    });
  },
  /*提交出差申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交 
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入出差事由'
      });
      return;
    }
    // if (self.data.txrTabel.content == null ||
    //   self.data.txrTabel.content == undefined ||
    //   self.data.txrTabel.content.length <= 0) {
    //   self.setData({
    //     error: '请至少选择添加至少一个同行人'
    //   });
    //   return;
    // }
    if (self.data.ccxcTabel.content == null ||
      self.data.ccxcTabel.content == undefined ||
      self.data.ccxcTabel.content.length <= 0) {
      self.setData({
        error: '请至少至少添加一个出差行程'
      });
      return;
    }
    // if (this.data.formData.fileAttach.length < 1) {
    //   self.setData({
    //     error: '请上传附件信息'
    //   });
    //   return;
    // }   
    //处理同行人人明细
    let txrDetails = self.data.txrTabel.content;
    for (let i in txrDetails) {
      delete txrDetails[i].Option;
    }
    let txrJosnStr = JSON.stringify(txrDetails);
    //处理出差行程明细
    let ccxcDetails = self.data.ccxcTabel.content;
    for (let i in ccxcDetails) {
      delete ccxcDetails[i].Option;
      ccxcDetails[i].IsSupportBack = ccxcDetails[i].IsSupportBack =='是'?true:false;
    }
    let ccxcJosnStr = JSON.stringify(ccxcDetails);
    wx.showLoading({
      title: '加载中...',
    });
    //获取菜单ID
    var menuid = munePage.GetMenuCode("出差申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "38bb1057-e8a3-4cdd-9d18-c3b59a7fb308",
      "SubTitle": "FB-RLZY-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      // "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, //所在分部编码
      'togetherPassengerDetails': txrJosnStr, //同行人明细
      "travelDetails":ccxcJosnStr, //出差行程明细
      "TravelReason": self.data.formData.Reason, //出差事由
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})