var app = getApp();
var util = require("../../../utils/util.js");
// pages/index/wf/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serversData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function () {
    this.showPageInit(); //页面显示
  },
  showPageInit() {
    var MuneAny = app.globalData.userInfo.MenuList;
    var listService = [{
      title: '流程发起 -->单页',
      items: [{
        name: '行政流程',
        url: '/pages/index/wf/xzlc/dh_xzlc',
        icon: '/utils/icon/image/api_analysis.png',
        code: '78',
        disabled: !util.isInArray(MuneAny, Number('78'))
      }, {
        name: '人事流程',
        url: '/pages/index/wf/rslc/dh_rslc',
        icon: '/utils/icon/image/logo.png',
        code: '126',
        disabled: !util.isInArray(MuneAny, Number('126'))
      }, {
        name: '财务管理',
        url: '/pages/index/wf/cwgl/dh_cwgl',
        icon: '/utils/icon/image/salary.png',
        code: '253',
        disabled: !util.isInArray(MuneAny, Number('253'))
      }, {
        name: '经营本部',
        url: '/pages/index/wf/jybb/dh_jybb',
        icon: '/utils/icon/image/api_data.png',
        code: '241',
        disabled: !util.isInArray(MuneAny, Number('241'))
      }, {
        name: '运营本部',
        url: '/pages/index/wf/yybb/dh_yybb',
        icon: '/utils/icon/image/navigator.png',
        code: '271',
        disabled: !util.isInArray(MuneAny, Number('271'))
      }, {
        name: '工资查询',
        url: '/pages/cfrom/cf_password/password', //'/pages/cfrom/cf_ssmm/ssmm',
        icon: '/utils/icon/image/reimbursement.png',
        code: '000', //工资的暂时没有 永久显示
        disabled: false
      }, {
        name: '资产盘点',
        url: '/pages/bfrom/bf_zcpd/index',
        icon: '/utils/icon/image/api_scan.png',
        code: '000', //永久显示
        disabled: false
      },{
        name: '',
        url: '',
        icon: '/utils/icon/image/ams_inventory.png',
        code: '',
        disabled: !util.isInArray(MuneAny, Number('-999'))
      },{
        name: '',
        url: '',
        icon: '/utils/icon/image/ams_inventory.png',
        code: '',
        disabled: !util.isInArray(MuneAny, Number('-999'))
      }]
    }, {
      title: '\r',
      items: []
    }]
    var _listService = [];
    listService.forEach(element => {
      var _element = {
          title: element.title,
          items: []
        },
        _item = [],
        _item2 = [];
      element.items.forEach(item => {
        if (!item.disabled) {
          _item.push(item);
        } else {
          _item2.push(item);
        }
      });
      _element.items = _item.concat(_item2);
      _listService.push(_element);
    });
    this.setData({
      serversData: _listService
    });
  },
  /**
   * 当点击Item的时候传递过来
   */
  bindNavigator: function (e) {
    if (e.currentTarget.dataset.path == null || e.currentTarget.dataset.path == '') {
      this.setData({
        success: "建设中，请稍后..."
      });
      return
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
  /* 下拉恢复 情况 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
})