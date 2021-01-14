// pages/afrom/jybb_rwsq/af_rwsq.js
const app = getApp();
var util = require("../../../utils/util.js");
var basicCommon = require("../../../utils/basicCommon.js");
var munePage = require("../../../utils/munePage.js");
Page({
  /**
   * 页面的初始数据
   **/
  data: {
    //网点层级选择事件
    wdcj_index: 0,
    wdcj_array: ['请选择', '一级', '二级'],
    //运行方式
    yxfs_index: 0,
    yxfs_array: ['请选择', '往返', '对发', '单程'],
    //车型
    cx_index: 0,
    cx_array: ['请选择', '面包', '4.2', '5', '6.2', '6.3', '6.8', '7.6', '7.8', '8', '8.6', '9.6', '13.5', '17.5'],
    //省级选择事件
    sheng_index: 0,
    sheng_array_select: [],
    sheng_array: [],
    //城市级选择事件
    cheng_index: 0,
    cheng_array_select: [],
    cheng_array: [],
    //区县级选择事件
    qu_index: 0,
    qu_array_select: [],
    qu_array: [],
    //上级网点 * 号控制
    sjwd_hidden:true,
    //是否B网
    sfbw_hidden:true,
    //表单数据
    formData: {
      UserName: '', //用户名称
      UserCode: '', //用户工号代码
      szfb: '', //所在分部
      szfbbm: '', // 所在分部编码
      wdmc: '', //网点名称
      wddm: '', //网点代码      
      wdcj: '', //网点层级
      wdfr:'', //网点法人
      wdgs:'', //网点公司
      sjwd: '', //上级网点
      sfBw: '', //是否B网
      Bwdm: '', //B 网代码
      Bwmc: '', //B 网名称      
      sheng: '', //省
      shengCode: '', //省代码
      cheng: '', //市
      chengCode: '', //市代码
      qu: '', //区县
      quCode: '', //区县代码
      wddz: '', //网点地址
      sfdj: '', //网点是否到件
      jmf: '', //加盟费
      bzj: '', //保证金
      wgf: '', //网络管理费
      xtsyf: '', //系统使用费
      zxbzj: '', //装修保证金
      zzzzbzj: '', //证照资质证保证金
      jjfbdm: '', //交接分拨代码      
      jjfbmc: '', //交接分拨名称
      wdzfbjl: '', //网点至分拨距离
      wdfcsj: '', //网点发车时间
      wddgsj: '', //网点到岗时间
      wdlgsj: '', //网点离岗时间
      ddwdsj: '', //到达网点时间
      ztyxsc: '', //在途运行时长
      yxfs: '', //运行方式
      cx: '', //车型
      fczq: '', //发车周期
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
    basicCommon.GetDBData_Sheng(this); //获取省级信息    
  },
  /*网点层级选中事件*/
  bindPickerChange_wdcj(e) {
    let wdcj = this.data.wdcj_array[e.detail.value];
    this.setData({
      'wdcj_index': e.detail.value,
      'formData.wdcj': wdcj,
      'sjwd_hidden':(wdcj=="二级")?false:true,
    });
  },
  /*省选中事件*/
  bindPickerChange_sheng(e) {
    let that = this;
    let sheng = that.data.sheng_array[e.detail.value];
    that.setData({
      'sheng_index': e.detail.value,
      'formData.sheng': sheng.name,
      'formData.shengCode': sheng.value,
      'cheng_index': 0
    });
    if (sheng.value == "0") {
      return; //未选择
    }
    //查找绑定城市级级选项
    basicCommon.GetDBData_Cheng(that, sheng.value); //获取市级信息
  },
  /*城市 选中事件*/
  bindPickerChange_cheng(e) {
    let cheng = this.data.cheng_array[e.detail.value];
    this.setData({
      'cheng_index': e.detail.value,
      'formData.cheng': cheng.name,
      'formData.chengCode': cheng.value,
    });
    if (cheng.value == "0") {
      return; //未选择
    }
    //查找绑定地区级级选项
    basicCommon.GetDBData_Qu(this, cheng.value); //获取地区
  },
  /*地区 选中事件*/
  bindPickerChange_qu(e) {
    let qu = this.data.qu_array[e.detail.value];
    if(qu !=null && qu != undefined){
      this.setData({
        'qu_index': e.detail.value,
        'formData.qu': qu.name,
        'formData.quCode': qu.value,
      });
    }    
  },
  /*运营方式 选中事件*/
  bindPickerChange_yxfs(e) {
    let yxfs = this.data.yxfs_array[e.detail.value];
    this.setData({
      'yxfs_index': e.detail.value,
      'formData.yxfs': yxfs,
    });
  },
  /*车型 选中事件*/
  bindPickerChange_cx(e) {
    let cx = this.data.cx_array[e.detail.value];
    this.setData({
      'cx_index': e.detail.value,
      'formData.cx': cx,
    });
  },
  /*获取页面 用户选择是否B网*/
  radio_sfBw(e) {
    this.setData({
      'formData.sfBw': e.detail.value,
      sfbw_hidden: (e.detail.value=="是")?false:true,
    });
  },
  /*获取页面 用户选择是否到件*/
  radio_sfdj(e) {
    this.setData({
      'formData.sfdj': e.detail.value
    });
  },
  /*获取页面 网点名称文本框的值*/
  input_wdmc(e) {
    this.setData({
      'formData.wdmc': e.detail.value
    });
  },
  /*获取页面 网点代码文本框的值*/
  input_wddm(e) {
    this.setData({
      'formData.wddm': e.detail.value
    });
  },
  /*获取页面 网点法人文本框的值*/
  input_wdfr(e) {
    this.setData({
      'formData.wdfr': e.detail.value
    });
  },
  /*获取页面 网点公司文本框的值*/
  input_wdgs(e) {
      this.setData({
        'formData.wdgs': e.detail.value
      });
    },
  /*获取页面 上级网点文本框的值*/
  input_sjwd(e) {
    this.setData({
      'formData.sjwd': e.detail.value
    });
  },
  /*获取页面 B网代码文本框的值*/
  input_Bwdm(e) {
    this.setData({
      'formData.Bwdm': e.detail.value
    });
  },
  /*获取页面 B网名称文本框的值*/
  input_Bwmc(e) {
    this.setData({
      'formData.Bwmc': e.detail.value
    });
  },
  /*获取页面 网点地址文本框的值*/
  input_wddz(e) {
    this.setData({
      'formData.wddz': e.detail.value
    });
  },
  /*获取页面 加盟费文本框的值*/
  input_jmf(e) {
    this.setData({
      'formData.jmf': e.detail.value
    });
  },
  /*获取页面 保证金文本框的值*/
  input_bzj(e) {
    this.setData({
      'formData.bzj': e.detail.value
    });
  },
  /*获取页面 网络管理费文本框的值*/
  input_wgf(e) {
    this.setData({
      'formData.wgf': e.detail.value
    });
  },
  /*获取页面 系统使用费文本框的值*/
  input_xtsyf(e) {
    this.setData({
      'formData.xtsyf': e.detail.value
    });
  },
  /*获取页面 装修保证金文本框的值*/
  input_zxbzj(e) {
    this.setData({
      'formData.zxbzj': e.detail.value
    });
  },
  /*获取页面 证照资质保证金文本框的值*/
  input_zzzzbzj(e) {
    this.setData({
      'formData.zzzzbzj': e.detail.value
    });
  },
  /*获取页面 交接分拨代码文本框的值*/
  input_jjfbdm(e) {
    this.setData({
      'formData.jjfbdm': e.detail.value
    });
  },
  /*获取页面 交接分拨名称文本框的值*/
  input_jjfbmc(e) {
    this.setData({
      'formData.jjfbmc': e.detail.value
    });
  },
  /*获取页面 网点至分拨距离文本框的值*/
  input_wdzfbjl(e) {
    this.setData({
      'formData.wdzfbjl': e.detail.value
    });
  },
  /*获取页面 在途运行时长文本框的值*/
  input_ztyxsc(e) {
    this.setData({
      'formData.ztyxsc': e.detail.value
    });
  },
  /*获取页面 在途运行时长文本框的值*/
  input_ztyxsc(e) {
    this.setData({
      'formData.ztyxsc': e.detail.value
    });
  },
  /*获取页面 在途运行时长文本框的值*/
  input_ztyxsc(e) {
    this.setData({
      'formData.ztyxsc': e.detail.value
    });
  },
  /*获取页面 发车周期文本框的值*/
  input_fczq(e) {
    this.setData({
      'formData.fczq': e.detail.value
    });
  },
  /*获取页面 申请原因文本框的值*/
  input_Reason(e) {
    this.setData({
      'formData.Reason': e.detail.value
    });
  },
  /*获取页面用户选择 网点发车时间的值*/
  timePicker_wdfcsj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    self.setData({
      'formData.wdfcsj': selectDate
    });
  },
  /*获取页面用户选择 网点到港时间的值*/
  timePicker_wddgsj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    self.setData({
      'formData.wddgsj': selectDate
    });
  },
  /*获取页面用户选择 网点离港时间的值*/
  timePicker_wdlgsj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    self.setData({
      'formData.wdlgsj': selectDate
    });
  },
  /*获取页面用户选择 到达网点时间的值*/
  timePicker_ddwdsj(e) {
    let self = this;
    var date = e.detail;
    var selectDate = util.padLeft(date[0], 2) + ":" + util.padLeft(date[1], 2);
    self.setData({
      'formData.ddwdsj': selectDate
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
  /*提交新开网点入网申请*/
  onSubmit(e) {
    let self = this;
    if (!self.data.isManySubmit) {
      return;
    } //防止多次点击重复提交
    if (util.strIsEmpty(self.data.formData.wdmc)) {
      self.setData({
        error: '请输入网点名称！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wdcj) || self.data.formData.wdcj == '请选择') {
      self.setData({
        error: '请选择网点层级'
      });
      return;
    } else if (self.data.formData.wdcj == '二级') {
      //如果网点层级选择为二级,则上级网店为必输入选项
      if(util.strIsEmpty(self.data.formData.sjwd)) {
        self.setData({
          error: '二级网点的上级网点位必输选项'
        });
        return;
      }
    }
    if (util.strIsEmpty(self.data.formData.wdfr)) {
      self.setData({
        error: '请输入网点法人！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wdgs)) {
      self.setData({
        error: '请输入网点公司！'
      });
      return;
    }    
    if (util.strIsEmpty(self.data.formData.sfBw)){
      self.setData({
        error: '请选择是否B网！'
      });
      return;
    }else if (self.data.formData.sfBw == '是'){
      if(util.strIsEmpty(self.data.formData.Bwdm)){
        self.setData({
          error: '请输入B网代码！'
        }); 
        return;
      }
      if(util.strIsEmpty(self.data.formData.Bwmc)) {
        self.setData({
          error: '请输入B网名称！'
        });
        return;
      }
    }
    if (util.strIsEmpty(self.data.formData.shengCode) 
      || self.data.formData.shengCode == '0' || util.strIsEmpty(self.data.formData.chengCode)
      ||util.strIsEmpty(self.data.formData.quCode)) {
      self.setData({
        error: '请选择 省/市/区 三个选项的地址！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wddz)) {
      self.setData({
        error: '请输入网点地址'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.sfdj)) {
      self.setData({
        error: '请选择网点是否到件！'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jmf)) {
      self.setData({
        error: '请输入加盟费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.bzj)) {
      self.setData({
        error: '请输入保证金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wgf)) {
      self.setData({
        error: '请输入实收网络管理费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.xtsyf)) {
      self.setData({
        error: '请输入系统使用费'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zxbzj)) {
      self.setData({
        error: '请输入装修保证金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.zzzzbzj)) {
      self.setData({
        error: '请输入证照资质保证金'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jjfbdm)) {
      self.setData({
        error: '请输入交接分拨代码'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jjfbmc)) {
      self.setData({
        error: '请输入交接分拨名称'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.jjfbmc)) {
      self.setData({
        error: '请输入网店至分拨距离'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wdfcsj)) {
      self.setData({
        error: '请选择网点发车时间'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wddgsj)) {
      self.setData({
        error: '请选择网点到港时间'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.wdlgsj)) {
      self.setData({
        error: '请选择网点离港时间'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.ddwdsj)) {
      self.setData({
        error: '请选择到达网点时间'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.ztyxsc)) {
      self.setData({
        error: '请输入在途运行时长'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.yxfs)||self.data.formData.yxfs=="请选择") {
      self.setData({
        error: '请选择运行方式'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.cx)||self.data.formData.cx=="请选择") {
      self.setData({
        error: '请选择车型'
      });
      return;
    }
    if (util.strIsEmpty(self.data.formData.fczq)) {
      self.setData({
        error: '请输入发车周期'
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
    var menuid = munePage.GetMenuCode("新开网点入网申请");
    if (Number(menuid) <= 0) {
      self.setData({
        error: '获取菜单ID异常！'
      });
      return;
    }
    let paramData = JSON.stringify({
      "_menuid": menuid,
      "_tablename": "form_fb_ruwangshenqing",
      // "_flowid": "4f52aeb7-1c2c-4e7c-96b6-28f575657884",
      "SubTitle": "FB-JYBB-",
      "PdepartmentName": self.data.formData.szfb, //所在分部
      "PdepartmentCode": self.data.formData.szfbbm, // 所在分部编码
      "Input_StationName": self.data.formData.wdmc, //网点名称
      "Input_StationCode": self.data.formData.wddm, //网点代码
      "Input_StationLevel": self.data.formData.wdcj, //网点层级
      "StationLegalPerson": self.data.formData.wdfr, //网点法人 
      "StationCompanyName": self.data.formData.wdgs, //网点公司
      'UpStationName':self.data.formData.sjwd, //上级网点
      'Input_IfTypeB':self.data.formData.sfBw, //是否B网
      'B_StationCode':self.data.formData.Bwdm, //B 网代码
      'B_StationName':self.data.formData.Bwmc, //B 网名称      
      'ProvinceText':self.data.formData.sheng, //省
      'Input_Sheng':self.data.formData.shengCode, //省代码
      'CityText':self.data.formData.cheng, //市
      'Input_Shi':self.data.formData.chengCode, //市代码
      'CountyText':self.data.formData.qu, //区县
      'Input_qu':self.data.formData.quCode, //区县代码
      'Input_Address':self.data.formData.wddz, //网点地址
      'Input_Ifdaojian':self.data.formData.sfdj, //网点是否到件
      'Input_jmfeeR':self.data.formData.jmf, //加盟费
      'Input_bzjfeeR':self.data.formData.bzj, //保证金
      'Input_wlglfeeR':self.data.formData.wgf, //网络管理费
      'Input_xtsyfeeR':self.data.formData.xtsyf, //系统使用费
      'Input_zxbzjfeeR':self.data.formData.zxbzj, //装修保证金
      'Input_zzzzbzjfeeR':self.data.formData.zzzzbzj, //证照资质证保证金
      'Input_ParentCode':self.data.formData.jjfbdm, //交接分拨代码
      'Input_ParentName':self.data.formData.jjfbmc, //交接分拨名称
      'Input_toParentDistance':self.data.formData.wdzfbjl, //网点至分拨距离
      'SSendTime':self.data.formData.wdfcsj, //网点发车时间
      'SArriveTime':self.data.formData.wddgsj, //网点到岗时间
      'PSendTime':self.data.formData.wdlgsj, //网点离岗时间
      'PArriveTime':self.data.formData.ddwdsj, //到达网点时间
      'CarRunTime':self.data.formData.ztyxsc, //在途运行时长
      'CarRunType':self.data.formData.yxfs, //运行方式
      'CarType':self.data.formData.cx, //车型
      'CarCycle':self.data.formData.fczq, //发车周期 
      "Remarks": self.data.formData.Reason, //申请原因
      "fileAttach": self.data.formData.fileAttach,
    });
    basicCommon.gotoSubmit(self,paramData);   
  }
})