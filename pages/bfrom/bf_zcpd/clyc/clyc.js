// pages/bfrom/bf_zcpd/clyc/clyc.js
var call = require("../../../../utils/request.js");
Page({
  data: {
    errorItem: [{
        name: '损坏',
        value: '损坏',
        checked: true
      },
      {
        name: '丢失',
        value: '丢失'
      },
      {
        name: '其它',
        value: '其它'
      }
    ],
    querydata: {}
  },
  onLoad(query) { // 页面加载
    this.querydata = query; //传入的查询参数
  },
  onSubmit: function (e) { //异常保存
    if (e.detail.value.ErrorMsg.length <= 0) {
      self.setData({
        'error': '请您填写异常描述'
      });
      return;
    };
    let self = this;
    let paramData = JSON.stringify({
      ID: self.querydata.id, //盘点任务主键,
      Type: e.detail.value.ErrorType, //异常类型
      message: e.detail.value.ErrorMsg, //异常描述
    });
    wx.showLoading({
      content: '加载中...',
    });

    call.amsrequest('/AssetsInventory/InventoryTaskAbnormal', paramData, (res) => {
      if (res.Code != 1) {
        self.setData({
          'error': res.Message,
        });
        return;
      }
      wx.showModal({
        title: '温馨提示',
        content: '异常处理成功,点击确定返回盘点详情',
        showCancel: true, //是否显示取消按钮
        cancelText: "取消", //默认是“取消”
        cancelColor: 'skyblue', //取消文字的颜色
        confirmText: "继续", //默认是“确定”
        confirmColor: 'skyblue', //确定文字的颜色
        success: function (result) {
          if (result.confirm) {
            wx.navigateBack({
              url: '/pages/bfrom/bf_zcpd/zcxq/zcxq?id=' + self.querydata.id + ''
            });
          }
        }
      });      
    }, function (res) {
      self.setData({
        'error': '抱歉,请重新保存',
      });
    });
  }
});