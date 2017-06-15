function rem(obj) {
  if($('#into_detail .sheB hr ~').length>1){
    obj.parentNode.remove()
  }else {
    alert('至少需保留一组设备')
  }
}
var maxWIDTH = window.innerWidth;
function addInput(grouK,rootT,keys,paper,url,acc) {
  $("#into_detail ."+grouK).append($("<ul class='Input'>" +
    "</ul>"));
  var imgtr = "<ul class='img-li'>" +
    "<p><span>上传图片要求：</span> <br> 文件格式为jpg、png，图片长宽均不能超过5000像素，文件大小不超过3M</p>"+
    "</ul>";
  var imgs=[],imgT=[],value='',href='',txT=[],readonly='',row='',mob_href='';
  for (var j = 0; j < keys.length; j++) {
    for (var k = 0; k < rootT.length; k++) {
      if (keys[j] == rootT[k].key) {
        var placeholder=rootT[k].description==undefined?"":rootT[k].description;
        var title = rootT[k].title;
        var max,min;
        var required="",xingxing="",fileE="",txturl='',txthref='';
        if(rootT[k].validator&&rootT[k].validator.maxLength){
          max =rootT[k].validator.maxLength;
        }else {max=""}
        if(rootT[k].validator&& rootT[k].validator.minLength){
          min =rootT[k].validator.minLength;
        }else {min=""}
        if(rootT[k].validator&&rootT[k].validator.required==true){
          required="required";
          xingxing="*";
        }else {required="";xingxing="";}
        fileE=rootT[k].fileExt==undefined?"":rootT[k].fileExt.join(' ');
        if(paper){
          for(var key=0;key<paper.length;key++){
            if(paper[key].key==keys[j]){
              if(paper[key].value){value=paper[key].value}else {value=''};
              if(value){
                href="<a href='"+url+value+"?accessToken="+acc+"' target='_blank'>已上传可查看</a>";
              }else {href=''}
            }
          }
        }else {value=''}
        if(rootT[k].defaultValue){value=rootT[k].defaultValue}
        if(rootT[k].readOnly){readonly='readonly'}else {readonly=''}
        if(rootT[k].rows){row=rootT[k].rows;}else {row=4}
        if(rootT[k].guide_url){
          if(rootT[k].guide_url&&rootT[k].guide_title){txturl=rootT[k].guide_title;}
          else if(rootT[k].guide_url){txturl="<img src='img/question.png'>"}
          mob_href="<a href='' class='iframeA'><div class='alian'><iframe src='' frameborder='0' width='100%' height='100%' style='height: 100%'></iframe><span style='display: none'>"+rootT[k].guide_url+"</span></div>"+txturl+"</a><b class='colseI'>关闭</b>";
          txthref="<a href='"+rootT[k].guide_url+"' target='_blank' class='pc_a'>"+txturl+"</a>";
        }else {txthref='';mob_href=''}
        if (rootT[k].type == "text"||rootT[k].type == "date"||rootT[k].type == "email"||rootT[k].type == "group"){
          $("#into_detail ."+grouK+" .Input").append($("<li class='form-group'>" +
            "<label for='"+keys[j]+"' class='col-xs-12 col-sm-2 control-label'><span>"+xingxing+"</span>"+title+"<i class='right'>"+mob_href+"</i></label>"+
            "<input class='form-control col-xs-12 col-sm-6' value='"+value+"' type='"+rootT[k].type+"' id='"+keys[j]+"' name='" + keys[j] + "' placeholder='" +placeholder + "' maxlength='" + max + "' minlength='" + min + "'"+ required+" "+readonly+">" +
            ""+txthref+"<p class='Verr'></p></li>"))
        }
        if(rootT[k].type == "file"){
          var mob_file="<li class='form-group mob_file'>" +
            "<form action=" + config.api + "/file/uploadFileToWangposPrivacy method='post' enctype='multipart/form-data'>"+
            "<label class='col-xs-12 col-sm-2 control-label'><span>"+xingxing+"</span>"+title+"<i class='right'>"+mob_href+"</i></label>"+
            "<label for='"+keys[j]+"' class='mob_label'><img src='img/add.jpg'></label>"+
            "<label for='"+keys[j]+"' class='btn btn-info pc_label' style='color: #fff'>选择文件</label><span class='devlue'>"+value+"</span>"+
            "<input class='form-control fileInput' style='display: none' type='file' id='"+keys[j]+"' name='" +keys[j] + "'>" +
            "<input style='display: none' type='text' name='fileName'>" +
            "<input style='display: none' form='into_detail' type='text'class='desValue' value='"+value+"' name='" +keys[j] + "'"+required+">" +
            "</form><p class='"+fileE+" col-xs-offset-2'>"+placeholder+"</p><span>"+href+"</span></li>";
          $("#into_detail ."+grouK+" .Input").append($(mob_file));
        }
        if (rootT[k].type == "select") {
          var titleS = rootT[k].title;
          var str ="<li class='form-group'>"+
            "<label for='" + keys[j] + "' class='col-xs-12 col-sm-2 control-label'><span>"+xingxing+"</span>" +titleS + "<i class='right'>"+mob_href+"</i></label>"+
            "<select id='" + keys[j] + "' name='" + keys[j] + "' class='form-control col-xs-12 col-sm-6' "+required+">";
          for (var m = 0; m < rootT[k].options.length; m++) {
            if( rootT[k].options[m].key){
              str +="<option value='" + rootT[k].options[m].key + "'>" + rootT[k].options[m].value + "</option>";
            }else {
              str +="<option value='" + rootT[k].options[m] + "'>" + rootT[k].options[m] + "</option>";
            }
          }
          $("#into_detail ."+grouK+" .Input").append($(str+"</select>"+txthref+"<p class='Verr'></p></li>"));
            if(value){
              var options=$("#into_detail ."+grouK+" .Input select option");
              for(var op=0;op<options.length;op++){
                if(options[op].value==value)options[op].selected=true;
              }
            };
        }
        if (rootT[k].type == "img") {
          imgs.push(keys[j]);
          imgT.push(rootT[k].title);
        }
        if(rootT[k].type == "textarea"){
          $("#into_detail ."+grouK+" .Input").append($("<li class='form-group'>" +
            "<label for='"+keys[j]+"' class='col-xs-12 col-sm-2 control-label'><span>"+xingxing+"</span>"+title+"<i class='right'>"+mob_href+"</i></label>"+
            "<textarea class='form-control col-xs-12 col-sm-6' "+readonly+" rows='"+row+"' id='"+keys[j]+"' name='" + keys[j] + "' placeholder='" +placeholder + "' maxlength='" + max + "' minlength='" + min + "'"+ required+">"+value+"</textarea>"+
            ""+txthref+"<p class='Verr'></p></li>"))
        }
        if(rootT[k].type == "label"){
          var styleClass='alert-info';
          if(rootT[k].style){
            if(rootT[k].style=="warn")styleClass='alert-warning';
          }
          $("#into_detail ."+grouK+" .Input").append($("<li class='form-group'>" +
            "<p class='col-xs-offset-2 "+styleClass+"'>"+title+"：<span>"+placeholder+"</span></p></li>"));
        }
        if(rootT[k].type == "component"){
          var spanStr=rootT[k].description;
          $("#into_detail ."+grouK+" .Input").append($("<li class='form-group'>" +
            "<label for='"+keys[j]+"' class='col-xs-12 col-sm-2 control-label'><span>"+xingxing+"</span>"+title+"</label>"+
            "<div class='btn btn-info' id='"+keys[j]+"' data-toggle='modal' data-target='#myModal'> 选择</div>" +
            "<div class='col-xs-12' id='mob_"+keys[j]+"' data-toggle='modal' data-target='#myModal'style='padding-top: 7px;text-align: right'>"+spanStr+">></div>" +
            "<span class='divSpan'>"+spanStr+"</span>"+
            ""+txthref+"</li>"))
        }
      }
    }
  }
  if(imgs.length!=0){
    $(imgtr).insertAfter($("#into_detail ."+grouK+" .Input"));
    for(var s=0;s<imgs.length;s++){
      var requiredImg="",xin="",placeholderImg="",hre='',urla='';
      var src="img/pic.png";
      for(var l=0;l<rootT.length;l++){
        if(paper){
          for(var ke=0;ke<paper.length;ke++){
            if(paper[ke].key==imgs[s]){
              value=paper[ke].value;
              if(value){
                src=url+value+"?accessToken="+acc;
              }
            }
          }}
        if(imgs[s]==rootT[l].key){
          if(rootT[l].validator&&rootT[l].validator.required==true){
            requiredImg="required";
            xin="*";
          }else {requiredImg="";xin="";}
          if(src=='img/pic.png'&&rootT[l].description){
            placeholderImg=rootT[l].description;
          }
          if(rootT[l].guide_url){
            hre=rootT[l].guide_url;
          }else {hre=''}
          if(hre&&rootT[l].guide_title){
            urla=rootT[l].guide_title;
          }else {urla=''};
          var alian="<a href='"+hre+"' target='_blank' class='pc_a'>"+urla+"</a>";
          var searchInput="<a href='' class='iframeA'><div class='alian'><iframe src='' frameborder='0' width='100%' height='100%' style='height: 100%'></iframe><span style='display: none'>"+hre+"</span></div>"+urla+"</a><b class='colseI'>关闭</b>";
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
            $("#into_detail ."+grouK+" .img-li").append($(img_mobile));
          if(hre&&(!rootT[l].guide_title)){
            var btnA="<a href='"+hre+"' class='btn' target='_blank'><span class='glyphicon glyphicon-question-sign'></span></a>";
            $("#into_detail ."+grouK+" .img-li ."+imgs[s]+"").append($(btnA));
          }
        }
      }
    }
  }
}
function addParams(params,changeV,changeD,requ,acc,url) {
  var imgtr = "<ul class='img-li'>" +
    "<p><span>上传图片要求：</span> <br> 文件格式为jpg、png，图片长宽均不能超过5000像素，文件大小不超过3M</p>"+
    "</ul>";
  var readonly='',xin='',req='',max='',min='',value='',imgs=[],imgT=[],row='',txturl='',txthref='',href='',mob_href='';
  if(params){
    for(var i=0;i<params.length;i++){
      if(changeV){
        for(var key=0;key<changeV.length;key++){
          if(changeV[key].key==params[i].key){
            if(changeV[key].value){value=changeV[key].value}else {value=''};
            if(value&&url&&acc){
              href="<a href='"+url+value+"?accessToken="+acc+"' target='_blank'>已上传可查看</a>";
            }else {
              href=''
            }
          }
        }
      }else if(params[i].defaultValue){
        value=params[i].defaultValue;
      }else {value=''}
      var placeholder=params[i].description==undefined?"":params[i].description;
      var fileE=params[i].fileExt==undefined?"":params[i].fileExt.join(' ');
      if(params[i].readOnly){readonly='readonly'}else {readonly=''};
      if(params[i].validator&&(params[i].validator.required==true)){
        req="required";
        xin="*";
      }else {req='';xin=''};
      if(params[i].validator&&params[i].validator.maxLength){
        max =params[i].validator.maxLength;
      }else {max=""}
      if(params[i].validator&&params[i].validator.minLength){
        min =params[i].validator.minLength;
      }else {min=""}
      if(params[i].rows){
        row=params[i].rows;
      }else {row=4}
      if(params[i].guide_url){
        if(params[i].guide_url&&params[i].guide_title){txturl=params[i].guide_title;}
        else if(params[i].guide_url){txturl="<img src='img/question.png'>"}
        mob_href="<a href='' class='iframeA'><div class='alian'><iframe src='' frameborder='0' width='100%' height='100%' style='height: 100%'></iframe><span style='display: none'>"+rootT[k].guide_url+"</span></div>"+txturl+"</a><b class='colseI'>关闭</b>";
        txthref="<a href='"+rootT[k].guide_url+"' target='_blank' class='pc_a'>"+txturl+"</a>";
      }else {txthref='';mob_href=''}
      if (params[i].type == "text"){
        if(!params[i].scope){
          if($("#into_detail .sheB .sheBf")[0]) {
            $("#into_detail .sheB").prepend($("<li class='form-group'>" +
              "<label for='" + params[i].key + "' class='col-xs-12 col-sm-2 control-label'><span>"+xin+"</span>" + params[i].title + "<i class='right'>"+mob_href+"</i></label>" +
              "<input class='form-control col-xs-12 col-sm-6' type='text' value='"+value+"' id='" + params[i].key + "' name='" + params[i].key + "'placeholder='" +placeholder + "' maxlength='" + max + "' minlength='" + min + "' "+readonly+""+req+">" +
              ""+txthref+"<p class='Verr'></p></li>"))
          }else {
            $("#into_detail .sheB").append($("<li class='form-group'>" +
              "<label for='"+params[i].key+"' class='col-xs-12 col-sm-2 control-label'><span>"+xin+"</span>"+params[i].title+"<i class='right'>"+mob_href+"</i></label>"+
              "<input class='form-control col-xs-12 col-sm-6' type='text' value='"+value+"' id='"+params[i].key+"' name='" +params[i].key + "'placeholder='" +placeholder + "' maxlength='" + max + "' minlength='" + min + "' "+readonly+" "+req+">" +
              ""+txthref+"<p class='Verr'></p></li>"))
          }}}
      if (params[i].type == "select"){
        var str ="<li class='form-group'>"+
          "<label for='" + params[i].key + "' class='col-xs-12 col-sm-2 control-label'><span>"+xin+"</span>" +params[i].title + "<i class='right'>"+mob_href+"</i></label>"+
          "<select id='" + params[i].key + "' name='" + params[i].key + "' class='form-control col-xs-12 col-sm-6' "+req+">"+
          "<option value=''>--请选择--</option>";
        for (var m = 0; m < params[i].options.length; m++) {
          if( params[i].options[m].key){
            str +="<option value='" + params[i].options[m].key + "'>" + params[i].options[m].value + "</option>";
          }else {
            str +="<option value='" + params[i].options[m] + "'>" + params[i].options[m] + "</option>";
          }
        }
        if($("#into_detail .sheB .sheBf")[0]) {
          $("#into_detail .sheB").prepend($(str+"</select>"+txthref+"<p class='Verr'></p></li>"))
        }else {
          $("#into_detail .sheB").append($(str+"</select>"+txthref+"<p class='Verr'></p></li>"))
        }
        if(value){
          var options=$("#into_detail .sheB select option");
          for(var op=0;op<options.length;op++){
            if(options[op].value==value)options[op].selected=true;
          }
        };
      }
      if(params[i].type == "textarea"){
        if(!params[i].scope){
          $("#into_detail .sheB").append($("<li class='form-group'>" +
            "<label for='"+params[i].key+"' class='col-xs-12 col-sm-2 control-label'><span>"+xin+"</span>"+params[i].title+"<i class='right'>"+mob_href+"</i></label>"+
            "<textarea class='form-control col-xs-12 col-sm-6' type='text' "+readonly+" rows='"+row+"' id='"+params[i].key+"' name='" +params[i].key + "'placeholder='" +placeholder + "'"+req+">"+value+"</textarea>" +
            ""+txthref+"<p class='Verr'></p></li>"))
        }}
      if(params[i].type == "button"){
        if(!params[i].scope){
          $("#into_detail .sheB").append($("<li class='form-group'>" +
            "<label for='"+params[i].key+"' class='col-xs-4 col-sm-2 control-label'><span></span>"+params[i].label+"<i class='right'>"+mob_href+"</i></label>"+
            "<div class='btn btn-info' id='"+params[i].key+"' style='height: 34px;margin-left:1em;text-align: center'>"+params[i].label+"</div>" +
            "</li>"))
        }}
      if(params[i].type == "file"){
        var mob_file="<li class='form-group mob_file'>" +
          "<form action=" + config.api + "/file/uploadFileToWangposPrivacy method='post' enctype='multipart/form-data'>"+
          "<label class='col-xs-12 col-sm-2 control-label'><span>"+xin+"</span>"+params[i].title+"<i class='right'>"+mob_href+"</i></label>"+
          "<label for='"+params[i].key+"' class='mob_label'><img src='img/add.jpg'></label>"+
          "<label for='"+params[i].key+"' class='btn btn-info pc_label' style='color: #fff'>选择文件</label><span class='devlue'>"+value+"</span>"+
          "<input class='form-control fileInput' style='display: none' type='file' id='"+params[i].key+"' name='" +params[i].key + "'>" +
          "<input style='display: none' type='text' name='fileName'>" +
          "<input style='display: none' form='into_detail' type='text'class='desValue' value='"+value+"' name='" +params[i].key + "'"+req+">" +
          "</form><p class='"+fileE+" col-xs-offset-2'>"+placeholder+"</p><span>"+href+"</span></li>";
        $("#into_detail .sheB").append($(mob_file));
      }
      if (params[i].type == "img") {
        imgs.push(params[i].key);
        imgT.push(params[i].title);
      }
      if(params[i].type == "component"){
        var spanStr=params[i].description;
        $("#into_detail .sheB").append($("<li class='form-group'>" +
          "<label for='"+params[i].key+"' class='col-xs-12 col-sm-2 control-label'><span>"+xin+"</span>"+params[i].title+"</label>"+
          "<div class='btn btn-info' id='"+params[i].key+"' data-toggle='modal' data-target='#myModal'> 选择</div>" +
          "<div class='col-xs-12' id='mob_"+params[i].key+"' data-toggle='modal' data-target='#myModal'style='padding-top: 7px;text-align: right'>"+spanStr+">></div>" +
          "<span class='divSpan'>"+spanStr+"</span>"+
          ""+txthref+"</li>")
        );
      }
      if(params[i].type == "label"){
        var styleClass='alert-info';
        if(params[i].style){
          if(params[i].style=="warn")styleClass='alert-warning';
        }
        $("#into_detail .sheB").append($("<li class='form-group'>" +
          "<p class='col-xs-offset-2 "+styleClass+"'>"+params[i].title+"：<span>"+placeholder+"</span></p></li>"));
      }
    }
    if(imgs.length!=0){
      $(imgtr).insertAfter($("#into_detail .sheB"));
      for(var s=0;s<imgs.length;s++){
        var requiredImg="",xin="",hre='',urla='',placeholderImg='';
        var src="img/pic.png";
        for(var l=0;l<params.length;l++){
          if(changeV){
            for(var key=0;key<changeV.length;key++){
              if(changeV[key].key==params[l].key&&imgs[s]==params[l].key){
                value=changeV[key].value;
                if(value&&url&&acc){
                  src=url+value+"?accessToken="+acc;
                }
              }
            }
          }
          if(imgs[s]==params[l].key){
            if(params[l].validator&&params[l].validator.required==true){
              requiredImg="required";
              xin="*";
            }else {requiredImg="";xin="";}
            if(src=='img/pic.png'&&params[l].description){
              placeholderImg=params[l].description;
            }
            if(params[l].guide_url){
              hre=params[l].guide_url;
            }else {hre=''}
            if(hre&&params[l].guide_title){
              urla=params[l].guide_title;
            }else {urla=''}
          }
        }
        var alian="<a href='"+hre+"' target='_blank' class='pc_a'>"+urla+"</a>";
        var searchInput="<a href='' class='iframeA'><div class='alian'><iframe src='"+hre+"' frameborder='0' width='100%' height='100%' style='height: 100%'></iframe></div>"+urla+"</a><b class='colseI'>关闭</b>";
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
        $("#into_detail .img-li").append($(img_mobile));
      }
    }

  }
  if(changeD){
    $('#into_detail .sheB hr ~').remove();
    var strB='',red='',xin='';
    if(requ[0].validator&&requ[0].validator.required==true){
      red='required';
      xin='*';
    }else {red='';xin=''};
    for(var i=0;i<changeD.length;i++){
      if(changeD[i][2]){
        strB="<li class='col-xs-12 sheBli'>"+
          "<span style='color:red;float: left;margin-right: 5px;line-height: 34px;'>"+xin+"</span><input type='text' id='"+changeD[i][0].key+"_"+(i+1)+"' name='"+changeD[i][0].key+"' value='"+changeD[i][0].value+"' placeholder='EN' class='col-xs-3 form-control' "+red+">"+
          "<div class='suggest clear col-xs-3'><ul></ul></div>"+
          "<input type='text' id='"+changeD[i][1].key+"_"+(i+1)+"' name='"+changeD[i][1].key+"' value='"+changeD[i][1].value+"' class='col-xs-3 form-control' "+red+">"+
          "<input type='text' id='"+changeD[i][2].key+"_"+(i+1)+"' name='"+changeD[i][2].key+"' value='"+changeD[i][2].value+"' class='col-xs-3 form-control' "+red+">"+
          "<span onclick='rem(this)' class='left'><img src='img/delete.png' alt=''></span>"+
            "<p class='Verr'></p>"+
          "</li>";
      }else {
        strB="<li class='col-xs-12 sheBli'>"+
          "<span style='color:red;float: left;margin-right: 5px;line-height: 34px;'>"+xin+"</span><input type='text' id='"+changeD[i][0].key+"_"+(i+1)+"' name='"+changeD[i][0].key+"' value='"+changeD[i][0].value+"' placeholder='EN' class='col-xs-4 form-control' "+red+">"+
          "<div class='suggest clear col-xs-4'><ul></ul></div>"+
          "<input type='text' id='"+changeD[i][1].key+"_"+(i+1)+"' name='"+changeD[i][1].key+"' value='"+changeD[i][1].value+"' class='col-xs-4 form-control' "+red+">"+
          "<span onclick='rem(this)' class='left'><img src='img/delete.png' alt=''></span>"+
          "<p class='Verr'></p>"+
          "</li>";
      }
      $('#into_detail .sheB').append($(strB));
    }
  }
}
function addDiv(id,wo_id) {
  var inputL = $('.sheB .sheBli input[name="en"]');
  var inputEnP=$('#into_detail .sheBli p');
  var tong=true;
  for (var i = 0; i < inputL.length; i++) {
    /*$(inputL[i]).keyup(function () {
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
     }
     }
     $('.suggest>ul>li').on('click',function () {
     me.value=this.innerHTML;
     div.css('display', 'none');
     me.focus()
     })
     }
     }
     })
     })*///添加en列表
    $(inputL[i]).on('blur',function () {
      var me=this;
      var eny ={en:this.value, agentId:id};
      if(wo_id)eny.wo_id=wo_id;
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
              $(me).parent()[0].lastChild.innerHTML="";
            }
            $('.btnL .btn-success').removeAttr('disabled');
          }else {
            $(me).parent()[0].lastChild.innerHTML="&nbsp;"+data.info;
            $('.btnL .btn-success').removeAttr('disabled');
          }
        }
      })
    });
  }
  inputL.keyup(function () {
    var en_p=$(this).parent()[0].lastChild.innerHTML;
    if(inputL.length){
      for(var i=0;i<inputL.length;i++){
        if(this.id!=inputL[i].id&&inputL[i].value){
          if(this.value&&this.value==inputL[i].value){
            if(!en_p)$(this).parent()[0].lastChild.innerHTML="&nbsp;en号重复，请重输入";
            tong=false;
          }else {tong=true;}
        }
      }
    }
    if(tong&&en_p=='&nbsp;en号重复，请重输入')$(this).parent()[0].lastChild.innerHTML="";
  })
}//验证en
function enc(){
  var enL = $('.sheB input[name="en"]');
  var tnoL = $('.sheB input[name="tno"]');
  var unoL = $('.sheB input[name="uno"]');
  enL.keyup(function () {
    var tong=true;
    if(enL.length>1){
      for(var i=0;i<enL.length;i++){
        if(this.id!=enL[i].id&&enL[i].value){
          if(this.value&&this.value==enL[i].value){
            $(this).parent()[0].lastChild.innerHTML="&nbsp;en号重复，请重输入";
            tong=false;
          }
        }
      }
    }
    if(tong)$(this).parent()[0].lastChild.innerHTML="";
  });
  tnoL.keyup(function () {
    var tong=true;
    if(tnoL.length>1){
      for(var i=0;i<tnoL.length;i++){
        if(this.id!=tnoL[i].id&&tnoL[i].value){
          if(this.value&&this.value==tnoL[i].value){
            $(this).parent()[0].lastChild.innerHTML="&nbsp;tno号重复，请重输入";
            tong=false;
          }
        }
      }
    }
    if(tong)$(this).parent()[0].lastChild.innerHTML="";
  });
  unoL.keyup(function () {
    var tong=true;
    if(unoL.length>1){
      for(var i=0;i<unoL.length;i++){
        if(this.id!=unoL[i].id&&unoL[i].value){
          if(this.value&&this.value==unoL[i].value){
            $(this).parent()[0].lastChild.innerHTML="&nbsp;uno号重复，请重输入";
            tong=false;
          }
        }
      }
    }
    if(tong)$(this).parent()[0].lastChild.innerHTML="";
  });
}
/*
 * 密钥证书文件导入
 */
