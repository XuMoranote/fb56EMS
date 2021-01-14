var call = require("../../../utils/request");
Page({
  data: {
    index: -1,
    noticeListData: {
      onItemTap: 'handleListItemTap',
      header: '',
      data: []
    },
    pageData: {
      lTitle: '',
      lDepartment: '',
      startDate: '',
      endDate: '',
      total: 0, //总数量
      currentPage: 0, //第几次加载
      rows: 15 //每次加载的数量
    },
    search: ''
  },
  /* 页面初次渲染完成 触发事件 页面加载完成后 只调用一次 */
  onReady() {
    this.setData({
      'total': 0,
      'noticeListData.data': [],
      'pageData.currentPage': 0
    });
    wx.showLoading({
      title: '加载中...',
    });
    let paramData = JSON.stringify({
      LTitle: '',
      LDepartment: '',
      page: this.data.pageData.currentPage + 1,
      rows: this.data.pageData.rows
    });
    this.CallRequestData(paramData);
  },
  /* 搜索框输入事件 */
  InputSearchValue: function (e) {
    let value = e.detail.value;
    this.setData({
      'pageData.lTitle': value,
      search: value
    });
  },
  /* 页面上拉 触底事件 页面被拉到底部*/
  onReachBottom() {
    wx.showLoading({
      title: '加载中...',
    });
    this.searchMothod();
  },
  /* 监听用户下拉动作 */
  onPullDownRefresh() {
    wx.showToast({
      title: '加载中....',
      icon: 'loading'
    });
    this.setData({
      'noticeListData.data': [],
      'pageData.currentPage': 0
    });
    this.searchMothod();
  },
  /*跳转页面 进行详情展示*/
  handleListItemTap(e) {
    wx.navigateTo({
      url: '/pages/doc/gw_view/gw_detail?noticeid=' + e.currentTarget.dataset.id
    })
  },
  /* 页面Input 标题 回车事件触发 */
  doneSearch(e) {
    this.setData({
      'pageData.lTitle': e.detail.value,
      'noticeListData.data': [],
      'pageData.currentPage': 0
    });
    this.searchMothod();
  },
  /* 查询公用方法 */
  searchMothod() {
    wx.showLoading({
      title: '加载中...',
    });
    let paramData = JSON.stringify({
      LTitle: this.data.pageData.lTitle,
      LDepartment: this.data.pageData.lDepartment,
      StartDate: this.data.pageData.startDate,
      EndDate: this.data.pageData.endDate,
      page: this.data.pageData.currentPage + 1,
      rows: this.data.pageData.rows
    });
    this.CallRequestData(paramData);
  },
  /*请求后台数据库动作*/
  CallRequestData(paramData) {
    let self = this;
    call.request('/QueryPublishInfo', paramData, function (res) {
      if (res.Code === 1) {
        if (res.Data.rows.length > 0) {  
          let noticeList = self.data.noticeListData.data; //追加到列表中
          res.Data.rows.forEach(element => {
            let notice = {
              title: element.Title,
              arrow: 'horizontal',
              extra: element.CreateMan,
              id: element.ID
            }
            noticeList.push(notice);
          });
          self.setData({
            search: '',
            'pageData.lTitle': '',
            'noticeListData.data': noticeList,
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
        error: res.Message
      });
    });
  }
})