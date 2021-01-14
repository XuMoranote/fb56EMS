function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function date_time(val) {
  var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
  //月份为0-11，所以+1，月份小于10时补个0
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  //var theTime = date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + minute + ":" + second;  
  var theTime = date.getFullYear() + "年" + month + "月" + currentDate + "日";
  return theTime;
}
function subTen(value) {
  return value < 10 ? ('0' + value) : value;
}
//判断字符是否是空
function strIsEmpty(str) {
  if (str != null && str.length != 0) {
    return false
  } else {
    return true
  }
}
//判断 a时间是否大于b时间
function atimeDbtime(atime, btime) {
  var aTime = Date.parse(new Date(atime.replace('年', '/').replace('月', '/').replace('日', '/')));
  var bTime = Date.parse(new Date(btime.replace('年', '/').replace('月', '/').replace('日', '/')));
  if (aTime >= bTime) {
    return true;
  }
  return false;
}
/* 给 指定位数 左边补0 */
function padLeft(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}
/* 费用金额转换大写 */
function ZHMoney(num) {
  if (isNaN(num)) return "";
  var strPrefix = "";
  if (num < 0) strPrefix = "(负)";
  num = Math.abs(num);
  if (num >= 1000000000000) return "无效数值！";
  var strOutput = "";
  var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
  var strCapDgt = '零壹贰叁肆伍陆柒捌玖';
  num += "00";
  var intPos = num.indexOf('.');
  if (intPos >= 0) {
      num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
  }
  strUnit = strUnit.substr(strUnit.length - num.length);
  for (var i = 0; i < num.length; i++) {
      strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
  }
  return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
}; 
/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr,value){
  if(arr == null || arr == undefined || arr == ''){
    return false;
  }
  for(var i = 0; i < arr.length; i++){
      if(value === arr[i]){
          return true;
      }
  }
  return false;
}

module.exports = {
  formatTime: formatTime,
  date_time: date_time,
  subTen: subTen,
  strIsEmpty: strIsEmpty,
  atimeDbtime: atimeDbtime,
  padLeft:padLeft,
  ZHMoney:ZHMoney,
  isInArray:isInArray
}