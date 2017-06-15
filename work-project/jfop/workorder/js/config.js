var config={
  appId:'576d55169033a826dcd4675a',
  appSec:'3db37a59b12e47429e2a2a250b61797e',
  api:'/api'
}
/*上传到服务器的编码规则----起*/
function decorateBody(body) {
  body.appId = config.appId;
  var date = new Date();
  var dateYear = date.getFullYear(date);
  var dateMonth = date.getMonth(date) + 1;
  var dateDate = date.getDate(date);
  var dateHours = date.getHours(date);
  var dateMinutes = date.getMinutes(date);
  var dateSeconds = date.getSeconds(date);
  dateMonth = dateMonth < 10 ? "0" + dateMonth : dateMonth;
  dateDate = dateDate < 10 ? "0" + dateDate : dateDate;
  dateHours = dateHours < 10 ? "0" + dateHours : dateHours;
  dateMinutes = dateMinutes < 10 ? "0" + dateMinutes : dateMinutes;
  dateSeconds = dateSeconds < 10 ? "0" + dateSeconds : dateSeconds;
  body.submitTime = dateYear + "-" + dateMonth + "-" + dateDate + " " + dateHours + ":" + dateMinutes + ":" + dateSeconds;
  sign(body);
  txturl(body);
  return body;
}
function sign(body) {
  var keys = Object.keys(body).sort();
  var params = [];
  keys.forEach(function (key) {
    params.push(key + body[key]);
  });
  var appSec = config.appSec;
  body.sign = $.md5(appSec + params.join('') + appSec);
}
var urll = location.search; //获取url中"?"符后的字串
function txturl(obj) {
  if (urll.indexOf("?") != -1) {
    var str = urll.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      obj[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
    return obj;
  }
}

/*上传到服务器的编码规则----终*/
function interval(startDate, endDate){
  var d1 = new Date(startDate.replace(/-/g, "/"));
  var d2 = new Date(endDate.replace(/-/g, "/"));
  var haoms = d2.getTime() - d1.getTime();
  return haoms;
}
function dateTime(haoms,str1,str2) {
  var str=haoms==0?"":haoms/1000<60?str1+"<1分钟"+str2:haoms/1000/60<60
    ?(str1+parseInt(haoms/1000/60)+"分钟"+Math.ceil((haoms/1000/60-parseInt(haoms/1000/60))*60)+"秒"+str2):
    haoms/1000/60/60<24?str1+parseInt(haoms/1000/60/60)+"小时"+Math.ceil((haoms/1000/60/60-parseInt(haoms/1000/60/60))*60)+"分钟"+str2:
      haoms/1000/60/60/24<=31?str1+parseInt(haoms/1000/60/60/24)+"天"+Math.ceil((haoms/1000/60/60/24-parseInt(haoms/1000/60/60/24))*24)+"小时"+str2:
      str1+parseInt(haoms/1000/60/60/24/30)+"月"+Math.ceil((haoms/1000/60/60/24/30-parseInt(haoms/1000/60/60/24/30))*30)+"天"+str2;
  return str;
}
function isEmptyObject(e) {
  for (var t in e)
    return !1;
  return !0
}
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
function try_loca() {
  try {
    sessionStorage.setItem('lastname',1);
    sessionStorage.removeItem('lastname');
    return true;
  } catch (e) {
    return false;
  };
};
var local_try=try_loca();//判断浏览器是否启用local
