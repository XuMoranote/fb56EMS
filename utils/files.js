var app = getApp();
var call = require("../utils/request");
var fileHost = call.host;
var downloadHost = fileHost; //call.dlhost;

/*附件预览公共入口*/
function previewFileHeard(mType, fileElement) {
  var e = fileElement
  var fType = 'img';
  //文件类型验证   
  if (e.currentTarget.dataset.attachname.toLowerCase().indexOf('.jpg') !== -1 ||
    e.currentTarget.dataset.attachname.toLowerCase().indexOf('.jpeg') !== -1 ||
    e.currentTarget.dataset.attachname.toLowerCase().indexOf('.gif') !== -1 ||
    e.currentTarget.dataset.attachname.toLowerCase().indexOf('.png') !== -1 ||
    e.currentTarget.dataset.attachname.toLowerCase().indexOf('.bmp') !== -1) { //图片类型
  } else { //其他类型：doc，docx，pdf 等
    fType = 'file';
  }

  var fileExtension = fileElement.currentTarget.dataset.attachname.toLowerCase(); //文件扩展名
  var attachkey = fileElement.currentTarget.dataset.attachkey; //文件Key
  if (fType == 'img') {
    previewImage(fileElement.currentTarget.dataset.attachkey, null)
  } else {
    downloadFileView(attachkey, null, fileExtension);
  }
  /*
  switch (mType) {
    case "公文查看":
      gwck(fType, fileElement);
      break;
    case "公文流转": --2个
      break;
    case "流程处理-明细":
      break;
    case "流程处理-明细-link":
      break;
    case "流程处理-明细-file":
      break;
  }
   */
}

/* 图片预览  &u=app.globalData.userInfo.UserCode */
function previewImage(attachkey, upbucketname) {
  var url = fileHost + 'Filepreview/' + attachkey +'?u='+app.globalData.userInfo.UserCode;
  if (upbucketname != null && upbucketname != '') {
    url = fileHost + 'Filepreview/' + attachkey + '?UpBucketName=' + upbucketname +'&u='+app.globalData.userInfo.UserCode;
  }
  let filePath = [];
  filePath.push(url)
  wx.previewImage({
    current: 0,
    urls: filePath
  });
}

/*文件下载后预览 */
function downloadFileView(attachkey, upbucketname, fileExtension) {
  wx.showLoading({
    content: '加载中...',
  });
  //var fileExtension111 = fileExtension.currentTarget.dataset.attachname.toLowerCase(); //文件扩展名
  var url = downloadHost + 'Filepreview/' + attachkey +'?u='+app.globalData.userInfo.UserCode;
  if (upbucketname != null && upbucketname != '') {
    url = downloadHost + 'Filepreview/' + attachkey + '?UpBucketName=' + upbucketname +'&u='+app.globalData.userInfo.UserCode;
  }
  wx.downloadFile({
    url: url,
    success: function (res) {
      const filePath = res.tempFilePath
      var index = fileExtension.lastIndexOf(".");
      var suffix = fileExtension.substring(index + 1);
      console.log(suffix);
      wx.openDocument({
        filePath: filePath,
        fileType: suffix,
        success: function (res) {
          console.log('打开文档成功')
          wx.hideLoading({
            success: (res) => {},
          });
        },
        fail: function (rew) {
          console.log('打开文档失败！');
          console.log(rew)
        }
      })
    }
  })
  wx.hideLoading({
    success: (res) => {},
  });
  return;
}
/* -------------------------------附件上传-------------------------------------- */
function uploudFileHead() {}
module.exports.previewFileHeard = previewFileHeard;