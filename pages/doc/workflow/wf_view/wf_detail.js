var call = require("../../../../utils/request.js");
var file = require("../../../../utils/files");
var basicCommon = require("../../../../utils/basicCommon");
Page({
  data: {
    display: 'block',
    replyDisplay: 'block',//是否显示回复控件
    detailData: {},
    stepInfoData: {},
    userArraylist: [], //审批人列表条目数量,
    inputVal: [], 
    tranferPersons: '', //记录传递参数的转发人
    RDUserCodes:'',//转发人工号字符串
    Note:'',//转发说明
    replycomment:'',//回复内容
    postData: {
      id: '',
      flowID: '',
      instanceID: '',
      stepID: '',
      groupID: '',
      comment: ''
    },
  },
  onLoad(query) {
    // 页面加载
    // console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    // 2020 年09月24 日 此处修改 Id可以为空 ： query.id !== '' &&  
    if ( query.flowID !== '' && query.instanceID !== '' && query.stepID !== '' && query.groupID !== '') {
      this.setData({
        'postData.id': query.id,
        'postData.flowID': query.flowID,
        'postData.instanceID': query.instanceID,
        'postData.stepID': query.stepID,
        'postData.groupID': query.groupID,
      });
      //是否代办事项
      if (query.isEdit !== 'true') {  
        this.setData({
          'display': 'none',    
          'replyDisplay':'none'
        });
      }
      else  if (query.isEdit === 'true'&&query.type==='0')
      { //代办处理流程步骤
        this.setData({
          'display': 'block', 
          'replyDisplay':'none'
        });
      }
      else   if (query.isEdit === 'true'&&query.type==='3')
      {
        //代办处理转发
        this.setData({
          'display': 'none',
          'replayDisplay':'block'
        });
      }
      wx.showLoading({title: '加载中...',});
      let self = this;
      let paramData = JSON.stringify({
        ID: this.data.postData.id,
        FlowID: this.data.postData.flowID,
        InstanceID: this.data.postData.instanceID,
        StepID: this.data.postData.stepID,
        GroupID: this.data.postData.groupID
      });
      call.wfrequest("GetTaskDetail", paramData, function (res) {     
        if (res.Code === 1) {     

          //解析表单数据
          let result = JSON.parse(res.Data);
          result.forEach(function(item, index){
            if (item.Type === "file") {
              if (item.FieldValue != '') {
                item.FieldValue = JSON.parse(item.FieldValue);
              }
            }
          }     
          );
          //解析审批详情数据
          let stepInfoDataArr = JSON.parse(res.StepInfo);         
          stepInfoDataArr.forEach(function(element,idex) {
            if (element.Type === "file" && element.FieldValue != '') {          
                element.FieldValue = JSON.parse(element.FieldValue);              
            }
          });
          stepInfoDataArr.shift(); //移除审批人中的自己 第一个

          //解析转发详情数据
          let  TransmitInfoDataArr= JSON.parse(res.TransmitInfo);

          self.setData({
            'detailData': result,
            'stepInfoData': stepInfoDataArr,
            'TransmitInfoData':TransmitInfoDataArr,   
          });
        } else {       
          self.setData({error:res.Message}); 
        }
      }, function (res) {     
        // wx.navigateTo({ url: '/pages/error/index'})
        self.setData({error:"调用接口出错了！"});   
      })
    }
  },
  previewDetail(e) {
    wx.navigateTo({
      url: '/pages/doc/workflow/wf_view/wf_link?detail=' + encodeURIComponent(e.currentTarget.dataset.detail)
    })
  },
  previewStepDetail(e) {
    wx.navigateTo({
      url: '/pages/doc/workflow/wf_view/wf_file?detail=' + encodeURIComponent(e.currentTarget.dataset.detail)
    })
  },
  previewImage(e) {
    file.previewFileHeard("流程处理-明细",e);
  },
  onCommentBlur(e) {
    this.setData({
      'postData.comment': e.detail.value,
    });
  },
  //绑定转发内容文本
  onNoteBlur(e) {
    this.setData({
      Note: e.detail.value,
    });
  },
 //绑定回复内容文本
  onReplyBlur(e) {
    this.setData({
      replycomment: e.detail.value,
    });
  },
  onRejectTap(e) { //驳回
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定审核',
      success: function (sm) {
        if (sm.confirm) { //确定
          that.checkMethod("FlowBack");
          } else if (sm.cancel) {//取消             
          }
      }});
  },
  onAgreeTap(e) { //同意
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定审核',
      success: function (sm) {
        if (sm.confirm) { //确定
          that.checkMethod("FlowSend");
          } else if (sm.cancel) {//取消             
          }
      }});
  },
  checkMethod(methodName) {
    var that = this;
    let paramData = JSON.stringify({
      FlowID: this.data.postData.flowID,
      InstanceID: this.data.postData.instanceID,
      StepID: this.data.postData.stepID,
      ID: this.data.postData.id,
      GroupID: this.data.postData.groupID,
      Comment: this.data.postData.comment,
    });
    call.wfrequest(methodName,paramData,function (res) {
      if (res.Code === 1) {     
        that.setData({success:'操作成功'});
        wx.navigateBack({delta: 1}) 
      } else {
        that.setData({error:res.Message});
      }
    }, function (res) {
      that.setData({error:"调用接口出错了！"});
    });
  },
  onTransmitTap(e) { //转发
    var that = this;
    if(that.data.RDUserCodes==='')
    {
      that.setData({error:'请选择接收人'});
      return;
    }
    if(that.data.Note==='')
    {
      that.setData({error:'请填写转发说明'});
      return;
    }
    wx.showModal({
      title: '提示',
      content: '是否确定转发',
      success: function (sm) {
        if (sm.confirm) { //确定
          let paramData = JSON.stringify({
            TaskID: that.data.postData.id,
            CopyToIDs: that.data.RDUserCodes,
            Note: that.data.Note,
          });
          call.wfrequest('/FlowSaveRedirect',paramData,function (res) {
          
            if (res.Code === 1) {     
              that.setData({success:res.Message});
              //延时1.5秒跳转，未用户显示提示信息
              setTimeout(function(){
                wx.navigateBack({delta: 1}) 
                },1500)    
            } else {
              that.setData({error:res.Message});
            }
          }, function (res) {
            that.setData({error:"调用接口出错了！"});
          });
          } else if (sm.cancel) {//取消             
          }
      }});
  },
  onReplyTap(e) { //回复
    var that = this;
    if (that.data.replycomment===''){
      that.setData({error:"请输入回复内容"});
      return;
    }
    wx.showModal({
      title: '提示',
      content: '是否回复？',
      success: function (sm) {
        if (sm.confirm) { //确定
          let paramData = JSON.stringify({
            ID: that.data.postData.id,
            Comment: that.data.replycomment,//回复内容
          });
          call.wfrequest('/FlowSaveRedirectIdea',paramData,function (res) {
          
            if (res.Code === 1) {     
              that.setData({success:'保存成功'});
              wx.navigateBack({delta: 1}) 
            } else {
              that.setData({error:res.Message});
            }
          }, function (res) {
            that.setData({error:"调用接口出错了！"});
          });
          } else if (sm.cancel) {//取消             
          }
      }});
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
        error: '请输入接收人信息进行搜索'
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
      RDUserCodes:'',//记录接收人工号
    });
  },
    // 选中后清空
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
        var tempPersonArray=that.data.transferPersonArray;
        that.setData({
          tranferPersons: that.data.tranferPersons + ',' + rdata.UserCode + '-' + rdata.UserName,
          RDUserCodes:that.data.RDUserCodes+','+rdata.UserCode,
          spUser: '',
          inputVal: [], //组件Value
          userArraylist: [], //组件数组
        });
      } else {
        that.setData({
          tranferPersons: rdata.UserCode + '-' + rdata.UserName,
          RDUserCodes:rdata.UserCode,
          spUser: '',
          inputVal: [], //组件Value
          userArraylist: [], //组件数组
        });
      }
    },

  
});