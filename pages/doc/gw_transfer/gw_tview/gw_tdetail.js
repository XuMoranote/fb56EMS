var call = require("../../../../utils/request.js");
var file = require("../../../../utils/files")
Page({
  data: {
    docID: '',
    transferID: '',
    display: 'block',
    docinfoData: {},
    docFilesData: [],
    transferData: {
      onTitleTap: 'handleTitleTap',
      previewTranfserImageTap: 'previewTranfserImageTap',
      panels: [],
    },
  },
  onLoad(query) {
    // 页面加载
    if (query.docid != '') {
      this.setData({
        'docID': query.docid,
        'transferID': query.transferid
      });
      if (this.data.transferID === "null" || this.data.transferID === "undefined" || this.data.transferID === '') {
        this.setData({
          'display': 'none'
        });
      }
      wx.showLoading({
        title: '加载中...',
      });
      let self = this;
      call.request('/PubDocDetails', JSON.stringify({
        documentID: query.docid
      }), function (res) {
        if (res.Code === 1) {
          let transferList = [];
          res.Data.TransferList.forEach(element => {
            let transfer = {
              title: element.CheckerName + '-' + element.CheckerCompanyName.slice(0, 4) + '-' + element.CheckerJobName.slice(0, 6),
              content: element.CheckerContent,
              expanded: true,
              transferFileData: element.Files
            }
            if (element.CheckerTime !== null) {
              transfer.title = transfer.title + '-' + element.CheckerTime
            } else {
              transfer.title = transfer.title + '-' + '未审'
            }
            transferList.push(transfer);
          });
          self.setData({
            'docinfoData': res.Data.MainInfo,
            'docFilesData': res.Data.FilesJson,
            'transferData.panels': transferList,
          });
        } else {
          self.setData({
            error: res.Message
          });
        }
      }, function (res) {
        //dd.navigateTo({url: '/pages/error/index'})
        self.setData({
          error: "调用接口出错了！"
        });
      });
    }
  }, 
 /* 隐藏显示列 */
  handleTitleTap(e) {
    const {
      index
    } = e.currentTarget.dataset;
    const panels = this.data.transferData.panels;
    // android does not supprt Array findIndex
    panels[index].expanded = !panels[index].expanded;
    this.setData({
      transferData: {
        ...this.data.transferData,
        panels: [...panels],
      },
    });
  },
  previewImage(e) {
    //文件预览 和下载公用方法
    file.previewFileHeard("公文流转",e);  
  },
  previewTranfserImageTap(e) {
    this.previewImage(e);
  },
  transferDoc(e) {
    //流转
    wx.navigateTo({
      url: '/pages/doc/gw_transfer/gw_tview/gw_transfer?docid=' + this.data.docID + '&transferID=' + this.data.transferID
    })
  }
});