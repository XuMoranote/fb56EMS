// pages/doc/noticeinfo/noticedetail.js
var call = require("../../../utils/request");
var file = require("../../../utils/files")
Page({
  data: {
    noticeID: '',
    noticeDetailData: ''
  },
  onLoad(query) {
    // 页面加载完成
    if (query.noticeid != '') {
      this.setData({
        'noticeID': query.noticeid,
      }); 
      wx.showLoading({
        title: '加载中...',
      });  
      let self = this;
      let paramData = JSON.stringify({
        ID: this.data.noticeID,
      });
      call.request("/QueryInfoPublishInfo",paramData,function (res) {
        if (res.Code === 1) {
          if (res.Data.rows.length > 0) {
            self.setData({'noticeDetailData': res.Data.rows[0]});
          } else {
            self.setData({success: '未查到详情数据'});          
          }
        } else {
          self.setData({error: res.Message});    
        }
      },function (res) {      
        self.setData({error: '查询失败，接口调用失败！'});    
      }); 
    }
  },
  //文件预览
  previewImage(e) {
    file.previewFileHeard("公文查看",e);   
  },
})