// pages/bfrom/bf_zcpd/index.js
var call = require("../../../utils/request.js");
Page({
  /**
   * 页面的初始数据
   */
  data: { //定义变量
    title: '资产盘点',
    listData: { // 自定义数据对象
      onItemTap: 'handleListItemTap',
      header: '',
      data: []
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function (dd) {
    this.search(); //查询
  },
  search(delegate) { //查询
    let self = this;
    self.setData({
      'listData.data': []
    });
    wx.showLoading({
      content: '加载中...',
    });
    let paramData = JSON.stringify({});
    call.amsrequest('/AssetsInventory/QueryInventoryInfo', paramData, function (res) {
      if (res.Code != 1) {
        self.setData({
          'error': '没有更多数据'
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
      let docList = []; //拼接数据源
      data.rows.forEach(element => {
        let title = [];
        title.push(element.CardCode); //二级类别
        title.push('(' + element.LT_AssetsName + ')'); //卡片编码/资产编码
        let extra = element.StatesName; //盘点状态
        let pushData = {
          title: title.join(''), //标题
          arrow: 'horizontal',
          extra: extra, //盘点状态
          id: element.ID, //主键
          cardcode: element.CardCode, //卡片编码
          inventoryObject: element, //盘点对象
        }
        docList.push(pushData);
      });
      self.setData({
        'listData.data': docList,
      });
      if (delegate == 'scan') { //列表刷新后继续扫描,异步请求得到结果后执行(扫码识别成功后刷新)
        handleBeginScan();
      };
    }, function (res) {
      self.setData({
        'error': '查询失败，没有更多数据'
      });
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.search(); //查询
    wx.stopPullDownRefresh();
  },

  handleBeginScan() { //调用扫一扫功能。
    let self = this;
    let docList = self.data.listData.data; //列表数据
    wx.scanCode({
      success: (res) => {
        /*调用成功的回调函数 */
        if (res.result == null || res.result.length <= 0) { // 没能识别成功      
          self.setData({
            'success': '未能识别二维码,请重新扫描、或点开资产编码使用拍照盘点功能'
          });
          return;
        }
        self.handleDisposeScanResult(res.result, docList);
      }
    });
  },
  handleDisposeScanResult(scanCode, docList) { //通过卡片编码完成盘点任务的盘点;参数说明(scanCode:识别的二维码代码字符)  
    let self = this;
    // let docList = self.data.listData.data; //列表数据
    //通过卡片编码,得到盘点任务的主键
    let filter = docList.filter(x => x.cardcode == scanCode);
    if (filter.length <= 0) {
      self.setData({
        'error': '当前资产编码不属于您!'
      });
      return;
    }
    //限制
    if (filter[0].inventoryObject.States != 1) { //等待盘点状态       
      self.setData({
        'error': '当前资产已经盘点!'
      });
      return;
    }
    wx.showLoading({
      content: '扫描成功,正在处理...'
    });
    let paramData = JSON.stringify({
      ID: filter[0].id
    });

    call.amsrequest('/AssetsInventory/InventoryTaskNormal', paramData, (res) => {
      if (res.Code != 1) {
        self.setData({
          'error': res.Message
        });
        return;
      }
      wx.vibrateLong({ //震动反馈
        success: () => {
          wx.showModal({
            title: '温馨提示',
            content: '资产编码:(' + scanCode + '),已经盘点成功,继续盘点吗?',
            showCancel: true, //是否显示取消按钮
            cancelText: "取消", //默认是“取消”
            cancelColor: 'skyblue', //取消文字的颜色
            confirmText: "继续", //默认是“确定”
            confirmColor: 'skyblue', //确定文字的颜色
            success: function (result) {
              if (result.confirm) {
                self.search('scan'); //刷新列表、继续扫描
              } else {
                self.search(); //刷新列表
              }
            }
          });
        }
      });
    }, (res) => {
      self.setData({
        'error': '盘点失败,请重新操作'
      });
    });
  },
  handleListItemTap(e) { //点击列表项导航到拍照上传
    let docList = this.data.listData.data; //历史数据
    let items = docList.filter(x => x.id == e.currentTarget.dataset.id); //当前选择的数据
    if (items.length <= 0) { //避免通过下标取不到值   
      self.setData({
        'error': '请刷新后再试'
      });
      return;
    }
    wx.navigateTo({url:'/pages/bfrom/bf_zcpd/zcxq/zcxq?id=' + items[0].id +''});   
  }
})