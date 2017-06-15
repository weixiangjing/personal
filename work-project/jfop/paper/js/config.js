var config={
  appId:'576d55169033a826dcd4675a',
  appSec:'3db37a59b12e47429e2a2a250b61797e',
  api:'/api',
  useMerchantCheck: false
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
/*图片处理*/
function changeTo(img, file) {
  if (window.FileReader) {//chrome,firefox7+,opera,IE10,IE9，IE9也可以用滤镜来实现
    var oFReader = new FileReader();
    oFReader.readAsDataURL(file.files[0]);
    oFReader.onload = function (oFREvent) {
      img.src = oFREvent.target.result;
    };
  }
  else if (document.all) {//IE8-
    file.select();
    var reallocalpath = document.selection.createRange().text//IE下获取实际的本地文件路径
    if (window.ie6) img.src = reallocalpath; //IE6浏览器设置img的src为本地路径可以直接显示图片
    else { //非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现，IE10浏览器不支持滤镜，需要用FileReader来实现，所以注意判断FileReader先
      img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';//设置img的src为base64编码的透明图片，要不会显示红xx
    }
  }
  else if (file.files) {//firefox6-
    if (file.files.item(0)) {
      var url = file.files.item(0).getAsDataURL();
      img.src = url;
    }
  }
}//img--base64
function changeUrl(img, file) {
  if (window.FileReader) {//chrome,firefox7+,opera,IE10,IE9，IE9也可以用滤镜来实现
    var oFReader = new FileReader();
    oFReader.readAsDataURL(file.files[0]);
    oFReader.onload = function (oFREvent) {
      img.style.backgroundImage ='url(' +oFREvent.target.result+')';
       img.src=oFREvent.target.result;
    };
  }
  else if (document.all) {//IE8-
    file.select();
    var reallocalpath = document.selection.createRange().text//IE下获取实际的本地文件路径
    if (window.ie6) img.style.backgroundImage ='url('+ reallocalpath+')'; //IE6浏览器设置img的src为本地路径可以直接显示图片
    else { //非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现，IE10浏览器不支持滤镜，需要用FileReader来实现，所以注意判断FileReader先
      img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
      img.style.backgroundImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';//设置img的src为base64编码的透明图片，要不会显示红xx
      img.src=img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';;
    }
  }
  else if (file.files) {//firefox6-
    if (file.files.item(0)) {
      var url = file.files.item(0).getAsDataURL();
      img.style.backgroundImage ='url('+ url+')';
      img.src = url;
    }
  }
}//backgraund---base64
var push=20;
function scrollFunc(e){
  e=e || window.event;
  var width=parseFloat(this.style.width);
  var height=parseFloat(this.style.height);
  if(e.wheelDelta){//IE/Opera/Chrome
    if(e.wheelDelta>0&&width<800){
      this.style.width=width+push+'px';
      this.style.height=height+push+'px';
    }
    if(e.wheelDelta<0&&width>200){
      this.style.width=width-push+'px';
      this.style.height=height-push+'px';
    }
  }else if(e.detail){//Firefox
    if(e.detail>0&&width<800){
      this.style.width=width+push+'px';
      this.style.height=height+push+'px';
    }
    if(e.detail<0&&width>200){
      this.style.width=width-push+'px';
      this.style.height=height-push+'px';
    }
  }
}
function isEmptyObject(e) {
  for (var t in e)
    return !1;
  return !0
}
Array.prototype.unique = function(){
  var res = [];
  var json = {};
  for(var i = 0; i < this.length; i++){
    if(!json[this[i]]){
      res.push(this[i]);
      json[this[i]] = 1;
    }
  }
  return res;
}
var Sys =new Object();
var explorer = window.navigator.userAgent.toLowerCase() ;
if (explorer.indexOf("msie") >= 0) {Sys.liulan="ie";}
else if (explorer.indexOf("firefox") >= 0) {Sys.liulan="firefox";}
else if(explorer.indexOf("chrome") >= 0){Sys.liulan="chrome";}
else if(explorer.indexOf("opera") >= 0){Sys.liulan="opera";}
else if(explorer.indexOf("safari") >= 0){Sys.liulan="safari";}
function try_loca() {
  try {
    localStorage.setItem('lastname',1);
    localStorage.removeItem('lastname');
    return true;
  } catch (e) {
    return false;
  };
};
var local_try=try_loca();//判断浏览器是否启用local
