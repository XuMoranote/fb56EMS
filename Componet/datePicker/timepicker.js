const util = require('../../utils/util.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {},
  /**
   * 组件的初始数据
   */
  data: {
    multiArray: [], // 月和日从1开始
    nowDate: [] // 月和日从0开始
  },
  lifetimes: {
    attached: function () {
      const date = new Date();
      const nowHour = date.getHours();
      const nowMinute = date.getMinutes();
      // 默认弹出组件时选中时间为当前时间
      this.setData({
        nowDate: [nowHour, nowMinute]
      })
      // 获取小时
      const hours = [];
      for (let i = 0; i < 24; i++) {
        i = util.subTen(i);
        hours.push({
          title: i + "时",
          value: +i
        });
      }
      // 获取分钟
      const minutes = [];
      for (let i = 0; i < 6; i++) { // 分钟按照需求 10分钟 进行显示。
        i = util.subTen(i);
        minutes.push({
          title: i*10 + "分", //注意，此处*10 了
          value: +i*10
        });
      }
      this.setData({
        multiArray: [hours, minutes]
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _bindMultiPickerChange: function (e) {
      let indexes = e.detail.value; 
      let hour = this.data.multiArray[0][indexes[0]].value;
      let min = this.data.multiArray[1][indexes[1]].value;
      this.triggerEvent("bindMultiPickerChange", [hour, min])
    },
    _bindMultiPickerColumnChange: function (e) { // 根据年份和月份计算每月多少天并更新日期时间选择器
      let changeTarget = e.detail.column;
      //let changeIndex = e.detail.value;
      if (changeTarget == 0 || changeTarget == 1) {
        let multiArray = this.data.multiArray; 
        this.setData({
          multiArray: multiArray
        });
      }
    },
    _bindCancel: function (e) {
      this.triggerEvent('bindCancel')
    }
  },
});