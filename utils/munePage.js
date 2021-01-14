var app = getApp();
var util = require("../utils/util.js");

function CWGL_List() { //财务管理
  var MuneAny = app.globalData.userInfo.MenuList;
  var _listService = [{
      name: '借支申请',
      url: '/pages/afrom/cwgl_jzsq/af_jzsq?Type=jzsq',
      icon: '/utils/icon/image/components.png',
      code: '254',
      disabled: !util.isInArray(MuneAny, Number('254'))
    }, {
      name: '坏账申请报账单',
      url: '/pages/afrom/cwgl_hzsq/af_hzsq',
      icon: '/utils/icon/image/components.png',
      code: '255',
      disabled: !util.isInArray(MuneAny, Number('255'))
    },
    {
      name: '退款申请报账单',
      url: '/pages/afrom/cwgl_tksq/af_tksq',
      icon: '/utils/icon/image/components.png',
      code: '256',
      disabled: !util.isInArray(MuneAny, Number('256'))
    }, {
      name: '日常费用类报账单',
      url: '/pages/afrom/cwgl_rcfy/af_rcfy',
      icon: '/utils/icon/image/components.png',
      code: '257',
      disabled: !util.isInArray(MuneAny, Number('257'))
    }, {
      name: '专项报账单',
      url: '/pages/afrom/cwgl_zxbzd/af_zxbzd',
      icon: '/utils/icon/image/components.png',
      code: '258',
      disabled: !util.isInArray(MuneAny, Number('258'))
    }, {
      name: '提现申请单',
      url: '/pages/afrom/cwgl_txsqd/af_txsqd',
      icon: '/utils/icon/image/components.png',
      code: '260',
      disabled: !util.isInArray(MuneAny, Number('260'))
    }, {
      name: '保证金申请报账单',
      url: '/pages/afrom/cwgl_bzjsqbzd/af_bzjsqbzd',
      icon: '/utils/icon/image/components.png',
      code: '263',
      disabled: !util.isInArray(MuneAny, Number('263'))
    }, {
      name: '经营类费用报账单',
      url: '/pages/afrom/cwgl_jylfybzd/af_jylfybzd',
      icon: '/utils/icon/image/components.png',
      code: '261',
      disabled: !util.isInArray(MuneAny, Number('261'))
    }, {
      name: '项目客户费用报账单',
      url: '/pages/afrom/cwgl_xmkhfybzd/af_xmkhfybzd',
      icon: '/utils/icon/image/components.png',
      code: '262',
      disabled: !util.isInArray(MuneAny, Number('262'))
    }, {
      name: '场地费用报账单',
      url: '/pages/afrom/cwgl_cdfybzd/af_cdfybzd',
      icon: '/utils/icon/image/components.png',
      code: '264',
      disabled: !util.isInArray(MuneAny, Number('264'))
    }, {
      name: '场地预付款报账单',
      url: '/pages/afrom/cwgl_cdyfkbzd/af_cdyfkbzd',
      icon: '/utils/icon/image/components.png',
      code: '265',
      disabled: !util.isInArray(MuneAny, Number('265'))
    }, {
      name: '采购业务报账单',
      url: '/pages/afrom/cwgl_cgywbzd/af_cgywbzd',
      icon: '/utils/icon/image/components.png',
      code: '266',
      disabled: !util.isInArray(MuneAny, Number('266'))
    }, {
      name: '采购预付款报账单',
      url: '/pages/afrom/cwgl_cgyfkbzd/af_cgyfkbzd',
      icon: '/utils/icon/image/components.png',
      code: '267',
      disabled: !util.isInArray(MuneAny, Number('267'))
    }
  ];
  return _listService;
}

function jYBB_List() { //经营本部的流程
  var MuneAny = app.globalData.userInfo.MenuList;
  var _listService = [{
      name: '新开网点费用备案',
      url: '/pages/afrom/jybb_fyba/af_fyba',
      icon: '/utils/icon/image/components.png',
      code: '242',
      disabled: !util.isInArray(MuneAny, Number('242'))
    }, {
      name: '新开网点入网申请',
      url: '/pages/afrom/jybb_rwsq/af_rwsq',
      icon: '/utils/icon/image/components.png',
      code: '243',
      disabled: !util.isInArray(MuneAny, Number('243'))
    },
    {
      name: '网点信息修改申请',
      url: '/pages/afrom/jybb_xgsq/af_xgsq',
      icon: '/utils/icon/image/components.png',
      code: '244',
      disabled: !util.isInArray(MuneAny, Number('244'))
    }, {
      name: '特殊政策申请',
      url: '/pages/afrom/jybb_zcsq/af_zcsq',
      icon: '/utils/icon/image/components.png',
      code: '245',
      disabled: !util.isInArray(MuneAny, Number('245'))
    }, {
      name: '加盟合同签订盖章申请',
      url: '/pages/afrom/jybb_gzsq/af_gzsq',
      icon: '/utils/icon/image/components.png',
      code: '246',
      disabled: !util.isInArray(MuneAny, Number('246'))
    }, {
      name: '退网申请',
      url: '/pages/afrom/jybb_twsq/af_twsq',
      icon: '/utils/icon/image/components.png',
      code: '247',
      disabled: !util.isInArray(MuneAny, Number('247'))
    }, {
      name: '价格配置申请',
      url: '/pages/afrom/jybb_pzsq/af_pzsq',
      icon: '/utils/icon/image/components.png',
      code: '248',
      disabled: !util.isInArray(MuneAny, Number('248'))
    }, {
      name: '网络招商会申请',
      url: '/pages/afrom/jybb_shsq/af_shsq',
      icon: '/utils/icon/image/components.png',
      code: '249',
      disabled: !util.isInArray(MuneAny, Number('249'))
    }, {
      name: '加盟网点证照/装修验收申请',
      url: '/pages/afrom/jybb_yssq/af_yssq',
      icon: '/utils/icon/image/components.png',
      code: '250',
      disabled: !util.isInArray(MuneAny, Number('250'))
    }, {
      name: '电商订单违规操作考核网点申诉',
      url: '/pages/afrom/jybb_wdss/af_wdss',
      icon: '/utils/icon/image/components.png',
      code: '251',
      disabled: !util.isInArray(MuneAny, Number('251'))
    }, {
      name: '网点交接件时间维护申请',
      url: '/pages/afrom/jybb_wdjjjsjwhsq/af_wdjjjsjwhsq',
      icon: '/utils/icon/image/components.png',
      code: '272',
      disabled: !util.isInArray(MuneAny, Number('272'))
    }, {
      name: '网点转让申请流程',
      url: '/pages/afrom/jybb_wdzrsqlc/af_wdzrsqlc',
      icon: '/utils/icon/image/components.png',
      code: '273',
      disabled: !util.isInArray(MuneAny, Number('273'))
    }, {
      name: '退网减免流程',
      url: '/pages/afrom/jybb_twjmlc/af_twjmlc',
      icon: '/utils/icon/image/components.png',
      code: '274',
      disabled: !util.isInArray(MuneAny, Number('274'))
    }, {
      name: '特殊货品报备',
      url: '/pages/afrom/jybb_tshpbb/af_tshpbb',
      icon: '/utils/icon/image/components.png',
      code: '278',
      disabled: !util.isInArray(MuneAny, Number('278'))
    }
  ];
  return _listService;
}