function handleFiles(keyType, files, bind) {
  var reg=new RegExp(/\\|\/+/),s='';
  if(reg.test(files.value)){
    s=files.value.split(reg)[files.value.split(reg).length-1];
  }else {
    s=files.value;
  }
  files.previousElementSibling.innerHTML=s;
  if (files.files.length) {
    var file = files.files[0];
    var reader = new FileReader();
    if (file.name.lastIndexOf(".") != -1) {
      var str = file.name.substr(1);
      var strs = str.split(".");
      var type=strs[strs.length-1].toLowerCase();
    }
    //检查文件类型: pem的证书文件,或text文本文件
    if (/\w+\/x-x509-ca-cert/.test(file.type) || /text\/\w+/.test(file.type)||type=='pem' ) {
      reader.onload = function() {
        var rsaKey = this.result;
        if(checkKeyFile(rsaKey,keyType)) {
          if(keyType=='RSA_PUBLIC'){
            rsaKey = rsaKey.replace(/-----BEGIN PUBLIC KEY-----/g, ""); //去掉HEADER
            rsaKey = rsaKey.replace(/-----END PUBLIC KEY-----/g, ""); //去掉FOOTER
          } else {
            rsaKey = rsaKey.replace(/-----BEGIN PRIVATE KEY-----/g, ""); //去掉HEADER
            rsaKey = rsaKey.replace(/-----END PRIVATE KEY-----/g, ""); //去掉FOOTER
          }
          rsaKey = rsaKey.replace(/[ ]/g, ""); //去掉空格
          rsaKey = rsaKey.replace(/[\r\n]/g, ""); //去掉回车换行

          bind.value = rsaKey;
        } else {
          if(keyType=='RSA_PUBLIC'){
            $('#alert').css('display','block');
            $('#alert .modal-body').html('无效的公钥格式,证书文件要求以『-----BEGIN PUBLIC KEY-----』开头。');
            bind.value ="";
            files.previousElementSibling.innerHTML='';
          }
        else {
            $('#alert').css('display','block');
            $('#alert .modal-body').html('无效的私钥格式,PCKS8格式的证书文件要求以『-----BEGIN PRIVATE KEY-----』开头。');
            bind.value ="";
            files.previousElementSibling.innerHTML='';
          }
        }
      };
      reader.readAsText(file);
      files.value='';
    }
  }
}
/*
 * 检查密钥证书文件格式。
 * 公钥以-----BEGIN PUBLIC KEY-----开头,以-----END PUBLIC KEY-----结尾
 * 私钥以-----BEGIN PRIVATE KEY-----开头,以-----END PRIVATE KEY-----结尾
 */
