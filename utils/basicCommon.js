var call = require("../utils/request.js");
/*----------------------------------------获取省市地区开始----------------------------------------*/
//获取地区共用接口方法
function GetCommDQinfo(page, Code, callBackSuccess) {
  call.request("DistrictCombobox/", JSON.stringify({
    id: Code
  }), callBackSuccess, function () {
    page.setData({
      error: "获取地区信息失败！"
    });
  })
}
/*请求数据库，获取省份信息 共用获取省级代码*/
function GetDBData_Sheng(page) {
  GetCommDQinfo(page, "0", function (res) {
    if (res.length > 0) {
      var shengSelect = [],
        sheng = [];
      shengSelect.push('请选择');
      sheng.push({
        name: '请选择',
        value: '0'
      });
      res.forEach(element => {
        shengSelect.push(element.text);
        sheng.push({
          name: element.text,
          value: element.id
        });
      });
      page.setData({
        sheng_array_select: shengSelect,
        sheng_array: sheng
      });
    }
  })
}
/*请求数据库，获取城市信息 共用获取城市代码*/
function GetDBData_Cheng(page, chengCode) {
  GetCommDQinfo(page, chengCode, function (res) {
    if (res.length > 0) {
      var select = [],
        array = [];
      res.forEach(element => {
        select.push(element.text);
        array.push({
          name: element.text,
          value: element.id
        });
      });
      page.setData({
        cheng_array_select: select,
        cheng_array: array,
        'formData.cheng': array[0].name,
        'formData.chengCode': array[0].value,
      });
      GetDBData_Qu(page, array[0].value); //根据城得默认第一个自动找到区信息
    }
  });
}
/*请求数据库，获取地区信息 共用获取地区代码*/
function GetDBData_Qu(page, quCode) {
  GetCommDQinfo(page, quCode, function (res) {
    if (res.length > 0) {
      var select = [],
        array = [];
      res.forEach(element => {
        select.push(element.text);
        array.push({
          name: element.text,
          value: element.id
        });
      });
      page.setData({
        qu_array_select: select,
        qu_array: array,
        'formData.qu': array[0].name,
        'formData.quCode': array[0].value,
      });
    } else {
      page.setData({
        qu_array_select: [],
        qu_array: [],
      });
    }
  });
}
/*----------------------------------------获取省市地区结束----------------------------------------*/
/*----------------------------------------获取 HR组织机构XX省区 开始----------------------------------------*/
function GetHRZZJGSheng(page, callBackSuccess) {
  return call.PromiseRequest("GetHRZZJGSheng/", null, callBackSuccess);
}
/*----------------------------------------获取 HR组织机构XX省区 结束----------------------------------------*/
/*----------------------------------------用户选择附件上传开始----------------------------------------*/
/* doc 文件夹下 公用调用附件上传的代码 */
function docUploadFile(page) {
  var serverUrl = call.host + "/ReceiveFile";
  let pageSetdata = function (page, fileAttachList) {
    page.setData({
      fileAttach: fileAttachList
    });
  }
  SelectFileAttach(serverUrl, page, pageSetdata, 'doc');
}
/* doc 文件夹下 公用清除附件 */
function docClearfileAttach(page) {
  page.setData({
    fileAttach: []
  });
}
/* afrom 文件夹下 公用调用附件上传的代码 */
function afromUploadFile(page) {
  var serverUrl = call.host + "/ReceiveFile";
  let pageSetdata = function (page, fileAttachList) {
    page.setData({
      "formData.fileAttach": fileAttachList
    });
  }
  SelectFileAttach(serverUrl, page, pageSetdata, 'afrom');
}
/*afrom 文件夹下 公用清除附件*/
function afromClearfileAttach(page) {
  page.setData({
    'formData.fileAttach': [],
  });
}
/* bfrom 文件夹下 公用调用附件上传的代码 */
function bfromUploadFile(page) {
  //bfromClearfileAttach(page);//将已选文件清空  
  let pageSetdata = function (page, fileAttachList) {
    page.setData({
      photos: fileAttachList
    });
  }
  SelectFileAttach(call.amshost + "/Public/ReceiveFile", page, pageSetdata, 'bfrom');
}
/*bfrom 文件夹下 公用清除附件*/
function bfromClearfileAttach(page) {
  page.setData({
    photos: [], //清除附件
  });
}
/* 通用 选择附件上传的方法*/
function SelectFileAttach(serverUrl, page, pageSetdata, callType) {
  let that = page;
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: res => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      let tempFilePaths = res.tempFilePaths;
      that.setData({
        tempFilePaths: tempFilePaths
      })
      /**
       * 上传完成后把文件上传到服务器
       */
      var count = 0;
      for (var i = 0; i < that.data.tempFilePaths.length; i++) {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 3000
        });
        wx.uploadFile({
          url: serverUrl, //请求上传的url
          filePath: tempFilePaths[i],
          name: 'filename',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            let resObj = JSON.parse(res.data);
            if (resObj.Code === 1) {
              let fileAttachList = [];
              switch (callType) { //此处根据类型引用 不同变量
                case "doc":
                  fileAttachList = that.data.fileAttach;
                  fileAttachList.push({
                    fileName: resObj.FileName.length > 25 ? resObj.FileName.substr(resObj.FileName.length - 25, resObj.FileName.length) : resObj.FileName,
                    key: resObj.Data
                  });
                  break;
                case "afrom":
                  fileAttachList = that.data.formData.fileAttach;
                  fileAttachList.push({
                    fileName: resObj.FileName.length > 25 ? resObj.FileName.substr(resObj.FileName.length - 25, resObj.FileName.length) : resObj.FileName,
                    key: resObj.Data
                  });
                  break;
                case "bfrom":
                  fileAttachList = [{
                    AttachKey: resObj.Data, //文件阿里云key
                    AttachName: resObj.FileName, //文件名称
                    Src: call.amshost + '/Public/Filepreview/' + resObj.Data
                  }];
                  break;
              }
              pageSetdata(page, fileAttachList);
            } else {
              that.setData({
                error: resObj.Message
              })
            }
            count++;
            //如果是最后一张,则隐藏等待中
            if (count == tempFilePaths.length) {
              wx.hideToast();
            }
            wx.showToast({
              title: '上传成功',
              icon: '',
              mask: true,
              duration: 1500
            });
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传失败',
              showCancel: false,
              success: function (res) {}
            })
          }
        });
      }
    }
  })
}
/*----------------------------------------用户选择附件上传结束----------------------------------------*/
/*----------------------------------------请求数据库选择人员开始----------------------------------------*/
function GetUserItem(page, jsonData) {
  let that = page;
  call.request('/SearchUser', jsonData, function (res) {
    var reData = res.Data;
    that.setData({
      inputVal: [], //组件Value  
      userArraylist: [], //组件数组
    });
    if (res.Code === 1 && reData.length > 0) {
      var Val = that.data.inputVal;
      var oldItem = that.data.userArraylist; //数组列表条目数
      //循环出模糊搜索人的所有审批人     
      for (var i0 = 0; i0 < reData.length; i0++) {
        var rdata = reData[i0];
        var viewShow = rdata.UserName + '-' + rdata.JobName + '-' + rdata.UnitName;
        oldItem.push(rdata); //这里不管push什么，只要数组长度增加1就行 
        var idx = oldItem.length - 1; //从0开始所以-1
        Val[idx] = viewShow; //修改对应索引值的内容        
      }
      that.setData({
        userArraylist: oldItem,
        inputVal: Val,
      });
    } else {
      //判断当前环境是 企业微信环境 还是小程序环境 true 为企业微信环境
      var isWxWork = wx.getStorageSync('isWxWork');
      if (!isWxWork) {
        that.setData({
          success: "无数据"
        });
        return;
      }
      that.setData({
        error: res.Message
      });
    }
  }, function (res) {
    that.setData({
      error: res.Message
    })
  });
}
/*----------------------------------------请求数据库选择人员结束----------------------------------------*/
/*----------------------------------------用户公用提交保存流程开始----------------------------------------*/
function gotoSubmit(page, paramData) {
  let self = page;
  self.setData({
    isManySubmit: false
  }); //不允许重复提交
  call.request('RoadFlowStart/', paramData, function (res) {
    if (res.Code === 1) {
      wx.navigateBack({
        delta: 1
      })
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
      /* 
        处理html字符 -->目前发现的有
          1.补打卡失败提示<br />
      */
      let errMsg = res.Message.replace('<br />', '');
      self.setData({
        error: errMsg,
        isManySubmit: true //可以继续提交
      });
    }
  }, function (res) {
    self.setData({
      error: "操作失败",
      isManySubmit: true //可以继续提交
    });
  });
}
/*----------------------------------------用户公用提交保存流程结束----------------------------------------*/
/*----------------------------------------获取字典中配置 项如公司主题等 开始----------------------------------------*/
function GetSub(page, type) { //MainCompany
  let that = page;
  call.request("/PublicDictionary/OA_" + type, {}, function (res) {
    var resData = [];
    resData.push('请选择');
    res.forEach(item => {
      resData.push(item.SubName);
    });
    that.setData({
      gszt_array: resData
    });
  }, function (res) {
    that.setData({
      error: "获页面字典数据信息出错！"
    });
  });
}
/*----------------------------------------获取字典中配置 项如公司主题等  结束----------------------------------------*/

/*---------------------------------调用声明底线---------------------------------*/
module.exports.GetDBData_Sheng = GetDBData_Sheng; //获取省
module.exports.GetDBData_Cheng = GetDBData_Cheng; //获取城市
module.exports.GetDBData_Qu = GetDBData_Qu; //获取区县
module.exports.docUploadFile = docUploadFile;
module.exports.docClearfileAttach = docClearfileAttach;
module.exports.afromUploadFile = afromUploadFile;
module.exports.afromClearfileAttach = afromClearfileAttach;
module.exports.bfromUploadFile = bfromUploadFile;
module.exports.bfromClearfileAttach = bfromClearfileAttach;
module.exports.gotoSubmit = gotoSubmit;
module.exports.GetUserItem = GetUserItem;
module.exports.GetHRZZJGSheng = GetHRZZJGSheng;
module.exports.GetSub = GetSub; // 获取 字典数据 ==> 目前 有 公司主体 等。