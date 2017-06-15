var WIDTH = window.innerWidth;
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
if (urll.indexOf("?") == -1) {
  $("form").css("display", "none");
  $(".pic").css("display", "block");
  $(".pic div p:first").html("商户不存在！！")
}
var theRequest = new Object();
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
decorateBody(theRequest);
/*上传到服务器的编码规则----终*/
var obj = new Object()
var callback = function (k, v) {//回调函数，获取异步数据在全局使用
  obj[k] = v;
};
//图片转base64
function changeTo(img, file) {
  if (window.FileReader) {//chrome,firefox7+,opera,IE10,IE9，IE9也可以用滤镜来实现
    var oFReader = new FileReader();
    if (file.files[0] == undefined) {
      alert("您没有选择需要上传的照片，请重新上传！");
      file.previousSibling.innerHTML = "重新选择";
      img.src = "img/pic.png";
      img.nextSibling.nextSibling.innerHTML="上传中...";
      img.nextSibling.nextSibling.style.display="none";
      img.nextSibling.nextSibling.style.background="rgba(250,250,250,0.5)";
      img.nextSibling.style.height=80+"px";
    }
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
}
$('#alert button').on('click',function () {$('#alert').css('display','none');})
/*从服务器获取数据*/
$.ajax({
  type: 'POST',
  url: config.api + '/wo/getAuditResult',
  data: JSON.stringify(theRequest),
  dataType: 'json',
  beforeSend: function (xhr) {
    xhr.setRequestHeader("Content-Type", "application/json");
  },
  error: function () {
    $("form").css("display", "none");
    $(".pic").css("display", "block");
    $(".pic div p:first").html("请求超时,请重试！")
  },
  success: function (da) {
    var tal = da.data[0];
    var remak="";
    if(tal.remark){
      remak="原因："+tal.remark;
    }
    $('.remark').text(remak)
    $(".merchants-name").html(tal.merchant_name+"（mcode="+tal.mcode+"）");
    $(".num span").html(tal.results.length);
    var status=tal.status;
    var descri="";
    switch (status) {
      case 10:descri = "您的资料正在审核中，请耐心等待";break;
      case 11:descri = "您的资料正在审核中，请耐心等待";break;
      case 12:descri = "审核不通过，请核对后重新提交审核";break;
      case 21:descri = "恭喜您，您的资料已通过审核";break;
      case 0:descri = "您的资料已终止审核";break;
    }
    if (tal.paper_channel==2&&tal.results.length == 0&&status==12) {
      $('#submit button').attr('disabled',true);
      $('.num').html('请通过代理商平台重新提交资料。');
    }else if(tal.results.length == 0){
      $("form").css("display", "none");
      $(".pic").css("display", "block");
      $(".pic div p:first").html(descri)
      if (status == "11" ||status== "21") {
        $("form").css("display", "none");
        $(".msg").css("display", "block");
        $(".pic").css("display", "none");
        $(".msg div p").html(descri)
      }
    }
    for (var i = 0; i < tal.results.length; i++) {//动态生成页面元素
      var type = tal.results[i].type;
      var err = tal.results[i].errMsg!=""?"("+tal.results[i].errMsg+")":"";
      var key = tal.results[i].key;
      var title = tal.results[i].title;
      var val=tal.results[i].value;
      var options = tal.results[i].options;
     var row=tal.results[i].rows?tal.results[i].rows:"";
      var txt="此字段为必填",maxlength='',minlength='';
      if(tal.results[i].validator){
        if(tal.results[i].validator.maxLength){
          maxlength=tal.results[i].validator.maxLength;
        }
        if(tal.results[i].validator.minLength){
          minlength=!tal.results[i].validator.minLength?"1":tal.results[i].validator.minLength;
        }
        if(maxlength){
          txt="输入"+minlength+"~"+maxlength+"的字符数";
        }
      }
      if (type == "text"||type=="date"||type=="email") {
        $("<div class='form-group'>" +
          "<label>" + title + "：<span>" + err + "</span></label>" +
          "<div class='row'>" +
          "<input class='form-control col-xs-12 col-sm-9' type='"+type+"' name='" + key + "' required maxlength='"+maxlength+"' minlength='"+minlength+"' min='"+minlength+"' value='" + val + "'/>" +
            "<p class='col-xs-12 col-sm-3'><b>*</b><span>"+txt+"</span></p></div>"+
          "</div>").insertAfter($(".num"));
        var inputlist=$("#submit input");
        for(var j=0;j<inputlist.length;j++){
          inputlist[j].onblur=function () {
            var invalue=this.value;
            if(this.validity.tooLong||this.validity.tooShort||invalue.length<this.min){
              this.nextElementSibling.firstChild.innerHTML="×";
              this.nextElementSibling.firstChild.style.color="red";
              this.nextElementSibling.lastChild.style.color="red";
              this.nextElementSibling.lastChild.innerHTML=this.validationMessage;
            }else if(this.validity.valueMissing){
              this.nextElementSibling.firstChild.innerHTML="×";
              this.nextElementSibling.firstChild.style.color="red";
              this.nextElementSibling.lastChild.style.color="red";
              this.nextElementSibling.lastChild.innerHTML=this.validationMessage;
              this.focus();
            }
            else {
              this.nextElementSibling.firstChild.innerHTML="√";
              this.nextElementSibling.firstChild.style.color="green";
              this.nextElementSibling.lastChild.style.color="green";
              this.nextElementSibling.lastChild.innerHTML="输入正确";
            }
          }
        }
      } else if (type == "img") {
        $(".file").append(
          $("<form action=" + config.api + "/file/uploadFileToWangposPrivacy method='post' enctype='multipart/form-data' class='fileTu'>" +
            "<div class='form-group left'>" +
            "<label>" + title + "：<br><span>" + err + "</span></label><br>" +
            "<label class='btn btn-info' for='" + key + "'>上传照片</label>" +
            "<input type='file' accept='image/*' name='" + key + "' id='" + key + "' style='opacity: 0;width: 100px;height:0px'>" +
            "<input type='text' name='file_name' required style='display: none'>" +
            "</div>" +
            "<span class='right'><img src='img/pic.png' class='img-responsive'><div></div><p>上传中...</p></span>" +
            "</form>"
          ));
      } else if (type == "select") {
        var str = "<div class='form-group'>" +
          "<label>" + title + "：<span>(" + err + ")</span></label><br>" +
          "<select name='" + key + "' class='form-control col-xs-12 col-sm-9'>";
        for (var c = 0; c < options.length; c++) {
          str += "<option value='"+options[c].key+"'>"+options[c].value+"</option>";
        };
        $("#submit").append(str+"</select></div>");
        if(val){
          var sel_option=$("#submit select option");
          for(var op=0;op<sel_option.length;op++){
            if(sel_option[op].value==val)sel_option[op].selected=true;
          }
        }else {$("#submit select[name='"+key+"'] option")[0].attribute('selected',true);};
      }else if(type='textarea'){
        $("<div class='form-group'>" +
          "<label>" + title + "：<span>" + err + "</span></label>" +
          "<div class='row'>" +
          "<textarea class='form-control col-xs-12 col-sm-9' rows='"+row+"' name='" + key + "' required maxlength='"+maxlength+"' minlength='"+minlength+"' min='"+minlength+"'>"+val+"</textarea>"+
          "<p class='col-xs-12 col-sm-3'><b>*</b><span>"+txt+"</span></p></div>"+
          "</div>").insertAfter($(".num"));
        var textareaL=$("#submit textarea");
        for(var i=0;i<textareaL.length;i++){
          textareaL[i].onblur=function () {
            if(this.validity.valid){
              this.nextElementSibling.firstChild.innerHTML="√";
              this.nextElementSibling.firstChild.style.color="green";
              this.nextElementSibling.lastChild.style.color="green";
              this.nextElementSibling.lastChild.innerHTML="输入正确";
            }else {
              this.nextElementSibling.firstChild.innerHTML="×";
              this.nextElementSibling.firstChild.style.color="red";
              this.nextElementSibling.lastChild.style.color="red";
              this.nextElementSibling.lastChild.innerHTML=this.validationMessage;
              this.focus();
            }
          }
        }
      }
    }
    /*异步提交文件---jqueryForm*/
    $('input[type="file"]').on("change", function () {
      var parents = $(this).parent().parent();
      var label = $(this.previousSibling);
      var img = parents[0].lastChild.firstChild;
      var div = img.nextSibling;
      var p = parents[0].lastChild.lastChild;
      var filename = this.name;
      var height = $(div).height();
      var fileval = $(this).val();
      var file_name_input = $(this).next();
      var me=this;
      var reader = new FileReader();
      var files = Array.prototype.slice.call(this.files);
      var resimg = new Image();
      files.forEach(function (file, i) {
        if (!/\/(?:jpeg|png)/i.test(file.type)){
          $('#alert').css('display','block');
          $('#alert .modal-body').html('图片格式只能为jpeg和png，请重新选择');
          fileval='';
          $(me).val('');
          img.src = "img/pic.png";
          p.style.display = "none";
        };
        if(file.size/1024 >3072){
          $('#alert').css('display','block');
          $('#alert .modal-body').html('图片不能大于3M，请重新选择');
          fileval='';
          $(me).val('');
          img.src = "img/pic.png";
          p.style.display = "none";
        };
        reader.readAsDataURL(file);
        reader.onload = function () {
          var result = this.result;
          resimg.src = result;
          var width = resimg.width;
          var height = resimg.height;
          if(width>5000||height>5000){
            $('#alert').css('display','block');
            $('#alert .modal-body').html('图片尺寸不能大于5000像素，请重新选择');
            $(me).val('');
          }
          if(width<5000&&height<5000){
            if (fileval) {
              label.removeClass('btn-info');
              label.attr('disabled', true);
              div.style.display = "block";
              var sum = parseInt(Math.random() * 11 + 10);
              var loop = setInterval(function () {
                height--;
                $(div).css("height", height + "px");
                p.style.display = "block";
                if (height == sum) {
                  clearInterval(loop)
                }
              }, 100);
              if (label.html() == "更换照片" || label.html() == "重新上传") {
                img.src = "img/pic.png";
                p.innerHTML = "上传中...";
                div.style.display = "block";
                height = 80;
              }
              parents.ajaxSubmit({
                success: function (data) {
                  if(JSON.parse(data).code==0){
                    var file = JSON.parse(data).data;
                    label.addClass('btn-info');
                    label.html("更换照片");
                    label.removeAttr('disabled');
                    label.css('border', "2px solid transparent");
                    callback(filename, file[0].fileKey);
                    changeTo(img, me);
                    $(div).animate({"height": 0}, 500, function () {
                      p.innerHTML = "上传成功";
                      p.style.background="rgba(124,212,59,0.5)";
                      div.style.display = "none";
                    });
                    $(me).val('');
                    file_name_input.val(file[0].fileKey);
                  }else {
                    label.addClass('btn-info');
                    label.html("重新上传");
                    label.removeAttr('disabled');
                    label.css('border', "2px solid transparent");
                    p.innerHTML = "上传失败";
                    div.style.display = "none";
                    img.src = "img/pic.png";
                    $(me).val('');
                    file_name_input.val('');
                  }
                },
                error: function () {
                  label.addClass('btn-info');
                  label.html("重新上传");
                  label.removeAttr('disabled');
                  label.css('border', "2px solid transparent");
                  p.innerHTML = "上传失败";
                  div.style.display = "none";
                  img.src = "img/pic.png";
                  $(me).val('');
                  file_name_input.val('');
                }
              })
            }
          }
        };
      });
      var labbtn = $('.file label[disabled="disabled"]').length;
      if (labbtn > 3) {
        $('#alert').css('display','block');
        $('#alert .modal-body').html('支持4张同时上传，谢谢合作！');
      };
    });
    /*图片放大还原*/
    function img480(t) {
      if (($(t).width() > 200) || (t.src.indexOf("img/pic.png") != -1)) {
        $(t).parent().removeClass("zindex");
        $(t).height("80");
        $(t).width("80");
        (t.src.indexOf("img/pic.png") != -1)?$(t).next().next().css("display", "none"):$(t).next().next().css("display", "block");
      } else {
        $(t).parent().addClass("zindex");
        WIDTH > 480 ? $(t).height(WIDTH / 2) : $(t).height(WIDTH);
        WIDTH > 480 ? $(t).width(WIDTH / 2) : $(t).width(WIDTH);
        $(t).next().next().css("display", "none");
      }
    }
    if (WIDTH <= 480) {
      $("form img").on("click", function () {
        img480(this)
      })
    } else {
      $("form img").on("click", function () {
        img480(this)
      })
    }
  },
  complete: function () {
  }
})

var request = new Object();
$('#submit .btn').click(function () {
  var input = $("#submit input");//text表单验证
  if (input.length != 0) {
    for (var i = 0; i < input.length; i++) {
      var inval=input[i].value;
      if (input[i].validity.valid==false) {
        input[i].focus();
        return false;
      }
      obj[input[i].name] = $.trim(input[i].value);
    }
  }
  var textarea=$("#submit textarea");//textarea验证
  if(textarea.length){
    for(var i=0;i<textarea.length;i++){
      if(textarea[i].validity.valid==false){
        textarea[i].focus();
        return false;
      }
      obj[textarea[i].name] = $.trim(textarea[i].value) ;
    }
  }
  var inputFile = $('.fileTu input');//file表单验证
  if (inputFile.length != 0) {
    for (var k = 0; k < inputFile.length; k++) {
      if (inputFile[k].validity.valid==false) {
        inputFile[k].previousSibling.previousSibling.style.border = "2px solid red";
        return false;
      }
    }
  }
  //arrobj = Object.assign($('#submit').serializeObject(),obj1);//ECM6
  request.paper = obj;
  decorateBody(request);
  $.ajax({
    type: 'POST',
    url: config.api + '/wo/reSubmitMerchantInfo',
    data:JSON.stringify(request),
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    },
    error: function () {
      $("form").css("display", "none");
      $(".pic").css("display", "block");
    },
    success: function (data) {
      var txt = data.msg;
      if (data.code == "0") {
        $(".msg p").html("资料已提交，请等待审核结果");
        $("form").css("display", "none");
        $(".msg").css("display", "block");
      } else {
        $(".pic div p:first").html(txt);
        $("form").css("display", "none");
        $(".pic").css("display", "block");
      }
    }
  })
});
