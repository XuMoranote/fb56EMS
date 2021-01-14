//index.js
var app = getApp();
var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js");
Page({
  data: {
    serversData: [], //页面列表展示
    /*顶部动画图片轮播 */
    indicatorDots: true, //显示面板显示点
    autoplay: true, //自动切换
    interval: 1000 * 60, //切换时间
    duration: 1000, //动画时长
    imgUrls: [
      '/utils/icon/image/error-view/one.jpg',
      '/utils/icon/image/error-view/two.jpg',
      // '/utils/icon/image/error-view/one.jpg',
      // '/utils/icon/image/error-view/two.jpg'
    ],
  },
  onLoad: function () {
    var that = this; 
 
    that.AppLogin();
   
    
  },
  /* onLoad后 每次页面呈现值都调用使用 */
  onShow: function () {
    this.getPageWarnNum(); //页面显示小红点通知 数目
  },
  AppLogin: function () {
    var that = this;
    var isWxWork = false; //判断当前运行环境
    var wxgetSystemInfo = call.wxPromisify(wx.getSystemInfo);
    return wxgetSystemInfo().then(res => {
      console.log("当前运行环境：企业微信小程序环境");
      isWxWork = res.environment == 'wxwork';
      wx.setStorageSync('isWxWork', isWxWork);
      /*  微信小程序登录 */
      if (!isWxWork) {
        var wxlogin = call.wxPromisify(wx.login);
        return wxlogin().then(res => {
          return call.PromiseRequest('/WxLogin=' + res.code, {}, function (res) {}, function (res) {});
        });
      }
      /*  企业微信小程序登录 */
      var wxqylogin = call.wxPromisify(wx.qy.login);
      return wxqylogin().then(res => {
        return call.requestLogin('WorkWxLogin/', {
          code: res.code
        }, function (eData) {
          if (eData.data.Code == 1) {
            var getData = {
              gwlzWarnNum: eData.data.Data.GWLZ,
              lcclWarnNum: eData.data.Data.LCCL,
              IfDingMessage: eData.data.Data.IfDingMessage
            }

            wx.setStorageSync('QueryWaitCount', getData); //代办数据小红标显示
            var cookies = eData.cookies[0]; //本地存储 用户请求凭证
            app.globalData.userInfo = eData.data.Data; //本地存储 用户信息

            //存储当前服务器返回的登陆状态
            wx.setStorageSync('cookies', cookies);
            wx.setStorageSync('FBUserInfo', app.globalData.userInfo);
            wx.setStorageSync('IDCardStr', ''); //每一次登陆成功后，清空一下工资查看的身份证后六位密码                  
            console.log('1.同步,登陆成功，获取确认 cookies:' + wx.getStorageSync('cookies'), wx.getStorageSync('FBUserInfo'));

            let queryWaitCount = wx.getStorageSync('QueryWaitCount');
            that.setData({
              serversData: that.pageShowMenu(queryWaitCount.gwlzWarnNum, queryWaitCount.lcclWarnNum,true),
            });
            // console.log( JSON.stringify(wx.getStorageSync('FBUserInfo')));
          } else {
            console.log('登陆失败,==>' + eData.data.Message);
          }       
        }, function () {
          console.info("【请求失败】，登陆失败!");
        }).then(res => {
          var uInfo = app.globalData.userInfo;
          if (uInfo != "" && uInfo != null && uInfo != undefined) {
            console.log('2.同步,第一次获取小红表待办和提醒设置');
            return call.GetQueryWaitCount(); //获取红色待办小角标.
          }
        });
      });
    });
  },

  /* 请求 数据库服务器 显示通知小红点 */
  getPageWarnNum: function () {
    var that = this;
    call.GetQueryWaitCount().then(res => {
      if(res == true){
        return;//首页先渲染页面,res = true 时，异步还没登陆成功，所以不做操作。
      }
      let queryWaitCount = wx.getStorageSync('QueryWaitCount');
      //刷新页面显示
      var listService = that.pageShowMenu(queryWaitCount.gwlzWarnNum, queryWaitCount.lcclWarnNum,false); // 列表显示         
      that.setData({
        serversData: listService
      });
    });
  },
  /* 组装页面显示数据 */
  pageShowMenu: function (gwlzWarnNum, lcclWarnNum, ifLoad) {
    var MuneAny = app.globalData.userInfo.MenuList;
    var listService = [{
      title: '公文流转',
      items: [{
        name: '公告查看',
        url: '/pages/doc/gw_view/gw_vlist',
        icon: '/utils/icon/image/canvas.png',
        code: '46',
        disabled: ifLoad ? false : (!util.isInArray(MuneAny, Number('46')))
      }, {
        isBind: true,
        name: '公文编辑',
        url: '/pages/doc/gw_edit/gw_save',
        icon: '/utils/icon/image/api_media.png',
        code: '57',
        disabled: ifLoad ? false : !util.isInArray(MuneAny, Number('57'))
      }, {
        isBind: true,
        name: '公文流转',
        url: '/pages/doc/gw_transfer/gw_tlist',
        icon: '/utils/icon/image/biz_collapse.png',
        code: '54',
        warnNum: gwlzWarnNum,
        disabled: ifLoad ? false : !util.isInArray(MuneAny, Number('54'))
      }]
    }, {
      title: '流程管理',
      items: [{
        name: '流程处理',
        url: '/pages/doc/workflow/wf_list',
        icon: '/utils/icon/image/icon_biz_HL.png',
        code: '79',
        warnNum: lcclWarnNum,
        disabled: ifLoad ? false : !util.isInArray(MuneAny, Number('79'))
      }, {
        disabled: true
      }, {
        disabled: true
      }]
    }];
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
    return _listService;
  },
  /* 下拉恢复 情况 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  /**
   * 当点击Item的时候传递过来
   */
  bindNavigator: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
})