var call = require("../../../../utils/request.js");
var basicCommon = require("../../../../utils/basicCommon");
Page({
  data: {
    docID: '', //公文ID
    transferID: '', //流转的最后一条ID
    // 上传图片的方法
    tempFilePaths: [],
    fileAttach: [],
    downloadPicturePath: '',
    //文本编辑器
    title: '',
    content: '',
    spUser: '',
    //审批人数组
    userArraylist: [], //审批人列表条目数量,
    inputVal: [],
    tranferPersons: '', //记录传递参数的审批人
  },
  onLoad(query) {
    // 页面加载
    if (query.docid != '') {
      this.setData({
        'docID': query.docid,
        'transferID': query.transferID
      });
      // 页面加载 变量初始化
      this.setData({
        tempFilePaths: [],
        fileAttach: [],
        downloadPicturePath: '',
        //文本编辑器
        title: '',
        content: '',
        spUser: '',
        //审批人数组
        inputVal: [], //组件Value
        userArraylist: [], //组件数组
        tranferPersons: '', //记录传递参数的审批人
      });
    }
  },
  SetContentValue: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  /**
   * 上传图片方法
   */
  upload: function () {
    basicCommon.docUploadFile(this);
  },
  /**
   * 清除附件
   */
  Remove: function () {
    basicCommon.docClearfileAttach(this)
  },
  onClearPersonTap() {
    //清除审批人
    this.setData({
      tranferPersons: '',
    });
  },
  SaveThis: function () {
    let that = this; 
    wx.showLoading({ content: '加载中...',});
    //验证表单数据
    if (that.data.content === '') {
      that.setData({
        error: "请输入详细正文！"
      });
      wx.hideLoading({
        success: (res) => {},
      }); //隐藏 弹出显示
      return;
    }
    //组装传递参数
    let paramData = JSON.stringify({
      docID: this.data.docID,
      transferID: this.data.transferID,
      content:that.data.content,      
      tranferPersons:that.data.tranferPersons,
      fileAttach: this.data.fileAttach
    });      
    call.request('/SaveCheckerContent', paramData, function (res) {
      if (res.Code === 1) {
        wx.navigateBack({ delta: 2 }) ;//返回上页    
      } else {
        that.setData({
          error: res.Message
        });
      }
    }, function (res) {
      wx.hideToast();
      that.setData({
        error: res.Message
      });
    });
  },

  getSpUserValue: function (e) {
    this.setData({
      spUser: e.detail.value
    });
  },
  scanSpUser: function (e) {
    var that = this;
    if (that.data.spUser == '') {
      this.setData({
        error: '审批人不能为空'
      });
      return
    }
    basicCommon.GetUserItem(that,JSON.stringify({q: that.data.spUser, }));
    this.setData({spUser: '',}); //清空审批人    
  },

  //清空审批人列表
  CleaerScanSpUser: function (e) {
    this.setData({
      inputVal: [], //组件Value 
      userArraylist: [], //组件数组
      tranferPersons: '', //记录传递参数的审批人
    });
  },
  //删除审批人  ---修改为选中 选中后清空
  delSPUser: function (e) {
    let that = this;
    var rdata = e.currentTarget.dataset.set; //当前索引
    if (that.data.tranferPersons.length > 0) {
      var sarr = that.data.tranferPersons.split(',');
      for (var i = 0; i < sarr.length; i++) {
        if (sarr[i] == (rdata.UserCode + '-' + rdata.UserName)) {
          that.setData({
            spUser: '',
            success: '审批人' + rdata.UserName + '重复,已为您自动跳过添加！',
            inputVal: [], //组件Value
            userArraylist: [], //组件数组
          });
          return;
        }
      }
      that.setData({
        tranferPersons: that.data.tranferPersons + ',' + rdata.UserCode + '-' + rdata.UserName,
        spUser: '',
        inputVal: [], //组件Value
        userArraylist: [], //组件数组
      });
    } else {
      that.setData({
        tranferPersons: rdata.UserCode + '-' + rdata.UserName,
        spUser: '',
        inputVal: [], //组件Value
        userArraylist: [], //组件数组
      });
    }
  },
});