// pages/doc/workflow/wf_ListIndex.js
var call = require("../../../utils/request.js")
Page({
  //...list,
  data: {
    array: ['待办事项', '已办事项', '抄送通知'],
    index: 0,
    workflowData: {
      onItemTap: 'handleListItemTap',
      header: '',
      data: []
    },
    pageData: {
      LTitle: '',
      startDate: '',
      endDate: '',
      total: 0, //总数量
      currentPage: 0, //第几次加载
      rows: 15 //每次加载的数量
    },
  },
  onLoad(query) {},
  onShow: function () {
    this.setData({
      'pageData.LTitle': '',
      'pageData.startDate': '',
      'pageData.endDate': '',
      'pageData.total': 0,
      'pageData.currentPage': 0,
      'workflowData.data': [],
    });
    this.searchMothod();
  },
  onReady() { // 页面加载完成    
  },
  doneSearch(e) { //文本框检索光标离开
    if (e.detail.value !== this.data.pageData.LTitle) {
      this.setData({
        'pageData.LTitle': e.detail.value,
        'workflowData.data': [],
        'pageData.currentPage': 0
      });
      this.searchMothod();
    }
    //dd.hideKeyboard();
  },
  onPullDownRefresh() {
    // 页面被下拉
    this.setData({
      'workflowData.data': [],
      'pageData.currentPage': 0,
    });
    this.searchMothod();
    //dd.stopPullDownRefresh();
  },
  onReachBottom() { // 页面被拉到底部
    this.searchMothod();
  },
  bindPickerChange(e) {
    this.setData({
      'index': e.detail.value,
      'workflowData.data': [],
      'pageData.currentPage': 0,
    });
    this.searchMothod();
  },
  bindRadiochange(e) {
    this.setData({
      'index': e.detail.value,
      'workflowData.data': [],
      'pageData.currentPage': 0,
    });
    this.searchMothod();
  },
  padLeft(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  },
  startDatePicker(res) {
    let self = this;
    var date = res.detail;
    var selectDate = date[0] + "年" +
      self.padLeft(date[1], 2) + "月" +
      self.padLeft(date[2], 2) + "日 " +
      self.padLeft(date[3], 2) + ":" +
      self.padLeft(date[4], 2);
    self.setData({
      'pageData.startDate': selectDate
    });
    if (self.data.pageData.startDate !== '' && self.data.pageData.endDate !== '') {
      self.setData({
        'workflowData.data': [],
        'pageData.currentPage': 0
      });
      self.searchMothod();
    }
  },
  endDatePicker(res) {
    let self = this;
    var date = res.detail.value;
    var date = res.detail;
    var selectDate = date[0] + "年" +
      self.padLeft(date[1], 2) + "月" +
      self.padLeft(date[2], 2) + "日 " +
      self.padLeft(date[3], 2) + ":" +
      self.padLeft(date[4], 2);
    self.setData({
      'pageData.endDate': selectDate
    });
    if (self.data.pageData.startDate !== '' && self.data.pageData.endDate !== '') {
      self.setData({
        'workflowData.data': [],
        'pageData.currentPage': 0
      });
      self.searchMothod();
    }
  },
  searchMothod() {
    wx.showLoading({
      title: '加载中...',
    });
    let methodName = '';
    //解决安卓切换组件时，无法比较问题
    if (this.data.index + '' === '0') {
      methodName = 'GetWaitList';
    } else if (this.data.index == '1') {
      methodName = 'GetCompletedList';
    } else if (this.data.index = '2') {
      methodName = 'GetCopyTaskList';
    }
    let self = this;
    let paramData = JSON.stringify({
      LTitle: this.data.pageData.LTitle,
      startDate: this.data.pageData.startDate,
      endDate: this.data.pageData.endDate,
      page: this.data.pageData.currentPage + 1,
      rows: this.data.pageData.rows
    });
    call.wfrequest("/" + methodName, paramData, function (res) {
      if (res.Code === 1) {
        if (res.Data.rows.length > 0) {
          //success 追加到查询列表中
          let workflowList = self.data.workflowData.data;
          res.Data.rows.forEach(element => {
            let TitleTime = element.SenderTime;
            if (element.SenderTime == null) {
              TitleTime = element.ReceiveTime;
            }
            let wrokflow = {
              title: element.Title + '\n' + TitleTime,
              arrow: 'horizontal',
              extra: element.SenderName,
              id: element.ID,
              flowID: element.FlowID,
              instanceID: element.InstanceID,
              stepID: element.StepID,
              groupID: element.GroupID,
              Status: element.Status, //是否已读
              type:element.Type,//流程类型（转发/流程步骤）
            }
            workflowList.push(wrokflow);
          });
          self.setData({
            'workflowData.data': workflowList,
            'pageData.currentPage': self.data.pageData.currentPage + 1
          });
        } else {
          self.setData({
            success: '没有更多数据'
          });
        }
      } else {
        self.setData({
          error: res.Message
        });
      }
    }, function (res) {
      self.setData({
        error: '查询失败，请重新操作'
      });
    });
  },
  handleListItemTap(e) { //列表导航到流转页面
    let workData = {};
    //遍历获取点击的工作流原始数据
    this.data.workflowData.data.forEach(element => {
      if (element.id === e.currentTarget.dataset.id) {
        workData = element;
      }
    });
    let isEdit = "false";
    if (this.data.index + '' === '0') {
      isEdit = "true";
    }
    // 此处添加逻辑，当用户 时 选择 抄送通知选项时（this.data.index=2）  已读状态为 Status =1 时 不传 workData.id  
    if (this.data.index == 2 && workData.Status == 1) {
      workData.id = "";
    }
    wx.navigateTo({
      url: '/pages/doc/workflow/wf_view/wf_detail?id=' + workData.id + '&flowID=' + workData.flowID + '&instanceID=' + workData.instanceID + '&stepID=' + workData.stepID + '&groupID=' + workData.groupID + '&isEdit=' + isEdit+'&type='+workData.type 
    })
  }
})