function checkKeyFile(keyText, keyType) {
  var regex;

  if(keyType=='RSA_PUBLIC') {
    regex = /-----BEGIN PUBLIC KEY-----\n(.{64}\n)+(.{1,64}\n)?-----END PUBLIC KEY-----/;
  } else {
    regex = /-----BEGIN PRIVATE KEY-----\n(.{64}\n)+(.{1,64}\n)?-----END PRIVATE KEY-----/;
  }

  var arr = keyText.match(regex);

  if(arr==null)
    return false;
  else
    return true;

}

/*
 * RSA密钥对匹配检查
 */
function matchRSAKeypair(publicKeyStr, privateKeyStr) {
  if (publicKeyStr == null || privateKeyStr == null || publicKeyStr.length < 200 || privateKeyStr < 800)  //
    return false;
  var jse = new JSEncrypt();
  try {
    jse.setPublicKey(publicKeyStr);
    jse.setPrivateKey(privateKeyStr);

    var textPlain = "THIS IS A PLAIN TEXT For RSA KEYPAIR TESTING!!!";
    var cipher = jse.encrypt(textPlain);
    var txt = jse.decrypt(cipher);

    //console.info(cipher +"\r\n"+txt);

    if (txt == textPlain) {
      return true;
    } else {
      $('#alert').css('display','block');
      $('#alert .modal-body').html('RSA公私钥不匹配');
      return false;
    }
  } catch(e) {
    $('#alert').css('display','block');
    $('#alert .modal-body').html('密钥文件格式错误');
    return false;
  }
}
