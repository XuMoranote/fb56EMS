var file = require("../../../../utils/files")
Page({
  data: {
    stepInfoData: {},
  },
  onLoad(query) {
    // 页面加载    
    if (query.detail !== '') {
      let stepInfoDataArr = JSON.parse(decodeURIComponent(query.detail));
      stepInfoDataArr.forEach(element => {
        if (element.Type === "file") {
          if (element.FieldValue != '') {
            element.FieldValue = JSON.parse(element.FieldValue);
          }
        }
      });
      this.setData({
        'stepInfoData': stepInfoDataArr
      });
    }
  },
  previewImage(e) {    
    file.previewFileHeard("流程处理-明细-file",e);
    /*
    //公文附件预览 
    if (e.currentTarget.dataset.attachname.toLowerCase().indexOf('.jpg') !== -1 || e.currentTarget.dataset.attachname.toLowerCase().indexOf('.jpeg') !== -1 ||
      e.currentTarget.dataset.attachname.toLowerCase().indexOf('.gif') !== -1 || e.currentTarget.dataset.attachname.toLowerCase().indexOf('.png') !== -1 ||
      e.currentTarget.dataset.attachname.toLowerCase().indexOf('.bmp') !== -1) {
      let filePath = [];
      filePath.push(call.host + 'Filepreview/' + e.currentTarget.dataset.attachkey + '?UpBucketName=' + e.currentTarget.dataset.upbucketname)
      wx.previewImage({
        current: 0,
        urls: filePath
      });
    } else {
      var url = call.host + 'Filepreview/' + e.currentTarget.dataset.attachkey + '?UpBucketName=' + e.currentTarget.dataset.upbucketname;
      wx.downloadFile({ //下载文件，生成临时地址
        url: url,
        success(res) {
          var saveFile = wx.env.USER_DATA_PATH + '/' + fileExtension;
          wx.saveFile({ //保存到本地
            tempFilePath: res.tempFilePath || res.filePath,
            filePath: saveFile,
            success: function (res) {
              const savedFilePath = res.savedFilePath;
              wx.openDocument({ // 打开文件
                filePath: savedFilePath,
                success: function (res) {
                  console.log('打开文档成功')
                },
              });
            },
            fail: function (err) {
              console.log('保存失败：', err)
            }
          });
        }
      });
    } */
  }
});