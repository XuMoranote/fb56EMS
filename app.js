//app.js
var call = require("utils/request.js")
App({
  onLaunch: function () {
    //1.进入小程序检查更新
    this.updatemManager();
    //2.进入小程序首先判断 本地用户登录存储 如果本地用户已经记录登陆则不再进行登陆。
    var LonginToKen = wx.getStorageSync('cookies');
    var LonginUserInfo = this.globalData.userInfo = wx.getStorageSync('FBUserInfo');
    if (LonginToKen == "" || LonginUserInfo == "") {
     // this.AppLogin();
    }
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
            var cookies = eData.cookies[0]; //本地存储 用户请求凭证
            that.globalData.userInfo = eData.data.Data; //本地存储 用户信息
            //存储当前服务器返回的登陆状态
            wx.setStorageSync('cookies', cookies);
            wx.setStorageSync('FBUserInfo', that.globalData.userInfo);
            wx.setStorageSync('IDCardStr', ''); //每一次登陆成功后，清空一下工资查看的身份证后六位密码                  
            console.log('1.同步,登陆成功，获取确认 cookies:' + wx.getStorageSync('cookies'), wx.getStorageSync('FBUserInfo'));
            // console.log( JSON.stringify(wx.getStorageSync('FBUserInfo')));
          } else {
            console.log('登陆失败,==>' + eData.data.Message);
          }       
        }, function () {
          console.info("【请求失败】，登陆失败!");
        }).then(res => {
          var uInfo = that.globalData.userInfo;
          if (uInfo != "" && uInfo != null && uInfo != undefined) {
            console.log('2.同步,第一次获取小红表待办和提醒设置');
            return call.GetQueryWaitCount(); //获取红色待办小角标.
          }
        });
      });
    });
  },
  /* 获取最新版本 小程序信息 */
  updatemManager: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('已进入最新版本检查方法--->', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('有最新版本等待用户选择是否更新----->')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('用户已选择结果.', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                  console.log('强制重启更新...', res)
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        } else {
          console.log('没有检测到最新 版本更新文件！')
        }
      });
    }
  },
  globalData: {
    userInfo: [],
  }
})