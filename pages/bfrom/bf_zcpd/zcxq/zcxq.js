// pages/bfrom/bf_zcpd/zcxq/zcxq.js
var call = require("../../../../utils/request.js");
Page({
  data: {
    photos: [], //拍照上传选择的图片
    querydata: {},
    inventoryObject: {
      States: '0', //盘点状态
      PDCode: '', //计划编码
      CardCode: '', //卡片编码
      Files: '', //附件预览
      FilesJson: '', //附件下载
      AssetsName: '', //资产类型
      LO_AssetsName: '', //一级类别
      LT_AssetsName: '', //二级类别
      AssetsModel: '', //资产型号
      OriginalValue: '', //原值
      UseCompany: '', //使用公司
      UseStation: '', //使用单位
      ChargeUserCode: '', //负责人编码
      ChargeUser: '', //负责人
      BeginTime: '', //盘点开始时间
      EndTime: '', //盘点结束时间
      ErrorType: '', //异常类型
      ErrorMsg: '', //异常原因
      OperTime: '', //任务操作时间
      OperUserName: '', //处理人
      OperTime: '', //处理时间
      CusC_ChooseImg: 'hidden', //是否显示选择照片拍照上传功能
      CusC_ErrorRow: 'hidden', //当此盘点任务是异常时显示异常原因和异常类型
      CusC_ErrorButton: 'hidden', //控制填写异常按钮      
    }
  },
  onLoad(query) { // 页面加载
    this.querydata = query; //传入的查询参数
  },
  onShow() { // 页面显示    
    this.search(); //查询
  },
  onPullDownRefresh() { // 页面被下拉
    this.search(); //查询
    wx.stopPullDownRefresh(); //停止刷新
  },
  search() { //查询
    let self = this;
    wx.showLoading({
      content: '加载中...',
    });
    let paramData = JSON.stringify({
      ID: self.querydata.id //盘点任务主键
    });
    call.amsrequest('/AssetsInventory/QueryInventoryTaskByID', paramData, (res) => {
      if (res.Code != 1) {
        self.setData({
          'error': '查询失败,没有更多数据'
        });
        return;
      }
      let data = JSON.parse(res.Data);
      if (data.rows.length <= 0) {
        self.setData({
          'error': '没有更多数据'
        });
        return;
      }
      let inventoryObject = data.rows[0];
      if (inventoryObject.CheckType != '扫描识别') {
        // inventoryObject.CusC_ChooseImg='show';
        //2020.07.16 只允许扫码盘点 或者登记异常
      }
      //正常 需要上传附件 
      if (inventoryObject.States != '2' && inventoryObject.States != '3') {
        inventoryObject.CusC_ChooseImg = 'show';
        inventoryObject.CusC_ErrorButton = 'show';
      } else {
        inventoryObject.CusC_ChooseImg = 'hidden';
        inventoryObject.CusC_ErrorButton = 'hidden';
      }
      if (inventoryObject.States == '3') { //异常状态
        inventoryObject.CusC_ErrorRow = 'show';
      }
      //非扫描识别都可以填写异常,已经异常状态则不显示
      // if (inventoryObject.CheckType != '扫描识别' && inventoryObject.States != '3') { 
      //   inventoryObject.CusC_ErrorButton = 'show';
      // }
      let uploadImg = inventoryObject.FilesJson; //历史的图片
      let uploadPhotoArray = [];
      if (uploadImg != null && uploadImg.length > 0) {
        for (let i = 0; i < uploadImg.length; i++) {
          const element = uploadImg[i];
          uploadPhotoArray.push({
            AttachKey: element.AttachKey,
            AttachName: element.AttachName,
            Src: element.AbsoluteAddress
          });
        }
      }
      self.setData({
        'inventoryObject': inventoryObject,
        'photos': uploadPhotoArray
      });
    }, function (res) {
      self.setData({
        'error': '查询失败，请重新操作'
      });
    });
  },

  onTapWriteError() { //填写异常
    let self = this;
    wx.navigateTo({
      url: '/pages/bfrom/bf_zcpd/clyc/clyc?id=' + self.querydata.id + ''
    });
  },
  onTapWriteZCPZPD() { //资产正常拍照盘点
    let self = this;
    wx.navigateTo({
      url: '/pages/bfrom/bf_zcpd/pzpd/pzpd?id=' + self.querydata.id + ''
    });
  }
})