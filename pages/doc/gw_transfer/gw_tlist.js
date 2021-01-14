// pages/gw_flow/gw_rows.js
var call = require("../../../utils/request.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //文本框的值
    searchValue: '',
    //Picker 选择器的参数
    array: ["待我审批", "我已经审批", "我发起的"],
    index: null,
    selectValues: '',
    /* List 列表 */
    modalContent: {},
    docListData: {
      onItemTap: 'handleListItemTap',
      header: '',
      data: []
    },
    pageData: {
      documentTitle: '',
      total: 0, //总数量
      currentPage: 0, //第几次加载
      rows: 15 //每次加载的数量
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: 0,
      selectValues: "待我审批" 
    });
  },
  /* Picker 下拉框*/
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value, //页面选定项
      selectValues: this.data.array[e.detail.value]
    });
    this.SearchWFRows();
  },
   /*radio-group切换事件 */
   bindRadioChange(e) {
      this.setData({
        index: e.detail.value, //页面选定项
        selectValues: this.data.array[e.detail.value]
      });
      this.SearchWFRows();
    },
  /* 搜索框事件 */
  InputSearchValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    });
  },
  /* 点击查询事件 */
  SearchWFRows: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    });
    //页面查询初始化 数据信息
    this.setData({
      'total': 0,
      'docListData.data': [],
      'pageData.currentPage': 0
    });
    var self = this;
    var selectTypeVlue = self.selectTypeVlue();
    let paramData = JSON.stringify({
      documentTitle: self.data.searchValue,
      checkerResult: selectTypeVlue.checkerResult,
      queryType: selectTypeVlue.queryType,
      page: self.data.pageData.currentPage + 1,
      rows: self.data.pageData.rows
    });
    self.requestData(paramData);
  },
  /* 选择框查询事件 */
  selectTypeVlue: function () {
    let checkerResult = '';
    let queryType = '';
    switch (this.data.selectValues) {
      case "待我审批":
        checkerResult = "0";
        queryType = "1";
        break;
      case "我已经审批":
        checkerResult = "1";
        queryType = "1";
        break;
      case "我发起的":
        checkerResult = "";
        queryType = "0";
        break;
      default: //"待我审批"
        checkerResult = "0";
        queryType = "1";
        break;
    }
    return {
      checkerResult: checkerResult,
      queryType: queryType
    };
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    });
    var selectTypeVlue = self.selectTypeVlue();
    let paramData = JSON.stringify({
      documentTitle: '',
      checkerResult: selectTypeVlue.checkerResult,
      queryType: selectTypeVlue.queryType,
      page: this.data.pageData.currentPage + 1,
      rows: this.data.pageData.rows
    });
    self.requestData(paramData);
  },
  /*页面下拉事件 */
  onPullDownRefresh() {
    this.SearchWFRows();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.SearchWFRows();
  },
  /* 页面 点击行 进行跳转 */
  handleListItemTap(e) {
    //列表导航到流转页面
    let transferid = '';
    //遍历获取流转的ID
    this.data.docListData.data.forEach(function (element, index) {
      if (element.id === e.currentTarget.dataset.id) {
        transferid = element.transferid;
      }
    });
    wx.navigateTo({
      url: '/pages/doc/gw_transfer/gw_tview/gw_tdetail?docid=' + e.currentTarget.dataset.id + '&transferid=' + transferid
    });
  },
  /* 请求*/
  requestData: function (paramData) {
    var self = this;
    call.request('/QueryDocTransfer', paramData, function (res) {
      if (res.Code === 1) {
        if (res.Data.rows.length > 0) {
          let docList = docList = self.data.docListData.data;
          res.Data.rows.forEach(element => {
            let doc = {
              // thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',
              title: element.DocumentTitle + '\n' + element.DocumentTime,
              arrow: 'horizontal',
              extra: element.OrginReporterName,
              id: element.DocumentID,
              transferid: element.TransferID
            }
            docList.push(doc);
          });
          self.setData({
            'docListData.data': docList,
            'pageData.currentPage': self.data.pageData.currentPage + 1,
            searchValue: ''
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
})