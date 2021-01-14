// pages/bfrom/bf_zcpd/pzpd/pzpd.js
var call = require("../../../../utils/request.js");
var basicCommon = require("../../../../utils/basicCommon.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    querydata: {},
    photos: [], //拍照上传选择的图片
    inventoryObject: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.querydata = options; //传入的查询参数
  },
  handleBeginChoosePhoto() { //拍照盘点
    basicCommon.bfromUploadFile(this);
  },
  onClearAttachTap() { //清除上传的文件key
    basicCommon.bfromClearfileAttach(this);
  },
  onTapSavephoto() { //拍照上传保存
    let self = this;
    if (self.data.photos.length <= 0) {
      self.setData({
        'error': '请拍照或选择一张资产的图片'
      });
      return;
    }
    wx.showLoading({
      content: '正在处理...'
    });
    let paramData = JSON.stringify({
      ID: self.querydata.id, //盘点任务主键
      photos: self.data.photos //图片
    });
    //更新盘点状态
    call.amsrequest('/AssetsInventory/InventoryTaskNormalPhoto', paramData, (updateres) => {
      if (updateres.Code != 1) {
        self.setData({
          'error': updateres.data.Message
        });
        return;
      }
      wx.showModal({
        title: '温馨提示',
        content: '盘点成功,点击确定返回盘点列表',
        showCancel: true, //是否显示取消按钮
        cancelText: "取消", //默认是“取消”
        cancelColor: 'skyblue', //取消文字的颜色
        confirmText: "继续", //默认是“确定”
        confirmColor: 'skyblue', //确定文字的颜色
        success: function (result) {
          if (result.confirm) {
            wx.navigateBack({
              url: '/pages/bfrom/bf_zcpd/index'
            }); //返回到列表
          }
        }
      });
    }, (res) => {
      self.setData({
        'error': '请重新操作'
      });
    });
  },
})