function RSLC_List() { //人事流程
  var MuneAny = app.globalData.userInfo.MenuList;
  var _listService = [{
    name: '请假申请',
    url: '/pages/afrom/af_qj/afrom',
    icon: '/utils/icon/image/leave.png',
    code: '93',
    disabled: !util.isInArray(MuneAny, Number('93'))
  }, {
    name: '调休单',
    url: '/pages/afrom/rlzy_txd/af_txd',
    icon: '/utils/icon/image/timeoff.png',
    code: '94',
    disabled: !util.isInArray(MuneAny, Number('94'))
  }, {
    name: '加班申请',
    url: '/pages/afrom/rlzy_jbd/af_jbd',
    icon: '/utils/icon/image/overtime.png',
    code: '98',
    disabled: !util.isInArray(MuneAny, Number('98'))
  }, {
    name: '补打卡',
    url: '/pages/afrom/rlzy_bdk/af_bdk',
    icon: '/utils/icon/image/attendance.png',
    code: '259',
    disabled: !util.isInArray(MuneAny, Number('259'))
  }];
  return _listService;
}

function XZLC_List() { //行政流程
  var MuneAny = app.globalData.userInfo.MenuList;
  var _listService = [{
    name: '用印（资质）申请',
    url: '/pages/afrom/af_yy/afrom',
    icon: '/utils/icon/image/sealapply.png',
    code: '4',
    disabled: !util.isInArray(MuneAny, Number('4'))
  }, {
    name: '出差申请',
    url: '/pages/afrom/rlzy_ccsq/af_ccsq',
    icon: '/utils/icon/image/business.png',
    code: '16',
    disabled: !util.isInArray(MuneAny, Number('16'))
  }];
  return _listService;
}

function YYBB_List() { //运营本部流程
  var MuneAny = app.globalData.userInfo.MenuList;
  var _listService = [{
    name: '线路需求申请',
    url: '/pages/afrom/yybb_xlxqsq/af_xlxqsq',
    icon: '/utils/icon/image/components.png',
    code: '275',
    disabled: !util.isInArray(MuneAny, Number('275'))
  }, {
    name: '线路落地申请',
    url: '/pages/afrom/yybb_xlldsq/af_xlldsq',
    icon: '/utils/icon/image/components.png',
    code: '276',
    disabled: !util.isInArray(MuneAny, Number('276'))
  }, {
    name: '路由维护申请',
    url: '/pages/afrom/yybb_lywhsq/af_lywhsq',
    icon: '/utils/icon/image/components.png',
    code: '282',
    disabled: !util.isInArray(MuneAny, Number('282'))
  }, {
    name: '线路分摊比例维护申请',
    url: '/pages/afrom/yybb_xlftblwhsq/af_xlftblwhsq',
    icon: '/utils/icon/image/components.png',
    code: '283',
    disabled: !util.isInArray(MuneAny, Number('283'))
  }];
  return _listService;
}

function GetMenuCode(menuName) { //根据菜单名称获取菜单Code 即菜单Id
  var MenuSumCountList = CWGL_List().concat(jYBB_List()).concat(RSLC_List()).concat(XZLC_List()).concat(YYBB_List());
  var MenuId = '0';
  try
  {
    MenuSumCountList.forEach(element => {
      if (element.name == menuName) {
        MenuId = element.code;
        throw new Error;//终止循环
      }
    });
  }catch(e){
    return MenuId;
  }
  return MenuId;
}

/*---------------------------------调用声明底线---------------------------------*/
module.exports.CWGL_List = CWGL_List; //财务管理
module.exports.jYBB_List = jYBB_List; //经营本部
module.exports.RSLC_List = RSLC_List; //人事流程
module.exports.XZLC_List = XZLC_List; //行政流程
module.exports.YYBB_List = YYBB_List; //运营本部
module.exports.GetMenuCode = GetMenuCode; //根据菜单名称获取菜单Code 即菜单Id