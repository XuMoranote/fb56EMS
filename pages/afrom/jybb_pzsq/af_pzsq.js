// pages/afrom/jybb_pzsq/af_pzsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //申请类型 是否隐藏
    sqlx_hidden: false,
    //调价方式 是否隐藏
    tjfs_hidden: false,
    //调整价格二级类型 是否隐藏
    tzjglx2_hidden: true,
    //调整费用项 是否隐藏
    tzfyx_hidden: false,
    //调整价格类型 选择事件
    tzjglx_index: 0,
    tzjglx_array: ['请选择', '成本价格', '市场价格', '营销价格'],
    //调整价格二级类型 选择事件
    tzjglx2_index: 0,
    tzjglx2_array: ['请选择', '中转类费用', '末端类费用', '其他'],
    //申请类型 选择事件
    sqlx_index: 0,
    sqlx_array: ['请选择', '变更', '新增', '其他'],
    /* 调整费用项（多选） */
    selectArray: [], //{id": "10","text": "待我审批"},  
    /* 调价方式 */
    tjfs_index: 0,
    tjfs_array: ['请选择', '上调', '下调', '其他'],
    /* 调价范围 */
    tjfw_index: 0,
    tjfw_array: ['请选择', '全国性', '区域性'],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      tzjglx: '', //调整价格类型
      tzjglx2: '', //调整价格二级类型
      ysyhlcssrbh: '', //以上月货量测算收入变化
      tzfyx: '', //调整费用项(多选)
      sqlx: '', //申请类型
      tjfs: '', //调价方式
      tjfw: '', //调价范围
      sxrq: '', //生效日期
      Reason: '', //申请原因
      fileAttach: [], //附件   
    },
    isManySubmit: true, //提交时，不允许多次提交 变量设置。
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ //获取当前人员姓名用户信息
      isManySubmit: true, //初始化允许提交
      'formData.UserName': app.globalData.userInfo.UserName,
      'formData.UserCode': app.globalData.userInfo.UserCode,
      'formData.szfb': app.globalData.userInfo.PdepartmentName,
      'formData.szfbbm': app.globalData.userInfo.PdepartmentCode,
    });
  },
  /* 调整价格类型 下拉框事件 */
  bindPickerChange_tzjglx(e) {
    let tzfyxArray = []; //调整费用项
    let tzjglx = this.data.tzjglx_array[e.detail.value];
    let myComponent = this.selectComponent('#myComponent'); // 页面获取自定义组件实例
    myComponent.loadSelect(); // 通过实例调用自定义 组件事件 

    if (tzjglx == "成本价格") {
      this.setData({ //区分调价方式 和 调价类型
        tjfs_hidden: true,
        sqlx_hidden: false,
        tzjglx2_hidden: false //调整价格二级类型
      });
      tzfyxArray = [{
          "id": "收件操作费",
          "text": "收件操作费"
        }, {
          "id": "出发支线费",
          "text": "出发支线费"
        },
        {
          "id": "出发操作费",
          "text": "出发操作费"
        }, {
          "id": "省内干线费",
          "text": "省内干线费"
        }, {
          "id": "网点出发支线费",
          "text": "网点出发支线费"
        },
        {
          "id": "干线费",
          "text": "干线费"
        }, {
          "id": "操作费",
          "text": "操作费"
        }, {
          "id": "派送费",
          "text": "派送费"
        },
        {
          "id": "自提费",
          "text": "自提费"
        }, {
          "id": "支线费",
          "text": "支线费"
        }, {
          "id": "网点操作费",
          "text": "网点操作费"
        }, {
          "id": "网点支线费",
          "text": "网点支线费"
        }, {
          "id": "其他",
          "text": "其他"
        },
      ];
    } else if (tzjglx == "市场价格" || tzjglx == "营销价格") {
      this.setData({ //区分调价方式 和 调价类型
        tjfs_hidden: false,
        sqlx_hidden: true,
        tzjglx2_hidden: true //调整价格二级类型
      });
      if (tzjglx == "市场价格") {
        tzfyxArray = [{
            "id": "中转费新增",
            "text": "中转费新增"
          }, {
            "id": "中转费调整",
            "text": "中转费调整"
          }
          /*,{
            "id": "中转费折扣",
            "text": "中转费折扣"
          }*/
        ]
      } else if (tzjglx == "营销价格") {
        tzfyxArray = [{
          "id": "包仓营销",
          "text": "包仓营销"
        }, {
          "id": "增量返利营销",
          "text": "增量返利营销"
        }, {
          "id": "对赌营销",
          "text": "对赌营销"
        }, {
          "id": "折扣营销",
          "text": "折扣营销"
        }]
      }
    }
    this.setData({
      tzjglx_index: e.detail.value,
      "formData.tzjglx": tzjglx,
      selectArray: tzfyxArray, // 调整费用项
    });
  },

  /* 调整价格二级类型 下拉框事件 */
  bindPickerChange_tzjglx2(e) {
    let tzfyxArray = []; //调整费用项
    let tzjglx2 = this.data.tzjglx2_array[e.detail.value];
    let myComponent = this.selectComponent('#myComponent'); // 页面获取自定义组件实例
    myComponent.loadSelect(); // 通过实例调用自定义 组件事件 

    if (tzjglx2 == "中转类费用") {
      tzfyxArray = [{
          "id": "收件操作费",
          "text": "收件操作费"
        }, {
          "id": "出发支线费",
          "text": "出发支线费"
        },
        {
          "id": "出发操作费",
          "text": "出发操作费"
        }, {
          "id": "省内干线费",
          "text": "省内干线费"
        }, {
          "id": "网点出发支线费",
          "text": "网点出发支线费"
        },
        {
          "id": "干线费",
          "text": "干线费"
        }, {
          "id": "操作费",
          "text": "操作费"
        }
      ];
      this.setData({
        tzfyx_hidden: false,
      });
    } else if (tzjglx2 == '末端类费用') {
      tzfyxArray = [{
          "id": "派送费",
          "text": "派送费"
        },
        {
          "id": "自提费",
          "text": "自提费"
        }, {
          "id": "支线费",
          "text": "支线费"
        }, {
          "id": "网点操作费",
          "text": "网点操作费"
        }, {
          "id": "网点支线费",
          "text": "网点支线费"
        }
      ];
      this.setData({
        tzfyx_hidden: false,
      });
    } else {
      //隐藏并 清空 调整费用项
      tzfyxArray = [];
      this.setData({
        tzfyx_hidden: true
      });
    }
    this.setData({
      tzjglx2_index: e.detail.value,
      "formData.tzjglx2": tzjglx2,
      selectArray: tzfyxArray, // 调整费用项 
      "formData.tzfyx": '',
    });
  },
  /* 以上月货量测算收入变化 文本框取值 */
  input_ysyhlcssrbh(e) {
    this.setData({
      "formData.ysyhlcssrbh": e.detail.value
    });
  },
  /* 调整费用项（多选） 下拉框事件 获取值 */
  selectGetData: function (e) {
    let tzfyx = e.detail.text
    this.setData({
      "formData.tzfyx": tzfyx,
    });
  },
  /*申请类型 选中事件*/
  bindPickerChange_sqlx(e) {
    let sqlx = this.data.sqlx_array[e.detail.value];
    this.setData({
      'sqlx_index': e.detail.value,
      'formData.sqlx': sqlx,
    });
  },
  /*调价方式 选中事件*/
  bindPickerChange_tjfs(e) {
    let tjfs = this.data.tjfs_array[e.detail.value];
    this.setData({
      'tjfs_index': e.detail.value,
      'formData.tjfs': tjfs,
    });
  },
  /*调价范围 选中事件*/
  bindPickerChange_tjfw(e) {
    let tjfw = this.data.tjfw_array[e.detail.value];
    this.setData({
      'tjfw_index': e.detail.value,
      'formData.tjfw': tjfw,
    });
  },
  /*选择 生效日期 */
  sxrqDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " +
      util.padLeft(date[3], 2) + ":" +
      util.padLeft(date[4], 2);
    self.setData({
      'formData.sxrq': selectDate
    });
  },
  /*获取页面 申请原因文本框的值*/
  input_Reason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },
  /*选择附件上传的方法*/
  chooseImage() {
    basicCommon.afromUploadFile(this);
  },
  /*清除附件*/
  onClearAttachTap() {
    basicCommon.afromClearfileAttach(this);
  },
  /*提交特殊政策申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.tzjglx) || self.data.formData.tzjglx == '请选择') {
      self.setData({
        error: '请选择调整价格类型！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.ysyhlcssrbh)) {
      self.setData({
        error: '请输入以上月货量测算收入变化！'
      });
      return;
    }
    if (self.data.formData.tzjglx == '成本价格') {
      if (util.strIsEmpty(self.data.formData.sqlx) || self.data.formData.sqlx == '请选择') {
        self.setData({
          error: '请选择 申请类型'
        });
        return;
      }
      if (util.strIsEmpty(self.data.formData.tzjglx2) || self.data.formData.tzjglx2 == '请选择') {
        self.setData({
          error: '请选择 调整价格二级类型'
        });
        return;
      }
    } else if (self.data.formData.tzjglx != '成本价格') {
      if (util.strIsEmpty(self.data.formData.tjfs) || self.data.formData.tjfs == '请选择') {
        self.setData({
          error: '请选择 调价方式'
        });
      }
      return;
    }
    if (self.data.formData.tzjglx2 != "其他" && util.strIsEmpty(self.data.formData.tzfyx)) {
      self.setData({
        error: '请选择调整费用项'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.tjfw)) {
      self.setData({
        error: '请选择 调价范围！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sxrq)) {
      self.setData({
        error: '请选择 生效日期！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.Reason)) {
      self.setData({
        error: '请输入申请原因'
      });
      return;
    }
    if (this.data.formData.fileAttach.length < 1) {
      self.setData({
        error: '请上传附件信息'
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    //获取菜单ID
    var menuid = munePage.GetMenuCode("价格配置申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "workflowformdata",
      // "_flowid": "1311b271-66ac-40f8-8b1b-d29fabd4ac46",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "AdjustmentPriceType": self.data.formData.tzjglx, //调整价格类型
      "AdjustmentPriceType2": self.data.formData.tzjglx2, //调整价格类型二级类型
      "Input_yshlcssrbh": self.data.formData.ysyhlcssrbh, //以上月货量测算收入变化
      "AdjustExpenseItem": self.data.formData.tzfyx, //调整费用项(多选)
      "ApplicationType": self.data.formData.sqlx, //申请类型
      "RangeOfPriceAdjustType": self.data.formData.tjfs, //调价方式
      "RangeOfPriceAdjustment": self.data.formData.tjfw, //调价范围
      "EffectiveDate": self.data.formData.sxrq, //生效日期
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})