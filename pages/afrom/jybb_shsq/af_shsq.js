// pages/afrom/jybb_shsq/af_shsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //招商会规模
    zshgm_index: 0,
    zshgm_array: ['请选择', '小型', '中型', '大型'],
    /*招商会政策（多选） */
    selectArray: [{
        "id": "充值赠送",
        "text": "充值赠送"
      }, {
        "id": "物料折扣购买",
        "text": "物料折扣购买"
      },
      {
        "id": "免考核期",
        "text": "免考核期"
      }, {
        "id": "出货折扣",
        "text": "出货折扣"
      },
      {
        "id": "入网费用减免",
        "text": "入网费用减免"
      }, {
        "id": "以上都有",
        "text": "以上都有"
      },
    ],
    /* 采购物料 */
    cgwl_index: 0,
    cgwl_array: ['请选择', '是', '否'],
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      zshgm: '', //招商会规模
      zshfsqy: '', //招商会辐射区域
      zshzc: '', //招商会政策(多选)
      zshzksj: '', //招商会召开时间
      chrs: '', //参会人数
      qymbz: '', //签约目标值
      cgwl: '', //采购物料
      sfxyxczl: '', //是否需要宣传资料
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
  /* 招商会规模 下拉框事件 */
  bindPickerChange_zshgm(e) {
    let zshgm = this.data.zshgm_array[e.detail.value];
    this.setData({
      zshgm_index: e.detail.value,
      "formData.zshgm": zshgm,
    });
  },
  /* 招商会辐射区域 文本框取值 */
  input_zshfsqy(e) {
    this.setData({
      "formData.zshfsqy": e.detail.value
    });
  },
  /* 招商会政策（多选） 下拉框事件 获取值 */
  selectGetData: function (e) {
    let zshzc = e.detail.text
    this.setData({
      "formData.zshzc": zshzc,
    });
  },
  /*选择 招商会召开时间 */
  zshzksjDatePicker(e) {
    let self = this;
    var date = e.detail;
    var selectDate = date[0] + "-" +
      util.padLeft(date[1], 2) + "-" +
      util.padLeft(date[2], 2) + " " +
      util.padLeft(date[3], 2) + ":" +
      util.padLeft(date[4], 2);
    self.setData({
      'formData.zshzksj': selectDate
    });
  },
  /* 参会人数 文本框取值 */
  input_chrs(e) {
    this.setData({
      "formData.chrs": e.detail.value
    });
  },
  /* 签约目标值 文本框取值 */
  input_qymbz(e) {
    this.setData({
      "formData.qymbz": e.detail.value
    });
  },
  /* 采购物料 下拉框事件 */
  bindPickerChange_cgwl(e) {
    let cgwl = this.data.cgwl_array[e.detail.value];
    this.setData({
      cgwl_index: e.detail.value,
      "formData.cgwl": cgwl,
    });
  },
  /*是否需要宣传资料 输入选择*/
  radiochange_sfxyxczl: function (e) {
    this.setData({
      'formData.sfxyxczl': e.detail.value
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
  /*提交网络招商会申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.zshgm)) {
      self.setData({
        error: '请选择招商会规模！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zshfsqy)) {
      self.setData({
        error: '请输入招商会辐射区域！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zshzc)) {
      self.setData({
        error: '请选择招商会政策'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zshzksj)) {
      self.setData({
        error: '请选择招商会召开时间'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.chrs)) {
      self.setData({
        error: '请输入参会人数'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.qymbz)) {
      self.setData({
        error: '请输入签约目标值'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.cgwl)) {
      self.setData({
        error: '请选择采购物料'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfxyxczl)) {
      self.setData({
        error: '请选择是否需要宣传资料'
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
    var menuid = munePage.GetMenuCode("网络招商会申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_fb_applycmb",
      // "_flowid": "9cded668-a198-45b1-a6eb-087969053cb5",
      "SubTitle": "FB-JYBB-",
      "WordNumber": self.data.formData.UserCode, //用户编码
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "CmbScale": self.data.formData.zshgm, //招商会规模
      "CmbArea": self.data.formData.zshfsqy, //招商会辐射区域
      "CmbPolicy": self.data.formData.zshzc, //招商会政策(多选)
      "CmbBeginTime": self.data.formData.zshzksj, //招商会召开时间
      "CmbPeopleCount": self.data.formData.chrs, //参会人数
      "CmbTarget": self.data.formData.qymbz, //签约目标值
      "IfBuy": self.data.formData.cgwl, //采购物料
      "IfAd": self.data.formData.sfxyxczl, //是否需要宣传资料
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self, paramData);
  }
})