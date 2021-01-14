// pages/afrom/rlzy_jbd/af_jbd.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //加班类型选择事件
    jblx_index: 0,
    jblx_array: ['请选择', '休息日', '节假日'],
    //加班人员列表
    jbrTabel: {
      content: [],
      titles: ['操作', '工号', '姓名', '单位', '部门', '职位', '职级', ],
      props: ['Option', 'UserCode', 'UserName', 'UnitName', 'DepartmentName', 'JobName', 'JobLevelCH'],
      columnWidths: ['68rpx', '165rpx', '165rpx', '255rpx', '255rpx', '275rpx', '165rpx'],
      border: true,
      stripe: true,
      headbgcolor: '#2F7DCD'
    },
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      startDate: '', //开始时间
      endDate: '', //结束时间
      jbts: '', //加班天数
      jblx: '', //加班类型
      fileAttach: [], //附件集合
      Reason: '', //加班原因
      jbry: '',
    },
    inputVal: [],
    input_user: '', //用户输入查询检索的用户
    userArraylist: [], //选择用户集合代理控件
    isManySubmit: true, //提交时，不允许多次提交 变量设置。   
    input_overTimeDay: '', //用户输入的加班天数
    operation_jbrItem: {}, //运算变量,临时存放加班人item集合
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
  /*选择 开始时间 */
  startDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " +
      util.padLeft(date[3], 2) + ":" +
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
  },
  /*选择 结束时间 */
  endDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " +
      util.padLeft(date[3], 2) + ":" +
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
  },
  /*获取加班天数输入的值*/
  input_overTimeDay: function (e) {
    this.setData({
      "input_overTimeDay": e.detail.value,
      'formData.jbts': e.detail.value,
    });
  },
  /*加班类型选中事件*/
  bindPickerChange_jblx(e) {
    let jblx = this.data.jblx_array[e.detail.value];
    this.setData({
      'jblx_index': e.detail.value,
      'formData.jblx': jblx,
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
  /*获取加班人输入的值*/
  input_user: function (e) {
    this.setData({
      "input_user": e.detail.value
    });
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
    that.data.operation_jbrItem = {
      'UserCode': rdata.UserCode,
      "UserName": rdata.UserName,
      "UnitName": rdata.UnitName,
      "DepartmentName": rdata.DepartmentName,
      "JobName": rdata.JobName,
      "JobLevelCH": rdata.JobLevelCH,
      "Option": '删除',
    }
    let jbrItem = that.data.operation_jbrItem;
    //添加重复人员校验
    let isCF = false;
    that.data.jbrTabel.content.find(item => {
      if (item.UserCode == jbrItem.UserCode) {
        isCF = true;
      }
    })
    if (isCF) {
      this.setData({
        error: '添加人员[' + jbrItem.UserName + ']重复！',
        'input_user': '', // 清空加班人选项
      });
      return;
    }
    //给数组添加
    that.data.jbrTabel.content.push(jbrItem);
    //添加数组
    that.setData({
      'jbrTabel.content': that.data.jbrTabel.content,
      'input_user': '', // 清空加班人选项
    });
  },
  /*点击删除加班人操作*/
  deleteRowjbr(e) {
    let that = this;
    let jbrItem = e.detail.currentTarget.dataset.item;
    // console.info(jbrItem)
    let jbrlist = that.data.jbrTabel.content;
    //获取数组下标
    for (var i = 0; i < jbrlist.length; i++) {
      if (jbrlist[i].UserCode == jbrItem.UserCode) {
        jbrlist.splice(i, 1);
        break;
      }
    }
    that.setData({
      'jbrTabel.content': jbrlist,
      'input_user': '', // 清空加班人选项
    });
  },
  /*提交加班申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.startDate)) {
      self.setData({
        error: '请选择开始时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.endDate)) {
      self.setData({
        error: '请选择结束时间！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jbts)) {
      self.setData({
        error: '请输入加班天数！'
      });
      return;
    }
    if (parseFloat(self.data.formData.jbts) % 0.5 != 0) {
      self.setData({
        error: '加班天数必须是0.5的倍数'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jblx) || self.data.formData.jblx == '请选择') {
      self.setData({
        error: '请选择加班类型'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入加班原因'
      });
      return;
    }
    if (self.data.jbrTabel.content == null ||
      self.data.jbrTabel.content == undefined ||
      self.data.jbrTabel.content.length <= 0) {
      self.setData({
        error: '请至少选择至少一个加班人'
      });
      return;
    }
    // if (this.data.formData.fileAttach.length < 1) {
    //   self.setData({
    //     error: '请上传附件信息'
    //   });
    //   return;
    // }   
    //处理加班人明细
    let jbrDetails = self.data.jbrTabel.content;
    for (let i in jbrDetails) {     
        delete jbrDetails[i].Option;
      }
    let jbrJosnStr = JSON.stringify(jbrDetails);    
    wx.showLoading({
      title: '加载中...',
    });
    //获取菜单ID
    var menuid = munePage.GetMenuCode("加班申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "8d637bb5-8140-4ed6-bd4c-14098ed13e56",
      "SubTitle": "FB-RLZY-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "HappenDateS": self.data.formData.startDate, //开始时间
      "HappenDateE": self.data.formData.endDate, //结束时间      
      "WorkOverDays": self.data.formData.jbts, //加班天数 
      "overtimeType": self.data.formData.jblx, //加班类型 
      'Details': jbrJosnStr, //加班人明细
      "Reason": self.data.formData.Reason, //加班原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})