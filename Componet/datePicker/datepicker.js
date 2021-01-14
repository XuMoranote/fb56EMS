// Componet/datePicker/datepicker.js
const util = require('../../utils/util.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    dateType: { // dateType 类型：date 时，只显示日期 ，dateTime 显示日期和时间， Time 时 只显示时间 
      type: String,
    }
  },
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
      const nowYear = date.getFullYear();
      const nowMonth = date.getMonth();
      const nowDay = date.getDate();
      const nowHour = date.getHours();
      const nowMinute = date.getMinutes();

      //看当前用户传入的 控件类型： date 时，只显示日期 ，dateTime 显示日期和时间， Time 时 只显示时间 
      let dateType = this.properties.dateType;
      if (dateType == "date") {
        // 默认弹出组件时选中时间为当前时间
        this.setData({
          nowDate: [nowYear, nowMonth, nowDay - 1]
        })
      }else if (dateType == "date2") {
        // 默认弹出组件时选中时间为当前时间
        this.setData({
          nowDate: [nowYear, nowMonth]
        })
      }else if (dateType == "time") {
        this.setData({
          nowDate: [nowHour, nowMinute]
        })
      } else {
        // 默认弹出组件时选中时间为当前时间
        this.setData({
          nowDate: [nowYear, nowMonth, nowDay - 1, nowHour, nowMinute]
        })
      }

      // 年份
      const years = [];
      for (let i = date.getFullYear()-3; i <= date.getFullYear() + 2; i++) {
        years.push({
          title: i + "年",
          value: i
        });
      }

      // 月份
      const months = [];
      for (let i = 1; i <= 12; i++) {
        i = util.subTen(i);
        months.push({
          title: i + "月",
          value: +i
        });
      }

      // 获取日期
      const days = [];
      for (let i = 1; i <= 31; i++) {
        i = util.subTen(i);
        days.push({
          title: i + "日",
          value: +i
        });
      }

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
          title: i * 10 + "分", //注意，此处*10 了
          value: +i * 10
        });
      }


      if (dateType == "date") {
        this.setData({
          multiArray: [years, months, days]
        })
      }else if (dateType == "date2") {
        this.setData({
          multiArray: [years, months]
        })
      }else if (dateType == "time") {
        this.setData({
          multiArray: [hours, minutes]
        })
      } else {
        this.setData({
          multiArray: [years, months, days, hours, minutes]
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _bindMultiPickerChange: function (e) {
      let indexes = e.detail.value;
      //看当前用户传入的 控件类型： date 时，只显示日期 ，dateTime 显示日期和时间， Time 时 只显示时间 
      let dateType = this.properties.dateType;
      if (dateType == "date") {
        let year = this.data.multiArray[0][indexes[0]].value;
        let month = this.data.multiArray[1][indexes[1]].value;
        let day = this.data.multiArray[2][indexes[2]].value;
        this.triggerEvent("bindMultiPickerChange", [year, month, day])
      }else if (dateType == "date2") {
        let year = this.data.multiArray[0][indexes[0]].value;
        let month = this.data.multiArray[1][indexes[1]].value;    
        this.triggerEvent("bindMultiPickerChange", [year, month])
      } else if (dateType == "time") {
        let hour = this.data.multiArray[0][indexes[0]].value;
        let min = this.data.multiArray[1][indexes[1]].value;
        this.triggerEvent("bindMultiPickerChange", [hour, min])
      } else {
        let year = this.data.multiArray[0][indexes[0]].value;
        let month = this.data.multiArray[1][indexes[1]].value;
        let day = this.data.multiArray[2][indexes[2]].value;
        let hour = this.data.multiArray[3][indexes[3]].value;
        let min = this.data.multiArray[4][indexes[4]].value;
        // console.log('picker数据：', year, month, day, hour, min)
        this.triggerEvent("bindMultiPickerChange", [year, month, day, hour, min])
      }
    },
    _bindMultiPickerColumnChange: function (e) { // 根据年份和月份计算每月多少天并更新日期时间选择器
      let changeTarget = e.detail.column;
      let changeIndex = e.detail.value;
      let year = this.data.currentYear || this.data.nowDate[0];
      let month = this.data.currentMonth || this.data.nowDate[1] + 1;
      //看当前用户传入的 控件类型： date 时，只显示日期 ，dateTime 显示日期和时间， Time 时 只显示时间 
      let dateType = this.properties.dateType;


      if (changeTarget == 0 && dateType != "time") {
        year = this.data.multiArray[changeTarget][changeIndex].value;
        this.setData({
          currentYear: year
        })
      }
      if (changeTarget == 1 && dateType != "time") {
        month = this.data.multiArray[changeTarget][changeIndex].value
        this.setData({
          currentMonth: month
        })
      }

      /**
       * 当Date作为构造函数调用并传入多个参数时，如果数值大于合理范围时（如月份为 13 或者分钟数为 70），相邻的数值会被调整。
       * 比如 new Date(2013, 13, 1)等于new Date(2014, 1, 1)，它们都表示日期2014-02-01（注意月份是从0开始的）
       * new Date(2019, 10, 0).getDate() 等于2019-10-31日 实际上获取的是2019-10月的最后一天
       */
      if ((changeTarget == 0 || changeTarget == 1) && dateType != "time"&& dateType != "date2") {
        let date = new Date(year, month, 0);
        let days = date.getDate();
        let multiArray = this.data.multiArray;

        let mulitDays = [];
        for (let i = 1; i <= days; i++) {
          i = util.subTen(i);
          mulitDays.push({
            title: i + "日",
            value: +i
          });
        }
        multiArray[2] = mulitDays;
        this.setData({
          multiArray: multiArray
        })
      }
    },
    _bindCancel: function (e) {
      this.triggerEvent('bindCancel')
    }
  },
});