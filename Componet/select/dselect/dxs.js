// Componet/select/dselect/dxs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propArray: {
      type: Array,
    },
    nowText: {
      type: String,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false, //初始option不显示
    animationData: {}, //右边箭头的动画 
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadSelect:function(){ //初始化加载自定义事件
      this.selectToggle();
      this.setData({
        selectShow: false,
        nowText: '',
        propArray:[]
      })
    },
    //option的显示与否
    selectToggle: function () {
      var nowShow = this.data.selectShow; //获取当前option显示的状态
      //创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          animationData: animation.export()
        })
      } else {
        animation.rotate(180).step();
        this.setData({
          animationData: animation.export()
        })
      }
      this.setData({
        selectShow: !nowShow
      })
    },
    //设置内容
    setText: function (e) {
      var nowData = this.properties.propArray; //当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
      var nowIdx = e.target.dataset.index; //当前点击的索引
      var nowText = nowData[nowIdx].text; //当前点击的内容            
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.animation.rotate(0).step();
      //确定已选是否 不存在
      var isY = true;
      nowText = nowText.replace(/√/g, '');
      let o = this.properties.nowText.split(',');
      o.forEach(str => {
        if (str === nowText) {
          isY = false
        }
      })
      if (isY) { //不在所选列表 --add
        let itxt = nowText + ',' + this.properties.nowText;
        if ((itxt.charAt(itxt.length - 1)) == ',') {
          itxt = itxt.substring(0, itxt.lastIndexOf(','));
        }
        this.properties.nowText = itxt;
        this.properties.propArray[nowIdx].text += "√"; //选中
      } else {
        let txt = this.properties.nowText;
        if (txt.indexOf(nowText) > -1) {
          let a = txt.split(',');
          a.forEach(item => {
            if (item == nowText) {
              a.splice(a.indexOf(item), 1);
            }
          });
          txt = a.join(',');
        }
        if ((txt.charAt(txt.length - 1)) == ',') {
          txt = txt.substring(0, txt.lastIndexOf(','));
        }
        this.properties.nowText = txt;
        this.properties.propArray[nowIdx].text = nowText; //取消选中
      }
      this.setData({
        nowText: this.properties.nowText,
        propArray: this.properties.propArray
      })
      this.triggerEvent('myget', {
        text: this.properties.nowText
      });
    },
    zdgb() {
      if (this.data.selectShow) {
        // this.setData({
        //   selectShow: false,
        // })
      }
    },
  }
})