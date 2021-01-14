// pages/gw_edit/gw_save.js
var call = require("../../../utils/request.js");
var basicCommon = require("../../../utils/basicCommon");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 上传图片的方法
    fileAttach: [],
    //文本编辑器
    title: '',
    content: '',
    spUser: '',
    //审批人数组
    userArraylist: [], //审批人列表条目数量,
    inputVal: [], 
    tranferPersons: '', //记录传递参数的审批人
    //提交时，不允许多次提交 变量设置。
    isManySubmit:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面加载 变量初始化
    this.setData({
      fileAttach: [], 
      //文本编辑器
      title: '',
      content: '',
      spUser: '',
      //审批人数组
      inputVal: [], //组件Value
      userArraylist: [], //组件数组
      tranferPersons: '', //记录传递参数的审批人      
      isManySubmit:true, //初始化允许提交
    });
  },
  SetTitleValue: function (e) {
    this.setData({
      title: e.detail.value
    });
  },
  SetContentValue: function (e) {
    this.setData({
      content: e.detail.value
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
  /* 选择附件上传 */
  upload: function () { basicCommon.docUploadFile(this);},
  /* 清除选择附件 */
  Remove: function () { basicCommon.docClearfileAttach(this);},
  SaveThis: function () {
    let that = this;     
     if(!that.data.isManySubmit){ return ;}      
    //验证表单数据
    if (that.data.title === '') {
      that.setData({
        error: "请输入标题！"
      })
      return;
    }
    if (that.data.content === '') {
      that.setData({
        error: "请输入详细正文！"
      })
      return;
    }
    if (that.data.tranferPersons === '') {
      that.setData({
        error: "请选择审批人！"
      })
      return;
    }
    //公文编辑附件是必填选项
    if(this.data.fileAttach.length <=0)
    {
      that.setData({
        error: "附件是必填选项！"
      })
      return;
    }
    //组装传递参数
    let paramData = JSON.stringify({
      title: that.data.title,
      content: that.data.content,
      tranferPersons: that.data.tranferPersons,
      fileAttach: this.data.fileAttach
    });
    wx.showNavigationBarLoading();
    wx.showLoading({ title: '加载中...',});
    that.setData({ isManySubmit:false});//不允许继续提交
    call.request('/PubDocSave', paramData, function (res) {      
      if (res.Code === 1) {       
        wx.showToast({
          title: '操作成功',
          icon: '',
          mask: true,
          duration: 3500
        });       
        wx.switchTab({url: '/pages/index/gw/index'});
        wx.showToast({
          title: '操作已成功', //提示文字
          duration: 2000, //显示时长
          mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
          icon: 'success', //图标，支持"success"、"loading"  
          success: function () {}, //接口调用成功
          fail: function () {}, //接口调用失败的回调函数  
          complete: function () {} //接口调用结束的回调函数  
        })
      } else {
        that.setData({
          error: res.Message,
          isManySubmit:true //可以继续提交
        });       
      }        
    }, function (res) {
      that.setData({
        error: res.Message
      });
      isManySubmit:true //可以继续提交
    });
  },
  //获取input的值--正文的值
  getInputVal: function (e) {
    var nowIdx = e.currentTarget.dataset.idx; //获取当前索引
    var val = e.detail.value; //获取输入的值
    var oldVal = this.data.inputVal;
    oldVal[nowIdx] = val; //修改对应索引值的内容
    this.setData({
      inputVal: oldVal
    })
  },
})