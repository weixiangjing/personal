var maxWIDTH = window.innerWidth;
function addInput(grouK,rootT,keys,paper) {
  $("<ul class='Input'></ul>").insertAfter($("#"+grouK+" h4"));
  var imgtr = "<ul class='img-li'>" +
    "<p><span>上传图片要求：</span> <br> 文件格式为jpg、png，图片长宽均不能超过5000像素，文件大小不超过3M</p>"+
    "</ul>";
  var imgs=[],imgT=[],value='',href='',txT=[],readonly='',row='';
  if(paper){
    var accessToken=paper.accessToken;
    var rootUrl=paper.rootUrl;
  }
  for (var j = 0; j < keys.length; j++) {
    for (var k = 0; k < rootT.length; k++) {
      if (keys[j] == rootT[k].key) {
        var placeholder=rootT[k].description==undefined?"":rootT[k].description;
          var title = rootT[k].title;
          var max,min;
          var required="",xingxing="",fileE="",txturl='',txthref='',mob_href='';
          if(rootT[k].validator&&rootT[k].validator.maxLength){
            max =rootT[k].validator.maxLength;
          }else {max=""}
          if(rootT[k].validator&& rootT[k].validator.minLength){
             min =rootT[k].validator.minLength;
          }else {min=""}
          if(rootT[k].validator&&(rootT[k].validator.required==true)){
             required="required";
            xingxing="*";
          }else {required="";xingxing="";}
          fileE=rootT[k].fileExt==undefined?"":rootT[k].fileExt.join(' ');
        if(paper){
        for(var key in paper.paper){
          if(key==keys[j]){
            value=paper.paper[key];
            if(paper.paper[key]){value=paper.paper[key]}else {value=''};
            if(value){
              href="<a href='"+rootUrl+value+"?accessToken="+accessToken+"' target='_blank'>已上传可查看</a>";
            }else {value=''}
          }else if(paper.paper[keys[j]]==undefined){value="";}
        }
        }else {value=''}
        if(rootT[k].defaultValue){value=rootT[k].defaultValue}
        if(rootT[k].readOnly){readonly='readonly'}else {readonly=''}
        if(rootT[k].guide_url){
          if(rootT[k].guide_url&&rootT[k].guide_title){txturl=rootT[k].guide_title;}
          else if(rootT[k].guide_url){txturl="<img src='img/question.png'>"}
          mob_href="<a href='' class='iframeA'><div class='alian'><iframe src='' frameborder='0' width='100%' height='100%' style='height: 100%'></iframe></div>"+txturl+"</a><b class='colseI'>关闭</b><sapn style='display: none'>"+rootT[k].guide_url+"</sapn>";
          txthref="<a href='"+rootT[k].guide_url+"' target='_blank' class='pc_a'>"+txturl+"</a>";
        }else {txthref='';mob_href=''};
        if(rootT[k].rows){row=rootT[k].rows;}else {row=4};
        if (rootT[k].type == "text"||rootT[k].type == "email"||rootT[k].type == "group"){
            $("#"+grouK+" .Input").append($("<li class='form-group'>" +
              "<label for='"+keys[j]+"' class='col-xs-12 col-sm-3 control-label'><span>"+xingxing+"</span>"+title+"<i class='right'>"+mob_href+"</i></label>"+
              "<input class='form-control col-xs-12 col-sm-5' value='"+value+"' type='"+rootT[k].type+"' id='"+keys[j]+"' name='" + keys[j] + "' placeholder='" +placeholder + "' maxlength='" + max + "' minlength='" + min + "'"+ required+" "+readonly+">" +
            ""+txthref+"<p class='Verr'></p></li>"))
          }
        if(rootT[k].type == "date"){
          if(maxWIDTH<768){
            $("#"+grouK+" .Input").append($("<li class='form-group'>" +
              "<label for='"+keys[j]+"' class='col-xs-12 col-sm-3 control-label'><span>"+xingxing+"</span>"+title+"<i class='right'>"+mob_href+"</i></label>"+
              "<input class='form-control col-xs-12 col-sm-5' value='"+value+"' type='date' id='"+keys[j]+"' name='" + keys[j] + "' placeholder='" +placeholder + "' maxlength='" + max + "' minlength='" + min + "'"+ required+" "+readonly+">" +
              ""+txthref+"<p class='Verr clear'></p></li>"))
          }else {
            $("#"+grouK+" .Input").append($("<li class='form-group'>" +
              "<label for='"+keys[j]+"' class='col-xs-12 col-sm-3 control-label'><span>"+xingxing+"</span>"+title+"<i class='right'>"+mob_href+"</i></label>"+
              "<input class='form-control col-xs-12 col-sm-5 laydate-icon' type='text' value='"+value+"' id='"+keys[j]+"' name='" + keys[j] + "' placeholder='" +placeholder + "' maxlength='" + max + "' minlength='" + min + "'"+ required+" "+readonly+" xtype='date'>" +
              ""+txthref+"<p class='Verr'></p></li>"))
          }
        }
        if(rootT[k].type == "textarea"){
          $("#"+grouK+" .Input").append($("<li class='form-group'>" +
            "<label for='"+keys[j]+"' class='col-xs-12 col-sm-3 control-label'><span>"+xingxing+"</span>"+title+"<i class='right'>"+mob_href+"</i></label>"+
            "<textarea class='form-control col-xs-12 col-sm-5' type='text' "+readonly+" rows='"+row+"' id='"+keys[j]+"' name='" +keys[j] + "'placeholder='" +placeholder + "'"+required+">"+value+"</textarea>" +
            ""+txthref+"<p class='Verr'></p></li>"))
        }
        if(rootT[k].type == "file"){
          $("#into_detail ."+grouK+" .Input").append($("<li class='form-group'>" +
            "<form action=" + config.api + "/file/uploadFileToWangposPrivacy method='post' enctype='multipart/form-data'>"+
            "<label class='col-xs-12 col-sm-2 control-label'><span>"+xingxing+"</span>"+title+"</label>"+
            "<label for='"+keys[j]+"' class='btn btn-info' style='color: #fff'>选择文件</label><span style='margin-left: 1em' class='devlue'>"+value+"</span>"+
            "<input class='form-control col-xs-6 fileInput' style='display: none' type='file' id='"+keys[j]+"' name='" +keys[j] + "'>" +
            "<input style='display: none' type='text' name='fileName'>" +
            "<input style='display: none' form='into_detail' type='text'class='desValue' value='"+value+"' name='" +keys[j] + "'"+required+">" +
            "</form><p class='"+fileE+" col-xs-offset-2' style='clear: both;color: #666'>"+placeholder+"</p><span style='color: red;float: left;line-height: 34px'>"+href+"</span></li>"))
        }
        if (rootT[k].type == "select") {
            var titleS = rootT[k].title;
            var str ="<li class='form-group'>"+
              "<label for='" + keys[j] + "' class='col-xs-12 col-sm-3 control-label'><span>"+xingxing+"</span>" +titleS + "<i class='right'>"+mob_href+"</i></label>"+
              "<select id='" + keys[j] + "' name='" + keys[j] + "' class='form-control col-xs-12 col-sm-5' "+required+">";

            for (var m = 0; m < rootT[k].options.length; m++) {
              if( rootT[k].options[m].key){
                str +="<option value='" + rootT[k].options[m].key + "'>" + rootT[k].options[m].value + "</option>";
              }else {
              str +="<option value='" + rootT[k].options[m] + "'>" + rootT[k].options[m] + "</option>";
              }
            }
            $("#"+grouK+" .Input").append($(str+"</select>"+txthref+"<p class='Verr'></p></li>"))
          if(value){
            var options=$("#"+grouK+" .Input select option");
            for(var op=0;op<options.length;op++){
              if(options[op].value==value)options[op].selected=true;
            }
          };
        }
        if (rootT[k].type == "img") {
            imgs.push(keys[j]);
            imgT.push(rootT[k].title);
          }
        if(rootT[k].type == "component"){
          var spanStr=rootT[k].description;
          $("#"+grouK+" .Input").append($("<li class='form-group'>" +
            "<label for='"+keys[j]+"' class='col-xs-12 col-sm-3 control-label'><span>"+xingxing+"</span>"+title+"</label>"+
            "<div class='btn btn-info' data-toggle='modal' data-target='#myModal'> 选择</div>"+
            "<div class='col-xs-12' data-toggle='modal' data-target='#myModal'style='padding-top: 7px;text-align: right'>"+spanStr+">></div>" +
            "<span class='divSpan'>"+spanStr+"</span>"+
            "<input type='text' name='"+keys[j]+"' style='display: none'>"+
            "</li><span class='span col-xs-offset-3 col-xs-9 alert-warning'></span>"))
        }
        if(rootT[k].type == "label"){
          var styleClass='alert-info';
          if(rootT[k].style){
            if(rootT[k].style=="warn")styleClass='alert-warning';
          }
          $("#"+grouK+" .Input").append($("<li class='form-group liLabel'>" +
            "<p class='col-xs-offset-3 "+styleClass+"'>"+title+"：<span>"+placeholder+"</span></p></li>"));
        }
        }
      }
  }
  if(imgs.length!=0){
    if($("#"+grouK+" .Input")){
      $(imgtr).insertAfter($("#"+grouK+" .Input"));
    }else {
      $(imgtr).insertAfter($("#"+grouK+" h4"));
    }
    for(var s=0;s<imgs.length;s++){
      var requiredImg="",xin="",placeholderImg="",hre='',urla='';
      var src="img/pic.png";
      for(var l=0;l<rootT.length;l++){
        if(paper){
        for(var ke in paper.paper){
          if(ke==imgs[s]){
            value=paper.paper[ke];
            if(value){
              src=rootUrl+value+"?accessToken="+accessToken;
            }
          }else if(paper.paper[imgs[s]]==undefined){value="";}
        }}else {value=''}
        if(imgs[s]==rootT[l].key){
          if(rootT[l].validator&&rootT[l].validator.required==true){
            requiredImg= "required";
            xin="*";
          }else {requiredImg= "";xin="";}
          if(src=='img/pic.png'&&rootT[l].description){
            placeholderImg=rootT[l].description;
          }
          if(rootT[l].guide_url){
            hre=rootT[l].guide_url;
          }else {hre=''}
          if(hre&&rootT[l].guide_title){
            urla=rootT[l].guide_title;
          }else {urla=''}
          var alian="<a href='"+hre+"' target='_blank' class='pc_a'>"+urla+"</a>";
          var searchInput="<a href='' class='iframeA'><div class='alian'><iframe src='' frameborder='0' width='100%' height='100%' style='height: 100%'></iframe><div></div></div>"+urla+"</a><b class='colseI'>关闭</b><span style='display: none'>"+hre+"</span>";
          var img_mobile="<li>"+
            "<form action=" + config.api + "/file/uploadFileToWangposPrivacy method='post' enctype='multipart/form-data'>"+
            "<div><div style='background-image:url("+src+")'></div><b class='progress_bar'></b><b class='bigB'>x</b></div>"+
            "<input type='file' accept='image/*' id='" + imgs[s] + grouK+"' name='" +imgs[s] + "'>"+
            "<input type='text' value='" +value + "'  name='" +imgs[s] + "'"+ requiredImg+">"+
            "<div class='divbtn "+imgs[s]+"'>"+
            "<label for='" +imgs[s] +grouK+ "' class='btn add'><span class='glyphicon glyphicon-open'></span></label>"+
            "<b class='btn off'><span class='glyphicon glyphicon-remove'></span></b>"+
            "</div>"+
            "</form>"+
            "<div class='left'><p><a style='color: red;margin-right: 2px'>"+xin+"</a>"+ imgT[s] + "</p>"+
            "<p class='placeH'>"+placeholderImg+"</p>"+
            ""+searchInput+alian+"</div>"+
            "</li>";
          $("#"+grouK+" .img-li").append($(img_mobile));
          if(hre&&(!rootT[l].guide_title)){
            var btnA="<a href='"+hre+"' class='btn' target='_blank'><span class='glyphicon glyphicon-question-sign'></span></a>";
            $("#"+grouK+" .img-li ."+imgs[s]+"").append($(btnA));
          }

        }
      }
    }
  }
}
function prevStep(obj) {
  $(obj).parent().parent().css('display','none');
  $(obj).parent().parent().prev().css('display','block');
  var c=$(obj).parent().parent()[0].id;
  $("."+c).prev().addClass('bac_in');
  $("."+c).prev().removeClass('bac_auto');
  $("p."+c).addClass('bac_in');
  $("p."+c).removeClass('bac_auto');
  $("div."+c).addClass('bac_auto');
  $("div."+c).removeClass('bac_in');
  var s_w=window.innerWidth;
  if(s_w<768){
    $("div."+c).css('display','none');
    $("."+c).prev().css('display','block');
  }
  if($(obj).parent().parent().next()[0]){
    var cn=$(obj).parent().parent().next()[0].id;
    $("p."+cn).addClass('bac_auto');
    $("p."+cn).removeClass('bac_in');
  }
  document.documentElement.scrollTop = document.body.scrollTop =0;
}
var ZanCun=new Object();//暂存数据
var order_woid=new Object();//补件暂存数据
decorateBody(order_woid);
decorateBody(ZanCun);
var get_Url=new Object();
decorateBody(get_Url);
$.ajax({
  url: config.api + '/common/getConfig',
  data: JSON.stringify(get_Url),
  type: 'POST',
  dataType: 'json',
  beforeSend: function (xhr) {
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  },
  success: function (data) {
    if(data.code==0){
      if(ZanCun.dataToken){ZanCun.accessToken=data.data[0].privacy_access_token;ZanCun.rootUrl=data.data[0].privacy_url;};
      if(order_woid.wo_id){order_woid.accessToken=data.data[0].privacy_access_token;order_woid.rootUrl=data.data[0].privacy_url;};
      if(local_try){
        if(window.localStorage['ZanCun']){
          JSON.parse(window.localStorage['ZanCun']).accessToken=data.data[0].privacy_access_token;
          JSON.parse(window.localStorage['ZanCun']).rootUrl=data.data[0].privacy_url;
        };
        if(window.localStorage['order_woid']){
          JSON.parse(window.localStorage['order_woid']).accessToken=data.data[0].privacy_access_token;
          JSON.parse(window.localStorage['order_woid']).rootUrl=data.data[0].privacy_url;
        }
      }else {console.log('无痕模式我不管');}
    }else {
      $('#alert').css('display','block');
      $('#alert .modal-body').html(data.info+"图片和文件将不能正常显示");
    }
  },
  error:function () {
    $('#alert').css('display','block');
    $('#alert .modal-body').html("链接超时，图片和文件将不能正常显示");
  }
});
function nextStep(obj) {
  var id=$('#into_detail>div>h4>span').html();
  var c=$(obj).parent().parent()[0].id;
  var input=$("#"+c+" li>input");
  var textarea=$("#"+c+" textarea");
  var FormInput=$("#"+c+" li form input");
  var select=$("#"+c+" li select");
  if(id)ZanCun.userId=id;
  if(id&&order_woid.wo_id)order_woid.userId=id;
  for(var t=0;t<textarea.length;t++){
    if(textarea[t].validity.valid==false){
      textarea[t].focus();
      $(textarea[t]).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
      return false;
    };
    if(ZanCun.dataToken)ZanCun[textarea[t].name]=$.trim(textarea[t].value);
    if(order_woid.wo_id)order_woid[textarea[t].name]=$.trim(textarea[t].value);
  }
  for(var i=0;i<input.length;i++){
    if(input[i].validity.valid==false
      ||(input[i].required&&Sys.liulan=='safari'&&input[i].value.length<input[i].attributes['minlength'].nodeValue)
      ||(input[i].required&&Sys.liulan=='firefox'&&input[i].value.length<input[i].attributes['minlength'].value)
    ){
      input[i].focus();
      $(input[i]).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
      return false;
    }
    if(input[i].readOnly){
      if(!input[i].value){
        input[i].focus();
        $(input[i]).parent()[0].lastChild.innerHTML="&nbsp;未选择相应的类目填充数据";
        return false;
      }
    }
    if(ZanCun.dataToken)ZanCun[input[i].name]=$.trim(input[i].value);
    if(order_woid.wo_id)order_woid[input[i].name]=$.trim(input[i].value);
  }
  for(var j=0;j<FormInput.length;j++){
    if(FormInput[j].validity.valid==false){
      $('#alert').css('display','block');
      $('#alert .modal-body').html($(FormInput[j]).parent().next()[0].firstChild.innerHTML+"未上传");
      return false;
    }
    if(ZanCun.dataToken)ZanCun[FormInput[j].name]=$.trim(FormInput[j].value);
    if(order_woid.wo_id)order_woid[FormInput[j].name]=$.trim(FormInput[j].value);
  }
  for(var s=0;s<select.length;s++){
    var options=select[s].options;
    if(select[s].validity.valid==false){
      select[s].focus();
      return false;
    }
    for(var k=0;k<options.length;k++){
      if(options[k].selected&&ZanCun.dataToken)ZanCun[select[s].name]=$.trim(options[k].value);
      if(options[k].selected&&order_woid.wo_id)order_woid[select[s].name]=$.trim(options[k].value);
    }
  }
  if(local_try){
    if(ZanCun.dataToken)window.localStorage['ZanCun']=JSON.stringify(ZanCun);
    if(order_woid.wo_id)window.localStorage['order_woid']=JSON.stringify(order_woid);
  }else {console.log('无痕模式我不管');}
  $(obj).parent().parent().css('display','none');
  $(obj).parent().parent().next().css('display','block');
  $("."+c).next().addClass('bac_in');
  $("."+c).next().removeClass('bac_auto');
  $("."+c).addClass('bac_auto');
  $("."+c).removeClass('bac_in');
  if($(obj).parent().parent().next().next()[0]){
    var cn=$(obj).parent().parent().next().next()[0].id;
    var cnn=$(obj).parent().parent().next()[0].id;
    $("p."+cnn).addClass('bac_auto');
    $("p."+cnn).removeClass('bac_in');
    $("p."+cn).addClass('bac_in');
    $("p."+cn).removeClass('bac_auto');
  }else {
    $("p."+$(obj).parent().parent().next()[0].id).addClass('bac_auto');
    $("p."+$(obj).parent().parent().next()[0].id).removeClass('bac_in');
  }
  var s_w=window.innerWidth;
  if(s_w<768){
    $("div."+c).css('display','none');
    $("."+c).next().css('display','block');
  }
  document.documentElement.scrollTop = document.body.scrollTop =0;
}
function addDiv(id) {
  var inputL = $('.sheB input');
  var tong=true;
  for (var i = 0; i < inputL.length; i++) {
    /*$(inputL[i]).keyup(function () {//添加en列表
      var me=this;
      var kw ={en:this.value, agentId:id}
      decorateBody(kw);
      $.ajax({
        url: config.api + '/merchant/checkEn',
        data: JSON.stringify(kw),
        type: 'POST',
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        },
        success: function (data) {
          if(data.code==0){
          var div = $(me).next();
          div.css('display', 'block');
          var ul = div[0].firstChild;
          ul.innerHTML = '';
          var arr =[{en:'213412412'},{en:'435353'},{en:'55122'}] //txt.split('@');
          for(var i=0; i<arr.length; i++){
            if(arr[i].en.indexOf(me.value)!=-1){
              var li = document.createElement('li');
              li.innerHTML = arr[i].en;
              ul.appendChild(li);
            }else{div.css('display', 'none');}
          }
          $('.suggest>ul>li').on('click',function () {
            me.value=this.innerHTML;
            div.css('display', 'none');
            $(ul).empty();
            me.focus()
          })
          }
        }
      })
    })*/
    $(inputL[i]).on('blur',function () {
      var me=this;
      var eny ={en:this.value, agentId:id}
      decorateBody(eny);
      if(tong&&this.value)$.ajax({
        url: config.api + '/merchant/checkEn',
        data: JSON.stringify(eny),
        type: 'POST',
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        },
        success: function (data) {
          if(data.code==0){
            if(me.type!='button'){
              $(me).next().next().next().html("");
            }
          }else {
            $(me).next().next().next().html("&nbsp;"+data.info);
          }
        }
      })
    })
  }
  inputL.keyup(function () {
    var en_p=$(this).next().next().next().html();
    if(inputL.length>1){
      for(var i=0;i<inputL.length;i++){
        if(this.id!=inputL[i].id&&inputL[i].value){
          if(this.value&&this.value==inputL[i].value){
            if(!en_p)$(this).next().next().next().html("&nbsp;en号重复，请重输入");
            tong=false;
          }else {tong=true;}
        }
      }
    }
    if(tong&&(en_p=='&nbsp;en号重复，请重输入'||!en_p))$(this).next().next().next().html("");
  })
}//验证en
function enc(){
  var inputL = $('.sheB input');
  inputL.keyup(function () {
    var tong=true;
    if(inputL.length>1){
      for(var i=0;i<inputL.length;i++){
        if(this.id!=inputL[i].id&&inputL[i].value){
          if(this.value&&this.value==inputL[i].value){
            $(this).next().next().next().html("&nbsp;en号重复，请重输入");
            tong=false;
          }
        }
      }
    }
    if(tong)$(this).next().next().next().html("");
  })
}
