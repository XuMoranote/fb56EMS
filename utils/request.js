//项目URL相同部分，减轻代码量，同时方便项目迁移
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */

var testHost ='https://work.ztkydata.com'; //https://work.ztkydata.com/
var host = testHost + '/Ding/Server/'; //公文流转 
var wfhost = testHost + '/WorkFlow/'; //工作流
var amshost ='https://asm.ztky.com';//AMS 资产管理系统
// var amshost = 'http://211.103.230.189:8005/';//AMS 资产管理系统
var dlhost = 'https://crlgfileserver1.oss-cn-beijing.aliyuncs.com'; //文件下载 --目前没有使用，但是需要在小程序设置里面进行配置


/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */
/* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */ /* 测试版 小程序 */

//开发测试
// var host = 'http://localhost:8006/Ding/Server/';
// var wfhost = 'http://localhost:8006/WorkFlow/';

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 **/
/* 流程处理 post 请求调用 */
function wfrequest(url, postData, doSuccess, doFail) {
  BaseRequest(wfhost + url, postData, doSuccess, doFail)
}
/* 公文流转 post 请求调用 */
function request(url, postData, doSuccess, doFail) {
  BaseRequest(host + url, postData, doSuccess, doFail)
}
/* ams资产管理系统 post 请求 */
function amsrequest(url, postData, doSuccess, doFail){
  BaseRequest(amshost + url, postData, doSuccess, doFail)
}

/* @fn 传入的函数，如wx.request、wx.download*/
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj) //执行函数，obj为传入函数的参数
    });
  }
}
//Promise 同步执行方法
function PromiseRequest(url, postData, callBackSuccess, callBackFail) {
  var request = wxPromisify(wx.request); //ajax请求
  return request({
    url: host + url,
    header: {
      'Cookie': wx.getStorageSync('cookies')
    },
    data: postData,
    method: 'POST',
  }).then(res => {
    OnlyWayRequest(res);
    callBackSuccess(res.data);
  }).catch(res => {
    callBackFail(res);
  });
}

/* 基础请求类 */
function BaseRequest(url, postData, doSuccess, doFail) {
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: url,
    header: {
      'Cookie': wx.getStorageSync('cookies')
    },
    //header: { "content-type": "application/json;charset=UTF-8" },
    //header: { "content-type": "application/x-www-form-urlencoded" },    
    data: postData,
    method: 'POST',
    success: function (res) {
      OnlyWayRequest(res);
      doSuccess(res.data);
    },
    fail: function (e) {
      doFail;
    },
    complete: function (e) {
      wx.hideLoading(); //隐藏 弹出显示
      wx.hideNavigationBarLoading(); //隐藏标题等待
      wx.stopPullDownRefresh(); //隐藏下拉
    }
  });
}

//登陆Post方法
function requestLogin(url, postData, doSuccess, doFail) {
  var request = wxPromisify(wx.request); //ajax请求
  return request({
    url: host + url,
    data: postData,
    method: 'POST',
  }).then(res => {
    OnlyWayLogin(res);
    doSuccess(res);
  }).catch(res => {
    doFail(res);   
  });
}
//GET请求，不需传参，直接URL调用，
function getData(url, doSuccess, doFail) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    method: 'GET',
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function () {
      doFail();
    },
  })
}
//如果系统返回了临时升级，提示系统维护..
function OnlyWayLogin(eData) {
  if (eData.data == null) {
    return;
  }
  if (eData.data.Code == "0") {
    if (eData.data.Message.indexOf("没有在平台注册") > -1) {
      wx.showToast({
        title: "没有在平台注册",
        icon: "none",
        duration: 60000
      });
      return;
    } else if (eData.data.Message.indexOf("获取授权失败或非本企业用户") > -1) {
      wx.showToast({
        title: "获取授权失败或非本企业用户",
        icon: "none",
        duration: 60000
      });
      return;
    } else if (eData.data.indexOf("系统临时升级") > -1) {
      wx.showToast({
        title: '临时升级',
        icon: 'loading',
        duration: 3000
      });
    }
    wx.setStorageSync('cookies', ""); //系统临时升级清除登陆状态
    wx.setStorageSync('FBUserInfo', ""); //系统临时升级清除登陆状态
  } else if (eData.data.Code == 5) {
    wx.showToast({
      title: '服务器错误',
      icon: 'loading',
      duration: 3000
    });
    return
  } else if ((eData.data.Message == "登录成功") || eData.data.Code == 1) {
    wx.showToast({
      title: eData.data.Message,
      duration: 1000
    });
    return;
  }
}
/* RequestPost 成功时必经之路 */
function OnlyWayRequest(eData) {
  //判断当前环境是 企业微信环境 还是小程序环境 true 为企业微信环境
  wx.getSystemInfo({
    success(res) {
      if (res.environment != 'wxwork') {
        wx.showToast({
          title: "暂无用户数据",
          icon: 'loading',
          duration: 1000
        });
        return;
      } else {
        if (eData.data.Message != null && eData.data.Message.indexOf("登录超时") > -1) {
          wx.showToast({
            title:'登陆中',// eData.data.Message,
            icon: 'loading',
            duration: 3000
          });
          getApp().AppLogin(); //登陆超时 进行用户重新登陆
        }
      }
    }
  });
  //判断服务器异常的情况。
  if (eData.data.Code != null && eData.data.Code == 5) {
    wx.showToast({
      title: '服务器异常！',
      icon: 'loading',
      duration: 3000
    });
  }
}
/*----------------------------------------获取公文首页代码提醒小红角表 开始----------------------------------------*/
function GetQueryWaitCount() {
  //如果没有进行过登陆则不执行
  var LonginToKen = wx.getStorageSync('cookies');
  var LonginUserInfo = getApp().globalData.userInfo;
  if (LonginToKen == "" || LonginUserInfo == "") {
    return Promise.resolve(true);
  }
  var getData = {
    gwlzWarnNum: "0",
    lcclWarnNum: "0",
    IfDingMessage: true
  }
  //如果存储的是过期的toke还会登陆失败。此处需要 默默调用一下请求方法，提前变更登陆token 目的是 不让用户在操作时体验到登陆超时。
  return PromiseRequest("/QueryWaitCount", {}, function (res) {
    if (res.Code == 1) {
      getData.gwlzWarnNum = res.Data.GWLZ;
      getData.lcclWarnNum = res.Data.LCCL;
      getData.IfDingMessage = res.Data.IfDingMessage;
      getApp().globalData.userInfo.MenuList = res.Data.MenuList;
      wx.setStorageSync('FBUserInfo', getApp().globalData.userInfo);
    } else {
      console.info("待办提醒记录失败!Code!=1");
    }
    wx.setStorageSync('QueryWaitCount', getData); //回调获值
  }, function (res) {
    console.info("【请求失败】，获取待办条数失败！");
  });
}
/*----------------------------------------获取公文首页代码提醒小红角表 结束----------------------------------------*/
/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js") 加载
 * 在引入引入文件的时候" "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.request = request;
module.exports.wfrequest = wfrequest;
module.exports.requestLogin = requestLogin;
module.exports.getData = getData;
module.exports.host = host;
module.exports.wfhost = wfhost;
module.exports.dlhost = dlhost;
module.exports.amshost = amshost;
module.exports.GetQueryWaitCount = GetQueryWaitCount;
module.exports.wxPromisify = wxPromisify;
module.exports.PromiseRequest = PromiseRequest;
module.exports.amsrequest = amsrequest;