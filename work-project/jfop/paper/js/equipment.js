var app = angular.module('myapp', ['ng', 'ui.router', 'cgBusy']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/basic');
  $stateProvider.state("basic", {
    url: "/basic?dataToken&wo_id",
    templateUrl: 'tal/equipment-basic.html',
    controller: 'basic'
  })
  $stateProvider.state("basic.detail", {
    url: "/detail",
    templateUrl: 'tal/equipment-detail.html',
    controller: 'detail'
  })
}]);
app.value('cgBusyDefaults',{
  message:'玩命加载中...',
  backdrop: false,
});
app.controller("basic", function ($scope, $http, $state,$window) {
  $scope.dataToken=new Object();
  decorateBody($scope.dataToken);
  if($state.params.wo_id||$scope.dataToken.wo_id){
    $scope.dataToken.templet_mode='apply_config';
    $scope.dataToken.wo_id=$state.params.wo_id||$scope.dataToken.wo_id;
    $('#basic').remove();
    $scope.Lod=$http.post(config.api + '/webWo/getWODetailCommon',$scope.dataToken).success(function (data) {
      if(data.code==0){
        var status=data.data[0].status;
        $scope.type=data.data[0].paper_channel;
        $scope.userId=data.data[0].paper.ext.userId;
        if(data.data[0].paper.ext.userType)$scope.userType=data.data[0].paper.ext.userType;
        switch (status) {
          case 10:$scope.err = "您的资料正在审核中，请耐心等待";break;
          case 11:$scope.err = "您的资料正在审核中，请耐心等待";break;
          case 12:$scope.err = "审核不通过，请核对后重新提交审核";break;
          case 21:$scope.err = "恭喜您，您的资料已通过审核";break;
          case 0:$scope.err = "您的资料已终止审核";break;
        }
        $scope.obj=new Object();
        $scope.obj.mcode=data.data[0].mcode;
        $scope.obj.merchant_name=data.data[0].merchant_name;
        $scope.obj.channel_name=data.data[0].payChannel.channel_name;
        $scope.obj.pay_mode_id=data.data[0].payChannel.pay_mode_id;
        $scope.paper=data.data[0].paperItems;
        $scope.url=data.data[0].rootUrl;
        $scope.acc=data.data[0].accessToken;
        if(data.data[0].paper.ext.templateId)$scope.templateId=data.data[0].paper.ext.templateId;
        var channel=data.data[0].payChannel.channel;
        for(var i=0;i<channel.length;i++){
          if(channel[i].params){
            for(var j=0;j<channel[i].params.length;j++){
              if(channel[i].params[j].value){
                $scope.channelP=channel[i].params;
              }
            }
          }
          if(channel[i].templateId){$scope.obj.templateId=channel[i].templateId;}
          if(channel[i].device_info.length){
            for(var k=0;k<channel[i].device_info.length;k++){
              for(var c=0;c<channel[i].device_info[k].length;c++){
                if(channel[i].device_info[k][c].value){
                  $scope.channelD=channel[i].device_info;
                }
              }
            }
          }
          $scope.obj.channel_name=channel[i].name;
          $scope.obj.channel_id=channel[i].id;
        }
        if(status==12){
          $state.go('basic.detail', null, {location: 'replace'});
          $scope.status='（待补充）';
          if(data.data[0].remark){
            $scope.bujian=true;
            $scope.results=data.data[0].remark;
          }
        }else {
          $scope.erro=true;
          $('.breadcrumb').css('display','none')
        }
      }else {
        $scope.erro=true;
        $scope.err=data.info;
        $('.breadcrumb').css('display','none')
      }
    })
  }else {
    if($scope.dataToken.dataToken){
      $('#wodang').css('display','block');
      $scope.startLod=$http.post(config.api+'/common/getData',$scope.dataToken).success(function (data) {
        if(data.code==0){
          if(data.data.length==0||!data.data[0]){
            $scope.erro = true;
            $scope.err = "数据格式错误";
            $('.breadcrumb').css('display', 'none')
            $('#into_a').css('display', 'none');
            return false;
          };
          if(data.data[0].type)$scope.type=data.data[0].type;
          if(data.data[0].userId)$scope.userId=data.data[0].userId;
          if(isEmptyObject(data.data[0].data)==false){
            $scope.salesman_name=data.data[0].data.salesman_name;
            $scope.salesman_type=data.data[0].data.salesman_type;
            if(data.data[0].data.salesman_type)$('input[name="salesman_type"]').attr('readonly',true);
            $scope.salesman_branch=data.data[0].data.salesman_branch;
            if(data.data[0].data.salesman_branch)$('input[name="salesman_branch"]').attr('readonly',true);
            $scope.salesman_phone=data.data[0].data.salesman_phone;
            $scope.mcode=data.data[0].data.mcode;
            if (data.data[0].data.mcode)$('input[name="mcode"]').attr('readonly', true);
            $scope.merchant_name=data.data[0].data.merchant_name;
            if (data.data[0].data.merchant_name)$('input[name="merchant_name"]').attr('readonly', true);
            $('#into button').removeAttr('disabled');
            if(data.data[0].data.userType)$scope.userType=parseInt(data.data[0].data.userType);
            if(data.data[0].data.callback_url){
              if(data.data[0].data.callback_url.success_url)$scope.success_url=data.data[0].data.callback_url.success_url;
              if(data.data[0].data.callback_url.error_url)$scope.error_url=data.data[0].data.callback_url.error_url;
            };
          }
          var pay=new Object();
          pay.channel_operated_type='outer';
          decorateBody(pay);
          $scope.P=$http.post(config.api+'/pay/getPayMode',pay).success(function (data) {
            if(data.code==0){
              $('#wodang').css('display','none');
              for(var i=0;i<data.data.length;i++){
                var str="<li ><input type='radio' name='pay_mode_id' value='"+data.data[i].pay_mode_id+"' id='"+data.data[i].pay_mode_id+"'><label for='"+data.data[i].pay_mode_id+"'>"+data.data[i].pay_mode_name+"</label></li>"
                $('.jinJ ul').append($(str));
              }
              for(var j=0;j<data.data[0].channel.length;j++){
                var channelN=data.data[0].channel[j];
                var strC="<li><input type='radio' id='"+channelN.id+"' name='channel_id' value='"+channelN.id+"'>" +
                  "<input type='radio' name='channel_name' value='"+channelN.name+"'><label for='"+channelN.id+"'>"+channelN.name+"</label></li>";
                $('.channel ul').append($(strC));
              }
              $('.jinJ ul li').first().addClass('actv');
              if($('.jinJ ul li input').length)$('.jinJ ul li input')[0].checked=true;
              $('.channel ul li').first().addClass('actv');
              if($('.channel ul li input').length){
                $('.channel ul li input')[0].checked=true;
                $('.channel ul li input')[1].checked=true;
                if($('.channel ul li:nth-child(1) input')[2]){$('.channel ul li:nth-child(1) input')[2].checked=true;}
              }
              $('.jinJ').on('click',function (e) {
                if(e.target.nodeName=='LABEL'){
                  $(e.target).prev()[0].checked=true;
                  var div=$(e.target).parent();
                  div.addClass('actv');
                  div.siblings().removeClass('actv');
                  $('.channel ul').empty();
                  for(var k=0;k<data.data.length;k++){
                    if(e.target.innerHTML==data.data[k].pay_mode_name){
                      for(var l=0;l<data.data[k].channel.length;l++){
                        var cha=data.data[k].channel[l];
                        var templateId=cha.templateId;
                        var disNoneInput=templateId?"<input type='radio' style='display:none' name='templateId' value='"+templateId+"'/>":"";
                        var strCh="<li><input type='radio' id='"+cha.id+"' name='channel_id' value='"+cha.id+"'>" +
                          "<input type='radio' name='channel_name' value='"+cha.name+"'>"+ disNoneInput+"<label for='"+cha.id+"'>"+cha.name+"</label>" +
                          "</li>";
                        $('.channel ul').append($(strCh));
                      }
                    }
                  }
                  $('.channel ul li').first().addClass('actv');
                  if($('.channel ul li input').length){
                    $('.channel ul li input')[0].checked=true;
                    $('.channel ul li input')[1].checked=true;
                    if($('.channel ul li input')[2]){$('.channel ul li input')[2].checked=true;}
                    $('.channel').css('display','block')
                  }else {
                    $('.channel').css('display','none')
                  }
                }
              });
            }else {
              $scope.erro=true;
              $scope.err=data.info;
              $('.breadcrumb').css('display','none')
            }
          }).error(function () {
            $scope.erro=true;
            $scope.err='请求超时，请稍后重试';
            $('.breadcrumb').css('display','none')
          });
          $('.channel').on('click',function (e) {
            if(e.target.nodeName=='LABEL'){
              $('.channel ul li input').removeAttr('checked');
              $(e.target).prev()[0].checked=true;
              $(e.target).prev().prev()[0].checked=true;
              if($(e.target).prev().prev().prev().length)$(e.target).prev().prev().prev()[0].checked=true;
              var div=$(e.target).parent();
              div.addClass('actv');
              div.siblings().removeClass('actv');
            }
          });
          var inputlist = $("#into input");
          var yan = new Object();
          var inL=$('#into .Top input');
          $('#into .Top input').on('blur',function () {
            for (var a = 0; a < inL.length; a++) {
              if(inL[a].value==''){
                return false
              }
              yan[inL[a].name]=$.trim(inL[a].value);
            }
            decorateBody(yan);
            $scope.er="验证中...";
            $scope.yanZ=$http.post(config.api + '/merchant/checkMcode', yan).success(function (data) {
              if(data.code==0){
                $scope.er="";
                $('#into button').removeAttr('disabled');
              }else {
                $scope.er=data.info;
                $('#into button').attr('disabled',true);
                document.documentElement.scrollTop = document.body.scrollTop =0;
                if($window.innerWidth<768){
                  $('#alert').css('display','block');
                  $('#alert .modal-body').html(data.info);
                };
              }
            }).error(function (data) {
              $scope.er = "验证超时，请稍后重试";
              $('#into button').attr('disabled',true);
              document.documentElement.scrollTop = document.body.scrollTop =0;
              if($window.innerWidth<768){
                $('#alert').css('display','block');
                $('#alert .modal-body').html("MCODE验证超时，请稍后重试");
              };
            })
          });
          $scope.jump = function () {
            $scope.obj=new Object();
            for (var a = 0; a < inputlist.length; a++) {
              if (inputlist[a].validity.valid==false) {
                inputlist[a].focus();
                return false;
              }
              if(inputlist[a].name=='salesman_phone'){
                if(Sys.liulan=='safari'&&inputlist[a].value.length<inputlist[a].attributes['minlength'].nodeValue
                  ||Sys.liulan=='firefox'&&inputlist[a].value.length<inputlist[a].attributes['minlength'].value
                ){
                  inputlist[a].focus();
                  return false;
                }
              }
              $scope.obj[inputlist[a].name]=$.trim(inputlist[a].value);
            };
            var Radio=$('#into input[type="radio"]');
            for(var i=0;i<Radio.length;i++){
              if(Radio[i].checked){
                $scope.obj[Radio[i].name] =Radio[i].value;
              }
            }
            //$scope.obj = $('#into').serializeObject();
            if($scope.obj.ref_store_mcode&&$scope.obj.ref_store_name){
              var ref_yan={
                mcode:$scope.obj.ref_store_mcode,
                merchant_name:$scope.obj.ref_store_name,
                pay_mode_id:$scope.obj.pay_mode_id,
                pay_channel_id:$scope.obj.channel_id
              };
              var ref_Mcode={ 
                mcode:$scope.obj.ref_store_mcode,
                merchant_name:$scope.obj.ref_store_name
              };
              if($scope.obj.templateId)ref_yan.templateId=$scope.obj.templateId;
              decorateBody(ref_yan);
              decorateBody(ref_Mcode);
              $http.post(config.api+'/merchant/checkMcode',ref_Mcode).success(function (data) {
                if(data.code==0){
                  $scope.PromiseT=$http.post(config.api+'/webWo/getPayInfoByMcode',ref_yan).success(function (data) {
                    if(data.code==0){
                     $scope.channelP='';
                      if(data.data.length){
                        if(data.data[0].pay_channel_list.length){
                          if(data.data[0].pay_channel_list[0].params){
                            var params=data.data[0].pay_channel_list[0].params;
                            for(var i=0;i<params.length;i++){
                              if(params[i].value){
                                $scope.channelP=params;
                                break;
                              }
                            }
                          }
                        }
                      };
                      $('#confirm').css('display','block');
                      if($scope.channelP){
                        $('#confirm .modal-body').html("已获得参考门店的收银参数，是否需要加载？");
                        $('#confirm .ok').on('click',function () {
                          $('#confirm').css('display','none');
                          $state.go('basic.detail', null, {location: 'replace'});
                          $("#basic").addClass("ng-hide");
                        });
                        $('#confirm .no').on('click',function () {
                          $scope.channelP='';
                          $('#confirm').css('display','none');
                          $state.go('basic.detail', null, {location: 'replace'});
                          $("#basic").addClass("ng-hide");
                        });
                      }else {
                        $('#confirm .modal-body').html("参考门店未配置此通道的收银参数。");
                        $('#confirm button').on('click',function () {
                          $('#confirm').css('display','none');
                          $state.go('basic.detail', null, {location: 'replace'});
                          $("#basic").addClass("ng-hide");
                        });
                      }
                    }else {
                      $('#alert').css('display','block');
                      $('#alert .modal-body').html('参考门店信息：'+data.info);
                    }
                  }).error(function () {
                    $('#alert').css('display','block');
                    $('#alert .modal-body').html('获取参考门店收银参数失败，请稍后重试');
                  });
                }else {
                  $('#alert').css('display','block');
                  $('#alert .modal-body').html('参考门店信息：'+data.info);
                }
              }).error(function () {
                $('#alert').css('display','block');
                $('#alert .modal-body').html('原门店MCODE和名称验证超时，请稍后重试');
              });
            }else if($scope.obj.ref_store_mcode||$scope.obj.ref_store_name){
              $('#confirm').css('display','block');
              $('#confirm .modal-body').html("参考门店的信息有误，是否继续下一步？");
              $('#confirm .no').on('click',function () {$('#confirm').css('display','none');});
              $('#confirm .ok').on('click',function () {
                $('#confirm').css('display','none');
                $state.go('basic.detail', null, {location: 'replace'});
                $("#basic").addClass("ng-hide");
              });
            }else {
              $state.go('basic.detail', null, {location: 'replace'});
              $("#basic").addClass("ng-hide");
            }
          }
        }else {
          $scope.erro=true;
          $scope.err=data.info;
          $('.breadcrumb').css('display','none')
          $('#basic').css('display','none');
        }
      }).error(function () {
        $scope.erro=true;
        $scope.err='请求参数不足或错误，请返回重试';
        $('.breadcrumb').css('display','none')
        $('#basic').css('display','none');
      });
    }else {
      $scope.erro=true;
      $scope.err='请求参数不足或错误，请返回重试';
      $('.breadcrumb').css('display','none')
      $('#basic').css('display','none')
    }
  }
  $('#alert button').on('click',function () {$('#alert').css('display','none');/*$('#into .btn-success').removeAttr('disabled');*/})
})
app.controller("detail", function ($scope, $http, $state, $window, $anchorScroll) {
  if($state.params.wo_id||$scope.dataToken.wo_id){$('#into_b .btnL .btn-info').css('display','none');}
  if ($scope.obj) {
    var pay_mode_name="";
    switch (parseInt($scope.obj.pay_mode_id)) {
      case 1006:pay_mode_name = "银行卡";break;
      case 1005:pay_mode_name = "百度钱包";break;
      case 1004:pay_mode_name = "支付宝";break;
      case 1003:pay_mode_name = "微信";break;
    }
    $scope.merchant_name = $scope.obj.merchant_name;
    $scope.code = $scope.obj.mcode;
    $scope.pay_mode_name = pay_mode_name;
    $scope.channel_name = $scope.obj.channel_name;
  }
  var obj = new Object();
  var paramS=new Object();
  var callback = function (k, v) {obj[k] = v;};//图片上传的回调
  $window.onscroll = function () {
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    var Height = screen.height;
    $scope.top = function () {
      $anchorScroll();
    }
    if (top > Height / 2) {
      $(".footer").css("display", "block");
    } else {
      $(".footer").css("display", "none");
    }
  };//回顶
  $scope.before = function () {
    if ($('#into_detail div').length) {
      $('#confirm .modal-body').html( '返回修改将清除已填资料，是否确认？');
      $('#confirm').css('display','block');
      $('#confirm .ok').on('click',function () {
        $('#confirm').css('display','none');
        $("#basic").removeClass("ng-hide");
        $state.go('basic');
        $('#into button').removeAttr('disabled');
      })
      $('#confirm .no').on('click',function () {$('#confirm').css('display','none');})
    }else {
      $("#basic").removeClass("ng-hide");
      $state.go('basic');
      $('#into button').removeAttr('disabled');
    }
  };//回到第一个页面
  if($scope.obj){
    $scope.Promise=$http.post(config.api + '/template/getApplyConfigTemplate',$scope.obj).success(function (data) {
      if (data.code==0) {
        $scope.showBtn=true;
        if (data.data[0].paper.groups.length == 0) {$scope.hashow = true;}
        $scope.disarr = data.data[0].paper;
        $scope.title = data.data[0].paperItems;
        $scope.paperChannel = data.data[0].payChannel;
        for (var i = 0; i < $scope.disarr.groups.length; i++) {
          var keys = $scope.disarr.groups[i].boundItemKeys;
          if (keys) {
            for (var a = 0; a < $scope.title.length; a++) {
              if ($scope.disarr.groups[i].key == $scope.title[a].key) {
                var groupname = $scope.title[a].title;
                $("#into_detail").append($("<div class='bs-example bs-example-form " + $scope.disarr.groups[i].key + "'>" +
                  "<h4><span></span><p>" + groupname + "</p></h4>" +
                  "</div>"+
                  "<div class='bs-example bs-example-form Channel'>" +
                  "<h4><span></span><p>通道参数</p></h4>" +
                  "</div>"));
              }
            }
            addInput($scope.disarr.groups[i].key, $scope.title, keys, $scope.paper, $scope.url, $scope.acc);
          }
        }
        $('#into_detail .Channel').append($("<ul class='sheB Input'></ul>"));
        for(var i=0;i<$scope.paperChannel.length;i++){
          if($scope.obj.channel_name==$scope.paperChannel[i].name){
            if($scope.paperChannel[i].device_info){
              var device_name=$scope.paperChannel[i].device_info[1].title;
              var device_en=$scope.paperChannel[i].device_info[0].title;
              var device_key=$scope.paperChannel[i].device_info[1].key;
              var device_key_en=$scope.paperChannel[i].device_info[0].key;
              $('#into_detail .sheB').append($("<li class='col-xs-4 sheBf'>设备列表<img src='img/add.png' alt='' style='margin-left: 1em'></li><hr>"));
              var strB='',red='',xin='';
              if($scope.paperChannel[i].device_info[0].validator){
                red='required';
                xin='*';
              }else {red='';xin=''};
              if($scope.paperChannel[i].device_info[2]){
                var device_key2=$scope.paperChannel[i].device_info[2].key;
                var device_name2=$scope.paperChannel[i].device_info[2].title;
                strB="<li class='col-xs-12 sheBli'>"+
                  "<span style='color:red;float: left;margin-right: 5px;line-height: 34px;'>"+xin+"</span><input type='text' id='"+device_key_en+"_1' name='"+device_key_en+"' placeholder='"+device_en+"' class='col-xs-3 form-control' "+red+">"+
                  "<div class='suggest clear col-xs-3'><ul></ul></div>"+
                  "<input type='text' id='"+device_key+"_1' name='"+device_key+"' placeholder='"+device_name+"' class='col-xs-3 form-control' "+red+">"+
                  "<input type='text' id='"+device_key2+"_1' name='"+device_key2+"' placeholder='"+device_name2+"' class='col-xs-3 form-control' "+red+">"+
                  "<span onclick='rem(this)' class='left'><img src='img/delete.png' alt=''></span>"+
                  "<p class='Verr'></p>"+
                  "</li>";
              }else {
                strB="<li class='col-xs-12 sheBli'>"+
                  "<span style='color:red;float: left;margin-right: 5px;line-height: 34px;'>"+xin+"</span><input type='text' id='"+device_key_en+"_1' name='"+device_key_en+"' placeholder='"+device_en+"' class='col-xs-4 form-control' "+red+">"+
                  "<div class='suggest clear col-xs-4'><ul></ul></div>"+
                  "<input type='text' id='"+device_key+"_1' name='"+device_key+"' placeholder='"+device_name+"' class='col-xs-4 form-control' "+red+">"+
                  "<span onclick='rem(this)' class='left'><img src='img/delete.png' alt=''></span>"+
                    "<p class='Verr'></p>"+
                  "</li>";
              }
              $(strB).insertAfter($('#into_detail .sheB hr'));
            }
            addParams($scope.paperChannel[i].params,$scope.channelP,$scope.channelD,$scope.paperChannel[i].device_info,$scope.acc,$scope.url);
            if($scope.paperChannel[i].params){
              for(var j=0;j<$scope.paperChannel[i].params.length;j++){
                if(!$scope.paperChannel[i].params[j].scope){paramS[$scope.paperChannel[i].params[j].key]='';};
              }
            }
          }
          if($scope.paperChannel[i].templateId)$scope.templateId=$scope.paperChannel[i].templateId;
        }
        if($scope.type==2||$scope.userType==2){addDiv($scope.userId,$state.params.wo_id);}else {enc()}
        var EN_NUM=2;
        $("#into_detail .sheB .sheBf").click(function () {
          if(device_key2){
            strB="<li class='col-xs-12 sheBli'>"+
              "<span style='color:red;float: left;margin-right: 5px;line-height: 34px;'>"+xin+"</span><input type='text' id='"+device_key_en+"_"+EN_NUM+"' name='en' placeholder='"+device_en+"' class='col-xs-3 form-control' "+red+">"+
              "<div class='suggest clear col-xs-3'><ul></ul></div>"+
              "<input type='text' id='"+device_key+"_"+EN_NUM+"' name='"+device_key+"' placeholder='"+device_name+"' class='col-xs-3 form-control' "+red+">"+
              "<input type='text' id='"+device_key2+"_"+EN_NUM+"' name='"+device_key2+"' placeholder='"+device_name2+"' class='col-xs-3 form-control' "+red+">"+
              "<span onclick='rem(this)' class='left'><img src='img/delete.png' alt=''></span>"+
              "<p class='Verr'></p>"+
              "</li>";
          }else {
            strB="<li class='col-xs-12 sheBli'>"+
              "<span style='color:red;float: left;margin-right: 5px;line-height: 34px;'>"+xin+"</span><input type='text' id='"+device_key_en+"_"+EN_NUM+"' name='en' placeholder='"+device_en+"' class='col-xs-4 form-control' "+red+">"+
              "<div class='suggest clear col-xs-4'><ul></ul></div>"+
              "<input type='text' id='"+device_key+"_"+EN_NUM+"' name='"+device_key+"' placeholder='"+device_name+"' class='col-xs-4 form-control' "+red+">"+
              "<span onclick='rem(this)' class='left'><img src='img/delete.png' alt=''></span>"+
              "<p class='Verr'></p>"+
              "</li>";
          };
          $('#into_detail .sheB').append($(strB));
          EN_NUM++;
          if($scope.type==2||$scope.userType==2){addDiv($scope.userId,$state.params.wo_id);}else {enc()}
        });
        if($("#into_detail .sheB li").length==0)$('.Channel').css('display','none');
        $("#into_detail .fileInput").on("change", function () {
          var parents = $(this).parent();
          var filename = this.name;
          var fileval = $(this).val();
          var fileE = parents[0].nextSibling.classList;
          var parentLi = $(parents[0]).parent();
          var lastChild = parentLi[0].lastChild;
          var nextT=true;
          var files = Array.prototype.slice.call(this.files);
          if (fileval.lastIndexOf(".") != -1) {
            var str = fileval.substr(1);
            var strs = str.split(".");
            if(fileE.length>1){
              for(var i=0;i<fileE.length;i++){
                if (fileE[i]!="col-xs-offset-2") {
                  if (fileE[i] == strs[strs.length - 1].toLowerCase()) {
                    lastChild.innerHTML = "上传中,请稍后...";
                    nextT=false;
                    break;
                  }
                }
              }
            }else {
              lastChild.innerHTML = "上传中,请稍后...";
              nextT=false;
            }
            if(nextT){
              fileval = "";
              $(this).val("")
              $('#alert').css('display','block');
              $('#alert .modal-body').html("您上传的文件不符合要求！请重新上传！");
              lastChild.innerHTML = "";
              $(this).prev().html('');
              $(this).next().next().val('')
            }
          };
          files.forEach(function (file) {
            if(file.size/1024 >3072){
              $('#alert').css('display','block');
              $('#alert .modal-body').html('文件过大，请重新选择');
              fileval = "";
              $(this).val("")
              lastChild.innerHTML = "";
              $(this).prev().html('');
              $(this).next().next().val('')
            };
          });
          var reg=new RegExp(/\\|\/+/);
          var s='';
          if(reg.test(fileval)){
            s=fileval.split(reg)[fileval.split(reg).length-1];
          }else {
            s=fileval;
          }
          $(this).next().val(s);
          var me=this;
          if (fileval) {
            parents.ajaxSubmit(
              {success: function (data) {
                var file = JSON.parse(data).data;
                if(JSON.parse(data).code==0){
                  var href = file[0].url + "?accessToken=" + file[0].accessToken;
                  lastChild.innerHTML = "<a href='"+href+"' target='_blank'>上传成功,可点击下载查看</a>";
                  callback(filename, file[0].fileKey);
                  $(me).val("");
                  $(me).prev().html(s);
                  $(me).next().next().val(file[0].fileKey)
                }else {
                  lastChild.innerHTML = "上传失败,请重新选择";
                  $(me).val("");
                  $(me).prev().html('');
                  $(me).next().next().val('')

                }
              },
              error: function () {
                lastChild.innerHTML = "上传失败,请重新选择";
                $(me).val("");
                $(me).prev().html('');
                $(me).next().next().val('')

              }
            })
          }
        });//上传文件
        $('#create_key_pair').on('click', function () {
          var key_pair=new Object();
          decorateBody( key_pair);
          $http.post(config.api+'/webWo/genRsaKey',key_pair).success(function (data) {
            if(data.code==0){
              if($('#public_key'))$('#public_key').val(data.data.public_key);
              if($('#private_key'))$('#private_key').val(data.data.private_key);
            }
          })
        })//生成秘钥对
        $('#into_detail div[data-target="#myModal"]').on('click', function () {
          var htmlR="<label>RSA公钥PEM文件</label>"+
            "<label for='public_key_pem' class='btn btn-info' style='margin-bottom: 5px;margin-left: 1em'>上传文件</label><span></span>"+
            "<input type='file' id='public_key_pem' name='public_key_pem' style='display: none'/>"+
            "<textarea id='rsa_public_key' rows='4' class='form-control' style='width: 100%'></textarea>"+
            "<label>RSA私钥PEM文件（PKCS8格式）</label>"+
          "<label for='private_key_pkcs8_pem' class='btn btn-info' style='margin-bottom: 5px;margin-left: 1em'>上传文件</label><span></span>"+
            "<input type='file' id='private_key_pkcs8_pem' name='private_key_pkcs8_pem' style='display: none'/>"+
            "<textarea id='rsa_private_key' rows='8' style='width: 100%' class='form-control'></textarea>";
          if(this.id=='rsa_key_file_import'||this.id=='mob_rsa_key_file_import'){
            $('#myModal .modal-body').html(htmlR);
            $('#myModal .modal-header h4').html('选择文件');
            $('#myModal .modal-header p').html('请分别选择匹配的RSA公钥及私钥导入，系统自动提取需要的密钥串，以免避免手工复制粘贴时出错。');
            $('#public_key_pem').on('change',function () {handleFiles('RSA_PUBLIC',this,document.getElementById('rsa_public_key'))});
            $('#private_key_pkcs8_pem').on('change',function () {handleFiles('RSA_PRIVATE', this, document.getElementById('rsa_private_key'))});
            $('#myModal button.btn-primary').on('click', function () {
            if($('#rsa_private_key').val()&&$('#rsa_public_key').val()){
              if(matchRSAKeypair($('#rsa_public_key').val(),$('#rsa_private_key').val())){
                $('#public_key').html($('#rsa_public_key').val());
                $('#private_key').html($('#rsa_private_key').val());
              }
            }
          })};
        })//上传秘钥对
        $('#into_detail .img-li li').on('mouseenter', function () {
          $(this).children()[0].lastChild.style.display = 'block';
          var div = $(this).children()[0].lastChild;
          var resize_width=$window.innerWidth;
          if ($(div).children().length < 3) {
            $(div).children()[0].style.marginLeft = resize_width >=768 ? '30%' : '20%';
          }
        })
        $('#into_detail .img-li li').on('mouseleave', function () {
          $(this).children()[0].lastChild.style.display = 'none';
        })
        $('#into_detail .img-li li').on('touchstart', function () {
          $(this).children()[0].lastChild.style.display = 'block';
          var div = $(this).children()[0].lastChild;
          var resize_width=$window.innerWidth;
          if ($(div).children().length < 3) {
            $(div).children()[0].style.marginLeft = resize_width >=768 ? '30%' : '20%';
          }
        });//手机触摸事件
        $('#into_detail .img-li li').on('touchend',function () {
          var me=this;
          var timer=setTimeout(function () {
            $(me).children()[0].lastChild.style.display = 'none';
            clearTimeout(timer);
          },3000)
        });
        $("#into_detail .img-li input[type='file']").on("change", function () {
          var resize_width=$window.innerWidth;
          var parents = $(this).parent();
          var backDiv = parents[0].firstChild.firstChild;
          var div_parent=backDiv.nextSibling;//背景上传进度
          var div_height=$(backDiv).height();
          var back_height=$(backDiv).height();
          var filename = this.name;
          var fileval = $(this).val();
          var inputTxt = this.nextSibling;
          var p = parents.next().children()[1];
          var btnLabel=parents[0].lastChild.firstChild;
          $(btnLabel).attr('disabled',true);
          var files = Array.prototype.slice.call(this.files);
          var me=this;
          var reader = new FileReader();
          files.forEach(function (file, i) {
            if (!/\/(?:jpeg|png)/i.test(file.type)){
              $('#alert').css('display','block');
              $('#alert .modal-body').html('图片格式不符合，请重新选择');
              fileval='';
              $(btnLabel).removeAttr('disabled');
              $(me).val('');
            };
            if(file.size/1024 >3072){
              $('#alert').css('display','block');
              $('#alert .modal-body').html('图片过大，请重新选择');
              fileval='';
              $(btnLabel).removeAttr('disabled');
              $(me).val('');
            };
            reader.onload = function () {
              var result = this.result;
              var img = new Image();
              img.src = result;
              var width = img.width;
              var height = img.height;
              if(width>5000||height>5000){
                $('#alert').css('display','block');
                $('#alert .modal-body').html('图片尺寸过大，请重新选择');
                $(btnLabel).removeAttr('disabled');
                $(me).val('');
              }
              if(width<5000&&height<5000){
                if (fileval) {
                  $(div_parent).css('display','block')
                  var sum = parseInt(Math.random() * 11 + 10);
                  var loop = setInterval(function () {
                    div_height--;
                    $(div_parent).css("height", div_height + "px");
                    if (div_height == sum) {
                      clearInterval(loop)
                    }
                  }, 10);
                  parents.ajaxSubmit({
                    success: function (data) {
                      var file = JSON.parse(data).data;
                      if (JSON.parse(data).code == 0) {
                        $(inputTxt).val(file[0].fileKey)
                        callback(filename, file[0].fileKey);
                        if(resize_width>=768)p.style.display = 'none';
                        changeUrl(backDiv, me);
                        $(btnLabel).removeAttr('disabled');
                        $(me).val('');
                        $(div_parent).animate({"height": 0}, 500, function () {
                          div_parent.style.display = "none";
                          $(div_parent).css("height",back_height + "px");
                        });
                      } else {
                        backDiv.style.backgroundImage = "url(img/pic.png)";
                        if(resize_width>=768)p.style.display = 'block';
                        $(btnLabel).removeAttr('disabled');
                        $('#alert').css('display','block');
                        $('#alert .modal-body').html('上传失败！');
                        $(me).val('');
                        div_parent.style.display = "none";
                        $(div_parent).css("height",back_height + "px");
                      }
                    },
                    error: function () {
                      backDiv.style.backgroundImage = "url(img/pic.png)";
                      if(resize_width>=768)p.style.display = 'block';
                      $(btnLabel).removeAttr('disabled');
                      $('#alert').css('display','block');
                      $('#alert .modal-body').html('上传失败！');
                      $(me).val('');
                      div_parent.style.display = "none";
                      $(div_parent).css("height",back_height + "px");
                    }
                  })
                }
              }
            };
            reader.readAsDataURL(file);
          });
        });//上传图片
        $("#into_detail .img-li .off").on("click", function () {
          var divUrl = $(this).parent().parent()[0].firstChild.firstChild;
          var input = $(divUrl).parent()[0].nextSibling.nextSibling;
          var resize_width=$window.innerWidth;
          divUrl.style.backgroundImage = "url(img/pic.png)";
          input.value = "";
          $("#"+$(this.previousSibling).attr('for')).val('');
          $(this.previousSibling).removeAttr('disabled');
          if(resize_width>=768){
            $(this).parent().parent().next().children()[1].style.display='block';
          }
          callback(input.name, input.value)
        });//删除已上传的图片
        $('.iframeA').on('click',function (e) {
          e.preventDefault();
          $('body').css('overflow','hidden');
          this.firstChild.style.display='block';
          this.nextSibling.style.display='block';
          this.firstChild.firstChild.src=this.firstChild.lastChild.textContent;
          this.firstChild.style.overflow='hidden';
        });//手机打开帮助页面
        $('.colseI').on('click',function () {
          $('body').css('overflow','');
          this.previousSibling.firstChild.style.display='none';
          this.style.display='none';
        });//手机关闭帮助页面
        var inputL = $('#into_detail li>input');
        var textarea = $('#into_detail textarea');
        for (var j = 0; j < textarea.length; j++) {
          textarea[j].onblur = function () {
            if(this.validity.valid == false){
              $(this).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
            }else {
                $(this).parent()[0].lastChild.innerHTML="";
            }
          }
        };
        if($('#mcode_store_batches')[0]&&$('#keywords_storename_batches')[0]){
          function mcodeR() {
            if($('#mcode_store_batches').val()||$('#keywords_storename_batches').val()){
              $('#keywords_storename_batches').attr('required','required');
              $('#mcode_store_batches').attr('required','required');
              if($('#mcode_store_batches').val()){
                var Reg=new RegExp(/^\d+(,\d+)*$/);
                if(Reg.test($('#mcode_store_batches').val())){
                  $('#mcode_store_batches').parent()[0].lastChild.innerHTML="";
                }else {
                  $('#mcode_store_batches').parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
                }
              }else {
                if($('#keywords_storename_batches').val())$('#mcode_store_batches').parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
              }
            }else {
              $('#mcode_store_batches').removeAttr('required');
              $('#keywords_storename_batches').removeAttr('required');
              $('#keywords_storename_batches').parent()[0].lastChild.innerHTML="";
              $('#mcode_store_batches').parent()[0].lastChild.innerHTML="";
            }
          }
          $('#mcode_store_batches')[0].onblur = function () {mcodeR()}
          $('#keywords_storename_batches')[0].onblur = function () {mcodeR()}
        };
        for (var i = 0; i < inputL.length; i++) {
          inputL[i].onblur = function () {
            if(this.validity.valid == false){
              $(this).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
            }else {
              if(this.type!='button'){
                $(this).parent()[0].lastChild.innerHTML="";
              }
            }
          }
        };
        function img768(t) {
          function width(num) {
            var resize_width=$window.innerWidth;
            var resize_height=$window.innerHeight;
            if ($(t).width() > num) {
              $(t).removeClass("zindex");
              $(t).height("");
              $(t).width("");
              $(t)[0].firstChild.style.height = "";
              $(t)[0].firstChild.style.width = "";
              t.lastChild.style.display='none';
              $('body').css('overflow','')
            } else {
              $(t).addClass("zindex");
              $('body').css('overflow','hidden');
              if (resize_width >=768) {
                $(t)[0].firstChild.style.width = resize_width / 2 + "px";
                if(resize_width / 2>resize_height){
                  $(t)[0].firstChild.style.height =resize_height + "px"
                } else {$(t)[0].firstChild.style.height =resize_width / 2 + "px"};
                $(t).width(resize_width);
                $(t).height('100%');
                t.lastChild.style.display='block';
              } else {
                $(t)[0].firstChild.style.height =resize_width + "px";
                $(t)[0].firstChild.style.width = resize_width + "px";
                $(t).width(resize_width);
                $(t).height('100%');
                t.lastChild.style.display='none';
              }
            }
          }
          if ($(t).width() == 180) {
            width(180)
          } else {
            width(120)
          }
        };
        $("#into_detail .img-li form div:first-child").on("click", function () {
          if (this.firstChild) {
            var imgurl = this.firstChild.style.backgroundImage;
            if (imgurl.lastIndexOf('img/pic.png')== -1) {
              img768(this)
            }
          }
        })
      }else {
        $('#alert').css('display','block');
        $('#alert .modal-body').html(data.info);
        $('#alert button').on('click',function () {
          $("#basic").removeClass("ng-hide");
          $state.go('basic');
          $('#into button').removeAttr('disabled');
        })
      }
    }).error(function () {
      $('#alert').css('display','block');
      $('#alert .modal-body').html('链接失败');
      $('#alert button').on('click',function () {
        $("#basic").removeClass("ng-hide");
        $state.go('basic');
        $('#into button').removeAttr('disabled');
      })
    })
  }else {$state.go('basic');}
  var arrobj = new Object();
  var paper=new Object();
  $scope.submit = function () {
    if($('#mcode_store_batches').val()||$('#keywords_storename_batches').val()){
      $('#keywords_storename_batches').attr('required','required');
      $('#mcode_store_batches').attr('required','required');
    }else {
      $('#mcode_store_batches').removeAttr('required');
      $('#keywords_storename_batches').removeAttr('required');
      if($('#keywords_storename_batches').parent()[0])$('#keywords_storename_batches').parent()[0].lastChild.innerHTML="";
      if($('#mcode_store_batches').parent()[0])$('#mcode_store_batches').parent()[0].lastChild.innerHTML="";
    };
    $scope.thss =new Object();
    var en=[],tno=[],uno=[],liInput=$('#into_detail li>input'),inputEnP=$('#into_detail .sheBli p');
    for(var p=0;p<inputEnP.length;p++){
      if(inputEnP[p].innerHTML){
        $('#into_detail .sheBli input[name="en"]')[p].focus();
        return false;
      }
    };
    for(var i=0;i<liInput.length;i++){
      if(liInput[i].validity.valid==false
        ||(liInput[i].required&&Sys.liulan=='safari'&&liInput[i].attributes['minlength']&&liInput[i].value.length<liInput[i].attributes['minlength'].nodeValue)
        ||(liInput[i].required&&Sys.liulan=='firefox'&&liInput[i].attributes['minlength']&&liInput[i].value.length<liInput[i].attributes['minlength'].value)
      ){
        liInput[i].focus();
        $(liInput[i]).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
        return false;
      }
      if(liInput[i].name=='en'&&liInput[i].value){en.push($.trim(liInput[i].value))};
      if(liInput[i].name=='tno'&&liInput[i].value){tno.push($.trim(liInput[i].value))};
      if(liInput[i].name=='uno'&&liInput[i].value){uno.push($.trim(liInput[i].value))};
      $scope.thss[liInput[i].name]=$.trim(liInput[i].value);
    };
    var inputF = $('#into_detail ul li form input');
    for(var f=0;f<inputF.length;f++){
      if(inputF[f].validity.valid==false){
        $('#alert').css('display','block');
        $('#alert .modal-body').html($(inputF[f]).parent()[0].firstChild.textContent+"未上传");
        return false;
      }
      $scope.thss[inputF[f].name]=inputF[f].value;
    };
    for(var i=0;i<$('#into_detail textarea').length;i++){
      if($('#into_detail textarea')[i].validity.valid==false){
        $('#into_detail textarea')[i].focus();
        $($('#into_detail textarea')[i]).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
        return false;
      }
      var textareaV=$.trim($('#into_detail textarea')[i].value);
      textareaV= textareaV.replace(/[ ]/g, ""); //去掉空格
      textareaV= textareaV.replace(/[\r\n]/g, ""); //去掉回车换行
      $scope.thss[$('#into_detail textarea')[i].name]=textareaV;
    };
    for(var i=0;i<$('#into_detail select').length;i++){
      var optios=$('#into_detail select')[i].options;
      for(var j=0;j<optios.length;j++){
        if(optios[j].selected){
          $scope.thss[$('#into_detail select')[i].name]=optios[j].value;
        }
      }
    };
    //$scope.thss = $('#into_detail').serializeObject();
    $scope.thss.en=en;
    $scope.thss.tno=tno;
    $scope.thss.uno=uno;
    for(var i=0;i<$scope.disarr.groups[0].boundItemKeys.length;i++){
      var keys=$scope.disarr.groups[0].boundItemKeys[i];
      for(var key in $scope.thss){
        if(keys==key){paper[keys]=$scope.thss[key]}
      }
    }
    paper.ext={
      pay_mode_id:parseInt($scope.obj.pay_mode_id),
      salesman_name:$scope.obj.salesman_name,
      salesman_branch:$scope.obj.salesman_branch,
      salesman_phone:$scope.obj.salesman_phone,
      salesman_type:$scope.obj.salesman_type,
      enlist:[],
      pay_mode_list:[],
      userId:$scope.userId
    };
    paper.ext.pay_mode_list[0]=parseInt($scope.obj.pay_mode_id);
    if($scope.thss.en.length){
      for(var i=0;i<$scope.thss.en.length;i++){
        if($scope.thss.uno.length){
          paper.ext.enlist[i]={en:$scope.thss.en[i],tno:$scope.thss.tno[i],uno:$scope.thss.uno[i]}
        }else {
          paper.ext.enlist[i]={en:$scope.thss.en[i],tno:$scope.thss.tno[i]}
        }
      }
    }
    arrobj.paper_channel=$scope.type;
    arrobj.mcode=$scope.obj.mcode;
    arrobj.merchant_name=$scope.obj.merchant_name;
    arrobj.payChannel=[{
      pay_mode_id:$scope.obj.pay_mode_id,
      pay_mode_name:pay_mode_name,
      id:$scope.obj.channel_id,
      name:$scope.obj.channel_name,
      params:{},
      device_info:[]
    }];
    if($scope.templateId)arrobj.payChannel[0].templateId=$scope.templateId;
    if($scope.userType)paper.ext.userType=$scope.userType;
    arrobj.payChannel[0].device_info=paper.ext.enlist;
    arrobj.payChannel[0].params=paramS;
    arrobj.paper=paper;
    arrobj.paper.ref_store={
      mcode:$scope.obj.ref_store_mcode,
      name:$scope.obj.ref_store_name
    };
    for(var key in $scope.thss){
      for(var i in arrobj.payChannel[0].params){
        if(key==i){
          arrobj.payChannel[0].params[i]=$scope.thss[key]
        }
      }
    }
    for(var k in obj){arrobj.paper[k]=obj[k];}
    decorateBody(arrobj);
    var keyworks=new Object();
    keyworks.mcodes=arrobj.paper.mcode_store_batches;
    keyworks.store_name_keyword=arrobj.paper.keywords_storename_batches;
    keyworks.publicKey=arrobj.payChannel[0].params.public_key;
    keyworks.privateKey=arrobj.payChannel[0].params.private_key;
    decorateBody(keyworks);
    var getpay=new Object();
    getpay.mcode=$scope.obj.mcode;
    getpay.pay_mode_id=$scope.obj.pay_mode_id;
    getpay.pay_channel_id=$scope.obj.channel_id;
    if($scope.templateId)getpay.templateId=$scope.templateId;
    decorateBody(getpay);
    var addtogo=false;
    var params_id=$state.params.wo_id||$scope.dataToken.wo_id;
    //$('.btnL .btn-success').attr('disabled',true);
    $scope.goToB=function (id) {
      if(id)arrobj.wo_id=id;
      $('#wodang').css('display','block');
      $scope.getpay=$http.post(config.api+'/wo/updateApplyConfigWorkOrder',arrobj).success(function (data) {
        if(data.code==0){
          $scope.success=true;
          $scope.hideF=true;
          $('.breadcrumb').css('display','none');
          $scope.href='../workorder/query.html#/detail/'+id;
        }else {
          $('#alert').css('display','block');
          $('#alert .modal-body').html(data.info);
          $('.btnL .btn-success').removeAttr('disabled');
          $('#wodang').css('display','none');
        }
      }).error(function () {
        $('.btnL .btn-success').removeAttr('disabled');
        $('#alert').css('display','block');
        $('#alert .modal-body').html('请求超时，请稍后重试');
        $('#wodang').css('display','none');
      })
    };
    $scope.goTo =function(){
      $('#wodang').css('display','block');
      $scope.getpay=$http.post(config.api+'/wo/createApplyConfigWorkOrder',arrobj).success(function (data) {
        if(data.code==0){
          /*$scope.success=true;
          $scope.hideF=true;
          $('.breadcrumb').css('display','none');
          $scope.href='../workorder/query.html#/detail/'+data.data[0].wo_id;*/
          if($scope.success_url){
            $scope.btn_success=true;
            if($scope.success_url.lastIndexOf("?") != -1){
              $scope.success_a=$scope.success_url+"&dataToken="+data.data[0].dataToken;
            }else {
              $scope.success_a=$scope.success_url+"?dataToken="+data.data[0].dataToken;
            }
            /*var click_a=true;
             $('.msg a.btn').on('click',function () {click_a=false;});
             if(click_a)$window.onunload=function () {$http.get($scope.success_a);}*/
            document.location.href=$scope.success_a;
          }else {
            $scope.success=true;
            $scope.hideF=true;
            $('.breadcrumb').css('display','none');
            $scope.href='../workorder/query.html#/detail/'+data.data[0].wo_id;
          };
        }else {
          $('.btnL .btn-success').removeAttr('disabled');
          $('#alert').css('display','block');
          $('#alert .modal-body').html(data.info);
          $('#wodang').css('display','none');
        }
      }).error(function () {
        $('.btnL .btn-success').removeAttr('disabled');
        $('#alert').css('display','block');
        $('#alert .modal-body').html('请求超时，请稍后重试');
        $('#wodang').css('display','none');
      })
    };
    $scope.addWorkOrder=function () {
      $scope.getpay=$http.post(config.api+'/webWo/getPayInfoByMcode',getpay).success(function (data) {
        if(data.code==0){
          if(data.data.length&&data.data[0].pay_channel_list.length){
            var params=data.data[0].pay_channel_list[0].params,keyArr=[],keyArry=[],undefArr=[];
            if($scope.paperChannel.length){
              for(var b=0;b<$scope.paperChannel.length;b++){
                if($scope.paperChannel[b].name==$scope.obj.channel_name){
                  for(var a=0;a<$scope.paperChannel[b].params.length;a++){
                    if($scope.paperChannel[b].params[a].type=="text"||$scope.paperChannel[b].params[a].type=="textarea"||$scope.paperChannel[b].params[a].type=="select")keyArry.push($scope.paperChannel[b].params[a].title)
                  }
                }
              }
            };
            if(params.length&&isEmptyObject(arrobj.payChannel[0].params)==false){
              for(var k in arrobj.payChannel[0].params){
                for(var i=0;i<params.length;i++){
                  if(params[i].type=="text"||params[i].type=="textarea"||params[i].type=="select"){
                    if(params[i].value==arrobj.payChannel[0].params[k]){keyArr.push(params[i].title)}
                    if(params[i].value==undefined){undefArr.push(params[i].title)};
                  }
                }
              }
            }
            if(keyArr.length){
              for(var j=0;j<keyArr.length;j++){
                for(var ky=0;ky<keyArry.length;ky++){
                  if(keyArry[ky]==keyArr[j])keyArry.splice(ky,1)
                }
              }
            };
            if(undefArr.length){
              for(var u=0;u<undefArr.length;u++){
                for(var ky=0;ky<keyArry.length;ky++){
                  if(keyArry[ky]==undefArr[u])keyArry.splice(ky,1)
                }
              }
            };
            $('#detail_confirm').css('display','block');
            if(keyArry.length){
              $('#detail_confirm .modal-body').html("当前通道已配置过收银参数，本次提交的参数中“"+keyArry.join('，')+"”与原有参数不同，您确认要继续操作？");
            }else {
              $('#detail_confirm .modal-body').html("当前通道已配置过收银参数，继续操作将覆盖现有参数！确认要继续操作？");
            }
            addtogo=true;
            $('#detail_confirm .ok').on('click',function () {
              $('#detail_confirm').css('display','none');
              if(addtogo){if(params_id){
                $scope.goToB(params_id);
              }else {$scope.goTo()};}
            })
            $('#detail_confirm .no').on('click',function () {
              addtogo=false;
              $('#detail_confirm').css('display','none');
              $('.btnL .btn-success').removeAttr('disabled');
            })
          }else {
            addtogo=true;
            if(params_id){
              $scope.goToB(params_id);
            }else {$scope.goTo()};
          }
        }else {
          $('#alert').css('display','block');
          $('#alert .modal-body').html("链接失败，请稍后重试");
          $('.btnL .btn-success').removeAttr('disabled');
        }
      }).error(function () {
        $('#alert').css('display','block');
        $('#alert .modal-body').html("链接失败，请稍后重试");
        $('.btnL .btn-success').removeAttr('disabled');
      })
    }
    $scope.addWork=function () {
      if($scope.type==2||$scope.userType==2){
       var inputL = $('.sheB .sheBli input[name="en"]');
       var yanP = $('.sheB .sheBli p');
       if($scope.thss.en.length){
         for(var i=0;i<yanP.length;i++){
          if(inputL[i].value&&yanP[i].innerHTML){
           inputL[i].focus();
           return false;
          }
         }
         var enT=new Object();
         enT.en=$scope.thss.en[$scope.thss.en.length-1];
         enT.agentId=$scope.userId;
         if(params_id)enT.wo_id=params_id;
         decorateBody(enT);
         $http.post(config.api+'/merchant/checkEn',enT).success(function (data) {
          if(data.code!=0){
            yanP[yanP.length-1].innerHTML="&nbsp;"+data.info;
            inputL[inputL.length-1].focus();
            //$('.btnL .btn-success').removeAttr('disabled');
          }else {
            yanP[yanP.length-1].innerHTML="";
            $scope.addWorkOrder();
          }
         }).error(function () {
           yanP[yanP.length-1].innerHTML="&nbsp;验证超时";
           inputL[inputL.length-1].focus();
           //$('.btnL .btn-success').removeAttr('disabled');
         })
        }else {$scope.addWorkOrder();}
       }else {//测试暂时放开en验证
      $scope.addWorkOrder();
      }
    }
    if(keyworks.mcodes&&keyworks.store_name_keyword){
      $http.post(config.api+'/merchant/checkMcodes',keyworks).success(function (data) {
        if(data.code==0){
          $scope.addWork()
        }else {
          $('#mcode_store_batches')[0].focus();
          $('#alert').css('display','block');
          $('#alert .modal-body').html('连锁店名关键词和连锁门店配置列表mcode不匹配，请重新输入');
          $('.btnL .btn-success').removeAttr('disabled');
        }
      }).error(function () {
        $('#alert').css('display','block');
        $('#alert .modal-body').html('请求超时，请稍后重试');
        $('.btnL .btn-success').removeAttr('disabled');
      })
    }
    else if(keyworks.publicKey&&keyworks.privateKey){
      $http.post(config.api+'/webWo/validateRSAKeypair',keyworks).success(function (data) {
        if(data.code==0){
          $scope.addWork()
        }else {
          $('#alert').css('display','block');
          $('#alert .modal-body').html('公私钥不匹配，请重新输入');
          $('.btnL .btn-success').removeAttr('disabled');
        }
      }).error(function () {
        $('#alert').css('display','block');
        $('#alert .modal-body').html('请求超时，请稍后重试');
        $('.btnL .btn-success').removeAttr('disabled');
      })
    } else {
      $scope.addWork();
    }
  };
})
