// pages/afrom/af_gz/gzquery.js
var util = require("../../../utils/util.js");
var call = require("../../../utils/request.js");
// var basicCommon = require("../../../utils/basicCommon.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    year_month: '',
    detailData: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var NowYearMonth = this.getNowYearMonth();
    this.setData({
      year_month: NowYearMonth
    });
    this.getDataSet();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /*选择 查询工资日期 */
  bindPickerChange(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" + util.padLeft(date[1], 2) //+ "-" +"01" + " " 
    self.setData({
      year_month: selectDate
    });
    this.getDataSet();
  },
  /* 获取当前年月 */
  getNowYearMonth() {
    var date = new Date();
    // //月份为0-11，所以+1，月份小于10时补个0
    // var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    // month = month -1;//工资查看 为看当前年月的 上个月工资数据 ，所以默认看上个月数据。
    // return date.getFullYear() + "-" + month;
    var month= date.getMonth();
    var year=date.getFullYear();
    if(month==0)
    {//每年一月份，应默认查询上年是二月份呢
     return year-1+"-12";
    }
    else if(month<10)
   {
     return year+"-0"+month;
   }
   else
   {
    return year+"-"+month;
   }

  },
  getDataSet() {
    let self = this;
    self.setData({
      'detailData': {},
    });
    call.PromiseRequest("WageSlipQuery", JSON.stringify({
        year_month: this.data.year_month + "-" + "01",
      }),
      function (res) {
        if (res.Code === 1) { //解析表单数据      
          let result = res.Data;
          // result.forEach(function(item, index){});
          self.setData({
            'detailData': result,
          });
        } else {
          self.setData({
            error: res.Message
          });
        }
      },
      function (res) {
        self.setData({
          error: "调用接口出错了！"
        });
      });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
})