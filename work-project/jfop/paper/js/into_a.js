var app = angular.module('myapp', ['ng', 'ui.router', 'cgBusy']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/into_a');
  $stateProvider.state("into_a", {
    url: "/into_a?mcode&merchant_name&dataToken",
    templateUrl: 'tal/into_a.html',
    controller: 'into_a'
  })
  $stateProvider.state("into_a.into_detail", {
    url: "/into_detail",
    templateUrl: 'tal/into_detail.html',
    controller: 'into_detail'
  })
}]);
app.value('cgBusyDefaults',{
  message:'玩命加载中...',
  backdrop: false,
});
app.controller("into_a", function ($scope, $http, $state, $window, $rootScope) {
  $scope.dataToken = new Object();
  $scope.obj=new Object();
  $scope.theRequest=new Object();
  decorateBody($scope.dataToken);
  var payt=new Object();
  payt.channel_operated_type='self';
  decorateBody(payt);
  if ($scope.dataToken.dataToken) {
    $('#wodang').css('display','block');
    $scope.startLod=$http.post(config.api + '/common/getData', $scope.dataToken).success(function (data) {
      if (data.code == 0) {
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
          $scope.salesman_name = data.data[0].data.salesman_name;
          $scope.salesman_type = data.data[0].data.salesman_type;
          if (data.data[0].data.salesman_type)$('input[name="salesman_type"]').attr('readonly', true);
          $scope.salesman_branch = data.data[0].data.salesman_branch;
          if (data.data[0].data.salesman_branch)$('input[name="salesman_branch"]').attr('readonly', true);
          $scope.salesman_phone = data.data[0].data.salesman_phone;
          $scope.mcode = data.data[0].data.mcode;
          if(data.data[0].data.mcode)$('input[name="mcode"]').attr('readonly', true);
          $scope.merchant_name = data.data[0].data.merchant_name;
          if(data.data[0].data.merchant_name)$('input[name="merchant_name"]').attr('readonly', true);
          $('#into .btn-info').removeAttr('disabled');
          if(data.data[0].data.userType)$scope.userType=parseInt(data.data[0].data.userType);
          if(data.data[0].data.callback_url){
            if(data.data[0].data.callback_url.success_url)$scope.success_url=data.data[0].data.callback_url.success_url;
            if(data.data[0].data.callback_url.error_url)$scope.error_url=data.data[0].data.callback_url.error_url;
          };
        }
        if($scope.type==2||$scope.userType==2){addDiv($scope.userId);}else {enc();}
        $scope.payLi=$http.post(config.api+'/pay/getPayMode',payt).success(function (data) {
          $('#wodang').css('display','none');
          if(data.code==0){
            for(var i=0;i<data.data.length;i++){
              var str="<li ><input type='radio' name='pay_mode_id' value='"+data.data[i].pay_mode_id+"' id='"+data.data[i].pay_mode_id+"'><label for='"+data.data[i].pay_mode_id+"'>"+data.data[i].pay_mode_name+"</label></li>"
              $('.jinJ .pay').append($(str));
            }
            if(data.data[0].channel.length){
              for(var v=0;v<data.data[0].channel.length;v++){
                if(data.data[0].channel[v].valid){
                  $('.jinJ .zhif_sold').append($("<li><input type='radio' name='channel_id' value='"+data.data[0].channel[v].id+"' id='"+data.data[0].channel[v].id+"'><label for='"+data.data[0].channel[v].id+"'>"+data.data[0].channel[v].name+"</label></li>"));
                }
              };
            }
            var required1=data.data[0].channel[0].required;
            if(required1.companyNature&&required1.companyNature.length){
              for(var c=0;c<required1.companyNature.length;c++){
                $('.jinJ .companyX').append($("<li ><input type='radio' name='company_nature' onclick='show3(this)' value='"+required1.companyNature[c]+"' id='company"+c+"'><label for='company"+c+"'>"+required1.companyNature[c]+"</label></li>"));
              }
            };
            if(required1.soldAccountType&&required1.soldAccountType.length){
              for(var s=0;s<required1.soldAccountType.length;s++){
                $('.jinJ .sold').append($("<li ><input type='radio' name='sold_account_type' onclick='show3(this)' value='"+required1.soldAccountType[s]+"' id='sold_account"+s+"'><label for='sold_account"+s+"'>"+required1.soldAccountType[s]+"</label></li>"));
              }
            };
            $('.jinJ .pay li').first().addClass('actv');
            $('.jinJ .pay li input')[0].checked=true;
            $('.jinJ .zhif_sold li').first().addClass('actv');
            $('.jinJ .zhif_sold li input')[0].checked=true;
            $('.jinJ .companyX li').first().addClass('actv');
            $('.jinJ .companyX li input')[0].checked=true;
            $('.jinJ .sold li').first().addClass('actv');
            $('.jinJ .sold li input')[0].checked=true;
            $('.jinJ .pay').on('click',function (e) {
              if(e.target.nodeName=='LABEL'){
                $(e.target).prev()[0].checked=true;
                var div=$(e.target).parent();
                div.addClass('actv');
                div.siblings().removeClass('actv');
                $('.jinJ .zhif_sold').empty();
                $('.jinJ .companyX').empty();
                $('.jinJ .sold').empty();
                $('.jinJ .signingUl').empty();
                if(e.target.innerHTML!="银行卡"){
                  $('.disnone').css('display',"none");
                  $('.disnone input[name="en"]').removeAttr('required');
                  $('.disnone input[name="en"]').val('');
                }else {
                  $('.disnone').css('display',"block");
                  $('.disnone input[name="en"]').attr('required','true');
                }
                for(var k=0;k<data.data.length;k++){
                  if(e.target.innerHTML==data.data[k].pay_mode_name){
                    for(var l=0;l<data.data[k].channel.length;l++){
                      var cha=data.data[k].channel[l];
                      if(cha.valid){
                        $('.jinJ .zhif_sold').append($("<li><input type='radio' name='channel_id' id='"+cha.id+"' value='"+cha.id+"'><label for='"+cha.id+"'>"+cha.name+"</label></li>"));
                      }
                    }
                    var required1=data.data[k].channel[0].required;
                    if(required1.companyNature&&required1.companyNature.length){
                      for(var c=0;c<required1.companyNature.length;c++){
                        $('.jinJ .companyX').append($("<li ><input type='radio' name='company_nature' onclick='show3(this)' value='"+required1.companyNature[c]+"' id='company"+c+"'><label for='company"+c+"'>"+required1.companyNature[c]+"</label></li>"));
                      }
                    };
                    if(required1.soldAccountType&&required1.soldAccountType.length){
                      for(var s=0;s<required1.soldAccountType.length;s++){
                        $('.jinJ .sold').append($("<li ><input type='radio' name='sold_account_type' onclick='show3(this)' value='"+required1.soldAccountType[s]+"' id='sold_account"+s+"'><label for='sold_account"+s+"'>"+required1.soldAccountType[s]+"</label></li>"));
                      }
                    };
                    if(required1.alipay_service_type&&required1.alipay_service_type.length){
                      for(var a=0;a<required1.alipay_service_type.length;a++){
                        $('.jinJ .signingUl').append($("<li ><input type='radio' name='alipay_service_type' onclick='show3(this)' value='"+required1.alipay_service_type[a]+"' id='signing"+a+"'><label for='signing"+a+"'>"+required1.alipay_service_type[a]+"</label></li>"));
                      }
                    };
                  }
                }
                $('.jinJ .zhif_sold li').first().addClass('actv');
                if($('.jinJ .zhif_sold li input').length){
                  $('.jinJ .zhif_sold li input')[0].checked=true;
                  $('.jinJ .zhif_sold').css('display','block');
                  $('.jinJ .zhifT').css('display','block');
                }else {
                  $('.jinJ .zhif_sold').css('display','none');
                  $('.jinJ .zhifT').css('display','none');
                };
                $('.jinJ .companyX li').first().addClass('actv');
                if($('.jinJ .companyX li input').length){
                  $('.jinJ .companyX li input')[0].checked=true;
                  $('.jinJ .companyX').css('display','block');
                  $('.jinJ .compayP').css('display','block');
                }else {
                  $('.jinJ .companyX').css('display','none');
                  $('.jinJ .compayP').css('display','none');
                };
                $('.jinJ .sold li').first().addClass('actv');
                if($('.jinJ .sold li input').length){
                  $('.jinJ .sold li input')[0].checked=true;
                  $('.jinJ .sold').css('display','block');
                  $('.jinJ .soldP').css('display','block');
                }else {
                  $('.jinJ .sold').css('display','none');
                  $('.jinJ .soldP').css('display','none');
                }
              }
              if($('.jinJ .signingUl li').length){
                $('.jinJ .signing').css('display','block');
                $('.jinJ .signingUl').css('display','block');
                $('.jinJ .signingUl li').first().addClass('actv');
                $('.jinJ .signingUl li input')[0].checked=true;
              }else {
                $('.jinJ .signing').css('display','none');
                $('.jinJ .signingUl').css('display','none');
              }
            });
            $('.jinJ .zhif_sold').on('click',function (e) {
              if(e.target.nodeName=='LABEL'){
                $(e.target).prev()[0].checked=true;
                var div=$(e.target).parent();
                div.addClass('actv');
                div.siblings().removeClass('actv');
                $('.jinJ .companyX').empty();
                $('.jinJ .sold').empty();
                $('.jinJ .signingUl').empty();
                for(var k=0;k<data.data.length;k++){
                  for(var l=0;l<data.data[k].channel.length;l++){
                    if(e.target.innerHTML==data.data[k].channel[l].name){
                      var required=data.data[k].channel[l].required;
                      if(required.companyNature&&required.companyNature.length){
                        for(var c=0;c<required.companyNature.length;c++){
                          $('.jinJ .companyX').append($("<li ><input type='radio' name='company_nature' onclick='show3(this)' value='"+required.companyNature[c]+"' id='company"+c+"'><label for='company"+c+"'>"+required.companyNature[c]+"</label></li>"));
                        }
                      };
                      if(required.soldAccountType&&required.soldAccountType.length){
                        for(var s=0;s<required.soldAccountType.length;s++){
                          $('.jinJ .sold').append($("<li ><input type='radio' name='sold_account_type' onclick='show3(this)' value='"+required.soldAccountType[s]+"' id='sold_account"+s+"'><label for='sold_account"+s+"'>"+required.soldAccountType[s]+"</label></li>"));
                        }
                      };
                      if(required.alipay_service_type&&required.alipay_service_type.length){
                        for(var a=0;a<required.alipay_service_type.length;a++){
                          $('.jinJ .signingUl').append($("<li ><input type='radio' name='alipay_service_type' onclick='show3(this)' value='"+required.alipay_service_type[a]+"' id='signing"+a+"'><label for='signing"+a+"'>"+required.alipay_service_type[a]+"</label></li>"));
                        }
                      };
                    }
                  }
                }
                $('.jinJ .companyX li').first().addClass('actv');
                if($('.jinJ .companyX li input').length){
                  $('.jinJ .companyX li input')[0].checked=true;
                  $('.jinJ .companyX').css('display','block');
                  $('.jinJ .compayP').css('display','block');
                }else {
                  $('.jinJ .companyX').css('display','none');
                  $('.jinJ .compayP').css('display','none');
                };
                $('.jinJ .sold li').first().addClass('actv');
                if($('.jinJ .sold li input').length){
                  $('.jinJ .sold li input')[0].checked=true;
                  $('.jinJ .sold').css('display','block');
                  $('.jinJ .soldP').css('display','block');
                }else {
                  $('.jinJ .sold').css('display','none');
                  $('.jinJ .soldP').css('display','none');
                };
                $('.jinJ .signingUl li').first().addClass('actv');
                if($('.jinJ .signingUl li input').length){
                  $('.jinJ .signingUl li input')[0].checked=true;
                  $('.jinJ .signingUl').css('display','block');
                  $('.jinJ .signing').css('display','block');
                }else {
                  $('.jinJ .signingUl').css('display','none');
                  $('.jinJ .signing').css('display','none');
                }
              }
            });
          }else {
            $scope.erro = true;
            $scope.err = data.info;
            $('.breadcrumb').css('display', 'none')
            $('#into_a').css('display', 'none');
          }
        }).error(function () {
          $scope.erro = true;
          $scope.err = '支付通道加载失败，请稍后重试';
          $('.breadcrumb').css('display', 'none')
          $('#into_a').css('display', 'none');
        });
      } else {
        $scope.erro = true;
        $scope.err = data.info;
        $('.breadcrumb').css('display', 'none')
        $('#into_a').css('display', 'none');
      }
    }).error(function () {
      $scope.erro = true;
      $scope.err = "请求超时，请稍后重试";
      $('.breadcrumb').css('display', 'none')
      $('#into_a').css('display', 'none');
    });
  } else if($scope.dataToken.wo_id){
    $('#into_a').remove();
    $scope.dataToken.templet_mode='apply';
    if(local_try){
      if(!$window.localStorage['supplement']){$window.localStorage['supplement']=$scope.dataToken.wo_id;}
    }else {console.log('无痕模式我不管');}
    $scope.Lod=$http.post(config.api + '/webWo/getWODetailCommon',$scope.dataToken).success(function (data) {
      if(data.code==0){
        var status=data.data[0].status;
        switch (status) {
          case 10:$scope.err = "您的资料正在审核中，请耐心等待";break;
          case 11:$scope.err = "您的资料正在审核中，请耐心等待";break;
          case 12:$scope.err = "审核不通过，请核对后重新提交审核";break;
          case 21:$scope.err = "恭喜您，您的资料已通过审核";break;
          case 0:$scope.err = "您的资料已终止审核";break;
        }
        $scope.cha=new Object();
        $scope.obj.mcode=$scope.cha.mcode =data.data[0].mcode;
        $scope.obj.merchant_name=data.data[0].merchant_name;
        $scope.type=data.data[0].paper_channel;
        if(Array.prototype.isPrototypeOf(data.data[0].payChannel)&&data.data[0].payChannel.length){
          $scope.obj.channel_name=data.data[0].payChannel[0].pay_mode_name;
          $scope.theRequest.pay_mode_id= $scope.cha.pay_mode_id =data.data[0].payChannel[0].pay_mode_id;
        }else {
          $scope.obj.channel_name=data.data[0].payChannel.pay_mode_name;
          $scope.theRequest.pay_mode_id= $scope.cha.pay_mode_id =data.data[0].payChannel.pay_mode_id;
        }
        $rootScope.title=data.data[0].paperItems;
        $rootScope.disarr=data.data[0].paper;
        $scope.url=data.data[0].rootUrl;
        $scope.acc=data.data[0].accessToken;
        $scope.userId=data.data[0].paper.ext.userId;
        if(data.data[0].paper.ext.userType)$scope.userType=data.data[0].paper.ext.userType;
        for(var i=0;i<$rootScope.title.length;i++){
            if($rootScope.title[i].key=='company_nature') $scope.theRequest.company_nature=$rootScope.title[i].value;
            if($rootScope.title[i].key=='pay_mode_id') $scope.theRequest.pay_mode_id=$rootScope.title[i].value;
            if($rootScope.title[i].key=='sold_account_type') $scope.theRequest.sold_account_type=$rootScope.title[i].value;
            if($rootScope.title[i].key=='alipay_service_type') $scope.theRequest.alipay_service_type=$rootScope.title[i].value;
        }
        decorateBody($scope.cha);
        if(status==12){
          $scope.Lod=$http.post(config.api + '/wo/getLastPaper', $scope.cha).success(function (data) {
            if(data.code==0){
              //$rootScope.paper = data.data[0];
              //$state.go('into_a.into_detail', null, {location: 'replace'});
              if(local_try){
                if($window.localStorage['supplement']==$scope.dataToken.wo_id){
                  if($window.localStorage['order_woid']
                    &&isEmptyObject(JSON.parse($window.localStorage['order_woid']))==false
                    &&JSON.parse($window.localStorage['order_woid']).wo_id==$scope.dataToken.wo_id){
                    $('#confirm').css('display','block');
                    $('#confirm .modal-body').html('您有未完成的补件资料，是否加载上次数据？')
                    $('#confirm button.ok').on('click',function () {
                      $('#confirm').css('display','none');
                      $rootScope.paper=new Object();
                      var getZancun=JSON.parse($window.localStorage['order_woid']);
                      if(getZancun.paper){
                        $rootScope.paper.paper=getZancun.paper;
                      }else {$rootScope.paper.paper=getZancun;}
                      $rootScope.paper.accessToken=$rootScope.paper.paper=getZancun.accessToken;
                      $rootScope.paper.rootUrl=getZancun.rootUrl;
                      $state.go('into_a.into_detail', null, {location: 'replace'});
                    });
                    $('#confirm button.no').on('click',function () {
                      $('#confirm').css('display','none');
                      $rootScope.paper = data.data[0];
                      $state.go('into_a.into_detail', null, {location: 'replace'});
                    });
                  }else {$rootScope.paper = data.data[0];$state.go('into_a.into_detail', null, {location: 'replace'});}
                }else {$rootScope.paper = data.data[0];$state.go('into_a.into_detail', null, {location: 'replace'});}
              }else {
                console.log('无痕模式我不管');
                $rootScope.paper = data.data[0];
                $state.go('into_a.into_detail', null, {location: 'replace'});
              }
            }else {
              $scope.erro=true;
              $scope.err=data.info;
            }
          }).error(function () {
            $scope.erro=true;
            $scope.err='请求超时，请稍后重试';
          });
          $scope.status='（待补充）';
          if(data.data[0].remark){
            $scope.bujian=true;
            $scope.results=data.data[0].remark;
          }
        }else {
          $scope.erro=true;
          $('.breadcrumb').css('display', 'none');
        }
      }else {
        $scope.erro=true;
        $scope.err=data.info;
      }
    }).error(function () {
      $scope.erro=true;
      $scope.err='请求超时，请稍后重试';
    })
  }else {
    $scope.erro = true;
    $scope.err = '请求参数不足或错误，请返回重试';
    $('.breadcrumb').css('display', 'none')
    $('#into_a').css('display', 'none');
  }
  $("#into .sheB li span").click(function () {
    if ($('#into .sheB .sheBli').length > 1) {
      this.parentNode.remove()
    }
  })
  var EN_NUM=2;
  $scope.add = function () {
    var str = "<li class='col-xs-12 sheBli'>" +
      "<label class='col-xs-3'>EN</label><input type='text' name='en' id='en_"+EN_NUM+"' placeholder='EN' class='col-xs-5 form-control' required>" +
      "<div class='suggest clear col-xs-5'><ul></ul></div>"+
      "<span  class='left'><img src='img/delete.png' alt=''></span>" +
      "<p class='col-xs-8 col-sm-5'></p>"+
      "</li>";
    EN_NUM++;
    if($window.innerWidth>=768)$("#into .sheB_before").after(str);
    if($window.innerWidth<768)$("#into .sheB_after").before(str);
    $("#into .sheB li span").click(function () {
      if ($('#into .sheB .sheBli').length > 1) {
        this.parentNode.remove()
      }
    })
    if($scope.type==2||$scope.userType==2){addDiv($scope.userId);}else {enc();}
  }
  var inputlist = $("#into_a .header input");
  var yan = new Object();
  $('#into_a .header input').on('blur', function () {
    for (var a = 0; a < inputlist.length; a++) {
      if (inputlist[a].value == '') {
        return false
      }
      yan[inputlist[a].name] = $.trim(inputlist[a].value);
    }
    $scope.er="验证中...";
    decorateBody(yan);
    $http.post(config.api + '/merchant/checkMcode', yan).success(function (data) {
      if (data.code == 0) {
        $scope.er="";
        $('#into .btn-info').removeAttr('disabled');
      } else {
        $scope.er=data.info;
        $('#into button').attr('disabled',true);
        document.documentElement.scrollTop = document.body.scrollTop =0;
        if($window.innerWidth<768){
          $('#alert').css('display','block');
          $('#alert .modal-body').html(data.info);
        };
      }
    }).error(function () {
      $scope.er="验证超时，请稍后重试";
      document.documentElement.scrollTop = document.body.scrollTop =0;
      if($window.innerWidth<768){
        $('#alert').css('display','block');
        $('#alert .modal-body').html("MCODE验证超时，请稍后重试");
      };
    })
  });
  $scope.jump = function () {
    var inputlist = $('#into_a input');
    var inputEnP = $('.sheB p');
    var inputEn = $('.sheB input');
    for(var e=0;e<inputEnP.length;e++){
      if(inputEn[e].required&&inputEnP[e].innerHTML){
        inputEn[e].focus();
        return false;
      }
    }
    var en=[];
    for (var a = 0; a < inputlist.length; a++) {
      if (inputlist[a].validity.valid == false) {
        inputlist[a].focus();
        return false;
      }
      if(inputlist[a].name=='en'&&inputlist[a].value){en.push(inputlist[a].value)};
      if(inputlist[a].name=='salesman_phone'){
        if(Sys.liulan=='safari'&&inputlist[a].value.length<inputlist[a].attributes['minlength'].nodeValue
          ||Sys.liulan=='firefox'&&inputlist[a].value.length<inputlist[a].attributes['minlength'].value
        ){
          inputlist[a].focus();
          return false;
        }
      }
      $scope.obj[inputlist[a].name] =$.trim(inputlist[a].value);
    }
    $scope.obj.en=en;
    var Radio=$('#into_a input[type="radio"]');
    for(var i=0;i<Radio.length;i++){
      if(Radio[i].checked){
        $scope.obj[Radio[i].name] =Radio[i].value;
      }
    }
    //$scope.obj = $('#into').serializeObject();
    if($scope.obj.pay_mode_id!='1006'){delete $scope.obj.sold_account_type;};
    if($scope.obj.pay_mode_id!='1004'){delete $scope.obj.alipay_service_type;};
    var zaiyan = new Object();
    var cha = new Object();
    zaiyan.mcode = $scope.obj.mcode;
    zaiyan.pay_mode_id = $scope.obj.pay_mode_id;
    zaiyan.merchant_name = $scope.obj.merchant_name;
    decorateBody(zaiyan);
    decorateBody(cha);
    cha.pay_mode_id = $scope.obj.pay_mode_id;
    $scope.obj.ext = {
      salesman_name: $scope.obj.salesman_name,
      salesman_phone: $scope.obj.salesman_phone,
      salesman_type: $scope.obj.salesman_type,
      salesman_branch: $scope.obj.salesman_branch,
      enlist: []
    };
    if($scope.obj.channel_id)$scope.obj.ext.pay_channel_id=parseInt($scope.obj.channel_id);
    if($scope.obj.en.length)for (var i = 0; i < $scope.obj.en.length; i++) {$scope.obj.ext.enlist[i] = {en: $scope.obj.en[i]}};
    //$scope.theRequest = new Object();
    $scope.theRequest.pay_mode_id = [];
    $scope.obj.ext.pay_mode_list = [];
    if (Array.prototype.isPrototypeOf($scope.obj.pay_mode_id)) {
      for (var i = 0; i < $scope.obj.pay_mode_id.length; i++) {
        $scope.theRequest.pay_mode_id[i] = $scope.obj.pay_mode_id[i];
        $scope.obj.ext.pay_mode_list[i] = parseInt($scope.obj.pay_mode_id[i])
      }
      $scope.theRequest.pay_mode_id = String($scope.theRequest.pay_mode_id);
    } else {
      $scope.theRequest.pay_mode_id = $scope.obj.pay_mode_id;
      $scope.obj.ext.pay_mode_list[0] =parseInt($scope.obj.pay_mode_id);
    }
    $scope.theRequest.company_nature = $scope.obj.company_nature;
    if($scope.obj.sold_account_type&&$scope.obj.pay_mode_id=='1006'){$scope.theRequest.sold_account_type = $scope.obj.sold_account_type;}
    if($scope.obj.alipay_service_type&&$scope.obj.pay_mode_id=='1004'){$scope.theRequest.alipay_service_type = $scope.obj.alipay_service_type;}
    if($scope.obj.channel_id){$scope.theRequest.pay_channel_id = parseInt($scope.obj.channel_id);}
    decorateBody($scope.theRequest);
    var zancun=$scope.obj;//暂存第一页数据
    zancun.userId=$scope.userId;
    $scope.goTo=function(){
      $('#wodang').css('display','block');
      cha.pay_channel_id=$scope.obj.channel_id;
      $scope.P =$http.post(config.api + '/wo/getLastPaper', cha).success(function (data) {
        $('#wodang').css('display','none');
        if(data.code==0&&data.data[0]){
          if(isEmptyObject(data.data[0].paper)==false){
            var zhifu=data.data[0].paper.ext.pay_mode_list[0]
            switch (zhifu) {
              case 1003:zhifu = "微信";break;
              case 1006:zhifu = "银行卡";break;
              case 1004:zhifu = "支付宝";break;
              case 1005:zhifu = "百度钱包";break;
            }
            $('#confirm').css('display','block');
            $('#confirm .modal-body').html('门店（'+data.data[0].paper.mcode+'）已有【'+zhifu+'】方式的进件资料,是否加载已有数据？')
            $('#confirm button.ok').on('click',function () {
              $('#confirm').css('display','none');
              $("#into_a").css("display", 'none');
              $rootScope.paper = data.data[0];
              $state.go('into_a.into_detail', null, {location: 'replace'});
              if(local_try){
                $window.localStorage['firstCun']=JSON.stringify(zancun);
              }else {
                console.log('无痕模式我不管');
              }
            })
            $('#confirm button.no').on('click',function () {
              $('#confirm').css('display','none');
              $("#into_a").css("display", 'none');
              $rootScope.paper = '';
              $state.go('into_a.into_detail', null, {location: 'replace'});
              if(local_try){
                $window.localStorage['firstCun']=JSON.stringify(zancun);
              }else {
                console.log('无痕模式我不管');
              }
            })
          }else {
            $state.go('into_a.into_detail', null, {location: 'replace'});
            if(local_try){
              $window.localStorage['firstCun']=JSON.stringify(zancun);
            }else {
              console.log('无痕模式我不管');
            }
            $("#into_a").css("display", 'none');
          }
        }else {
          $rootScope.paper = '';
          $state.go('into_a.into_detail', null, {location: 'replace'});
          if(local_try){
            $window.localStorage['firstCun']=JSON.stringify(zancun);
          }else {
            console.log('无痕模式我不管');
          }
          $("#into_a").css("display", 'none');
        }
      }).error(function () {
        $scope.erro = true;
        $scope.err = '请求超时，请稍后重试';
        $('.breadcrumb').css('display', 'none')
        $('#into_a').css('display', 'none');
      });};
    var refTure=function () {
      var refto=false;
      if($scope.obj.ref_store_mcode&&$scope.obj.ref_business_license_code){//新进件时，从商户【已完成】进件的门店加载资料
        cha.mcode = $scope.obj.ref_store_mcode;
        cha.business_license_code = $scope.obj.ref_business_license_code;
        cha.status=21;
        $('#wodang').css('display','block');
        $scope.P =$http.post(config.api+'/wo/getLastPaper',cha).success(function (data) {
          $('#wodang').css('display','none');
          if(data.code==0){
            if(isEmptyObject(data.data[0].paper)){
              cha.mcode = $scope.obj.mcode;
              delete cha.business_license_code;
              delete cha.status;
              $('#confirmref').css('display','block');
              $('#confirmref .modal-body').html('原门店MCODE或营业执照号不匹配，是否继续？');
              $('#confirmref button.ok').on('click',function () {
                $('#confirmref').css('display','none');
                refto=true;
                if(refto)$scope.goTo()
              });
              $('#confirmref button.no').on('click',function () {$('#confirmref').css('display','none');});
            }else {
              refto=true;
              if(refto)$scope.goTo()
            }
          }else {
            $('#confirmref').css('display','block');
            $('#confirmref .modal-body').html('无原门店相关数据，是否继续？');
            $('#confirmref button.ok').on('click',function () {
              $('#confirmref').css('display','none');
              refto=true;
              if(refto)$scope.goTo()
            });
            $('#confirmref button.no').on('click',function () {$('#confirmref').css('display','none');});
          }
        }).error(function () {
          $('#wodang').css('display','none');
          cha.mcode = $scope.obj.mcode;
          delete cha.business_license_code;
          delete cha.status;
          $('#confirmref').css('display','block');
          $('#confirmref .modal-body').html('获取原门店数据失败，是否继续？');
          $('#confirmref button.ok').on('click',function () {
            $('#confirmref').css('display','none');
            refto=true;
            if(refto)$scope.goTo()
          });
          $('#confirmref button.no').on('click',function () {$('#confirmref').css('display','none');});
        })
      }else if($scope.obj.ref_store_mcode||$scope.obj.ref_business_license_code){
        $('#confirmref').css('display','block');
        cha.mcode = $scope.obj.mcode;
        $('#confirmref .modal-body').html('原门店MCODE或营业执照号未填写，是否继续？');
        $('#confirmref button.ok').on('click',function () {
          $('#confirmref').css('display','none');
          refto=true;
          if(refto)$scope.goTo()
        });
        $('#confirmref button.no').on('click',function () {$('#confirmref').css('display','none');});
      } else {cha.mcode = $scope.obj.mcode;$scope.goTo()};
    };
    var template=function () {
      $('#wodang').css('display','block');
      $scope.P = $http.post(config.api + '/merchant/checkMcode', zaiyan).success(function (data) {
        if (data.code == 0) {
          $scope.P1 = $http.post(config.api + '/template/getTemplate', $scope.theRequest).success(function (data) {
            if (data.code == 0) {
              $('#wodang').css('display','none');
              $rootScope.disarr = data.data[0].paper;
              $rootScope.title = data.data[0].paperItems;
              /*暂存---*/
              var contrast1,contrast2=true;
              if(local_try){
                if($window.localStorage['firstCun']){
                  if(isEmptyObject(JSON.parse($window.localStorage['firstCun']))==false&&JSON.parse($window.localStorage['firstCun']).userId==$scope.userId){
                    var zancunS=JSON.parse($window.localStorage['firstCun']);
                    var objS=$scope.obj;
                    var objArr=[],zancunArr=[],objZ={},objC={};
                    for(var ok in objS){
                      if(ok=='pay_mode_id'||ok=='channel_id'||ok=='company_nature'
                        ||ok=='sold_account_type'||ok=='mcode'||ok=='merchant_name'||ok=='alipay_service_type'){objArr.push(ok);objZ[ok]=objS[ok]}
                    };
                    for(var zk in zancunS){
                      if(zk=='pay_mode_id'||zk=='channel_id'||zk=='company_nature'
                        ||zk=='sold_account_type'||zk=='mcode'||zk=='merchant_name'||zk=='alipay_service_type'){ zancunArr.push(zk);objC[zk]=zancunS[zk]}
                    };

                    if(objArr.length==zancunArr.length){
                      contrast1=true;
                      for(var k in objZ){
                        for(var zk in objC){
                          if(k==zk){
                            if(objZ[k]!=objC[zk]){
                              contrast2=false;
                            }
                          }
                        }
                      };
                    }else {contrast1=false;}
                    if(contrast1&&contrast2&&$window.localStorage['ZanCun']
                      &&($window.localStorage['ZanCun'].lastIndexOf("}")!= -1)
                      &&isEmptyObject(JSON.parse($window.localStorage['ZanCun']))==false
                      &&JSON.parse($window.localStorage['ZanCun']).userId==zancunS.userId){
                      $('#confirmref').css('display','block');
                      $('#confirmref .modal-body').html('您上一次没完成的进件，是否加载未完成的数据？');
                      $('#confirmref button.ok').on('click',function () {
                        $('#confirmref').css('display','none');
                        var getZanCun=JSON.parse($window.localStorage['ZanCun']);
                        $rootScope.paper={
                          accessToken:getZanCun.accessToken,
                          rootUrl:getZanCun.rootUrl
                        };
                        if(getZanCun.paper){
                          delete getZanCun.paper.ext;
                          delete getZanCun.paper.ref_store;
                          $rootScope.paper.paper=getZanCun.paper;
                        }else {
                          $rootScope.paper.paper=getZanCun;
                        }
                        $state.go('into_a.into_detail', null, {location: 'replace'});
                        $("#into_a").css("display", 'none');
                        $window.localStorage['firstCun']=JSON.stringify(zancun);
                      });
                      $('#confirmref button.no').on('click',function () {$('#confirmref').css('display','none'); refTure();});
                    }else {
                      refTure();
                    }
                  }else {refTure();}
                }else {refTure();}
              }else {
                console.log('无痕模式我不管');
                refTure();
              }
            }else {
              $('#wodang').css('display','none');
              $('#alert').css('display','block');
              $('#alert .modal-body').html(data.info);
            }
          }).error(function () {
            $('#wodang').css('display','none');
            $('#alert').css('display','block');
            $('#alert .modal-body').html('获取数据超时，请稍后重试');
          })
        } else {
          $('#wodang').css('display','none');
          $('#alert').css('display','block');
          $('#alert .modal-body').html(data.info);
        }
      }).error(function () {
        $('#wodang').css('display','none');
        $('#alert').css('display','block');
        $('#alert .modal-body').html('获取数据超时，请稍后重试');
      })
    };

    if($scope.type==2||$scope.userType==2){
        var lastEn=$('#into_a input[name="en"]')[$('#into_a input[name="en"]').length-1];
        var Enp=$('#into_a .disnone .sheBli p');
        if($scope.obj.en.length){
          var checkEn={en:$scope.obj.en[$scope.obj.en.length-1],agentId:$scope.userId};
          for(var i=0;i<Enp.length;i++){
            if(Enp[i].innerHTML){
              $('#into_a input[name="en"]')[i].focus();
              return false;
            }
          }
          $scope.P =$http.post(config.api+'/merchant/checkEn',decorateBody(checkEn)).success(function (data) {
            if(data.code==0){
              $(lastEn).next().next().next().html("");
              template();
            }else {
              $(lastEn).next().next().next().html("&nbsp;"+data.info);
            }
          }).error(function () {
            $(lastEn).next().next().next().html("&nbsp;验证失败");
          })
        }else {
          template();
        }
      }else {//测试暂时放开en验证
      template();
    }
  };
  $('#alert button').on('click',function () {
    $('#alert').css('display','none');
  })
})
app.controller("into_detail", function ($scope, $http, $state, $rootScope, $window, $anchorScroll) {
  var obj = new Object();
  var callback = function (k, v) {
    obj[k] = v;
  }
  if ($scope.obj) {
    $scope.merchant_name = $scope.obj.merchant_name;
    $scope.code = $scope.obj.mcode;
  }
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
  }
  if ($rootScope.disarr) {
    var zanId = '';
    if($scope.userId)zanId = $scope.userId;
    for (var i = 0; i < $rootScope.disarr.groups.length; i++) {
      var keys = $rootScope.disarr.groups[i].boundItemKeys;
      if (keys) {
        for (var a = 0; a < $rootScope.title.length; a++) {
          if ($rootScope.disarr.groups[i].key == $rootScope.title[a].key) {
            var groupname = $rootScope.title[a].title;
            $("#into_detail").append($(
              "<div class='form-group' id='" + $rootScope.disarr.groups[i].key + "'>" +
              "<h4 style='display: none'><span>"+zanId+"</span><p>" + groupname + "</p></h4>" +
              "<div class='btnL'><input type='button' onclick='prevStep(this)' class='btn btn-info' value='上一步'>" +
              "<input type='button' onclick='nextStep(this)' class='btn btn-success' value='下一步'></div>" +
              "</div>"
            ));
            $('#into_b .groupList').append($("<div class='Ldiv " + $rootScope.title[a].key + "'>" + groupname + "<p class='Lp " + $rootScope.title[a].key + "'></p></div>"));
          }
        }
        addInput($rootScope.disarr.groups[i].key, $rootScope.title, keys, $rootScope.paper);//生成页面元素
      }
    }
    var date_input=$('#into_b .Input>li input[type="date"]');
    $($('#into_b .groupList .Ldiv')[0]).addClass('bac_in');
    if($('#into_b .groupList .Ldiv .Lp').length>1)$($('#into_b .groupList .Ldiv .Lp')[1]).addClass('bac_in');
    function resize() {
      var width = ($('#into_b .groupList').width()) / $rootScope.disarr.groups.length;
      var resize_width=$window.innerWidth;
      if(resize_width<768){
        date_input.width(resize_width-53);
        $('#into_b .groupList .Ldiv').width($('#into_b .groupList').width());
        $('#into_b .groupList .Ldiv .Lp').css('display','none');
        var ldiv=$('#into_b .groupList .Ldiv');
        for(var i=0,len=ldiv.length;i<len;i++){
          if(!$(ldiv[i]).hasClass('bac_in')){$(ldiv[i]).css('display','none')}
        }
      }
      if(resize_width>=768){
        date_input.width('');
        $('#into_b .groupList .Ldiv').width(width);
        $('#into_b .groupList .Ldiv').css('display','block');
        $('#into_b .groupList .Ldiv .Lp').css('display','block');
        $('#into_b .groupList .Ldiv .Lp')[0].style.display='none';
      }
    };
    $().ready(resize());
    $window.onresize = function () {resize();};
    $('#into_detail .img-li li').on('mouseenter', function () {
      $(this).children()[0].lastChild.style.display = 'block';
      var div = $(this).children()[0].lastChild;
      var resize_width=$window.innerWidth;
      if ($(div).children().length < 3) {
        $(div).children()[0].style.marginLeft = resize_width>=768 ? '30%' : '20%';
      }
    });
    $('#into_detail .img-li li').on('mouseleave', function () {$(this).children()[0].lastChild.style.display = 'none';});
    $('#into_detail .img-li li').on('touchstart', function () {
      $(this).children()[0].lastChild.style.display = 'block';
      var div = $(this).children()[0].lastChild;
      var resize_width=$window.innerWidth;
      if ($(div).children().length < 3) {
        $(div).children()[0].style.marginLeft = resize_width>=768 ? '30%' : '20%';
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
        }
        if(file.size/1024 >3072){
          $('#alert').css('display','block');
          $('#alert .modal-body').html('图片过大，请重新选择');
          fileval='';
          $(btnLabel).removeAttr('disabled');
          $(me).val('');
        }
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
      if(resize_width>=768){$(this).parent().parent().next().children()[1].style.display='block';}
      callback(input.name, input.value)
    });//删除图片
    $("#into_detail .Input input[type='file']").on("change", function () {
      var parents = $(this).parent();
      var filename = this.name;
      var fileval = $(this).val();
      var fileE = parents[0].nextSibling.classList;
      var parentLi = $(parents[0]).parent();
      var lastChild = parentLi[0].lastChild;
      var reg = new RegExp(/\\|\/+/);
      var s = '';
      if (reg.test(fileval)) {
        s = fileval.split(reg)[fileval.split(reg).length - 1];
      } else {
        s = fileval;
      }
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
        };
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
      $(this).next().val(s);
      var me = this;
      if (fileval != "") {
        parents.ajaxSubmit({
          success: function (data) {
            var file = JSON.parse(data).data;
            if (JSON.parse(data).code == 0) {
              var href = file[0].url + "?accessToken=" + file[0].accessToken;
              lastChild.innerHTML = "<a href='" + href + "' target='_blank'>上传成功,可点击下载查看</a>";
              callback(filename, file[0].fileKey);
              $(me).val("");
              $(me).prev().html(s);
              $(me).next().next().val(file[0].fileKey)
            } else {
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
    $('#into_detail div[data-target="#myModal"]').on('click', function () {
      var resize_width=$window.innerWidth;
      var alertSpan=$(this).parent().next();
      $('#myModal .modal-body').empty();
      var modalS = "<select name='firstCategoryName' id='firstCategoryName' class='form-control'>" +
        "<option></option>" +
        "</select>";
      function addselect(url) {
        $('#myModal .modal-body').append($(modalS));
        $('#myModal .modal-title').html("请选择行业类目");
        queryW(1, null, null, '#firstCategoryName', 'firstCategoryName',url);
        $('#firstCategoryName').on('change', function () {
          if ($('#firstCategoryName ~').length != 0) {
            $('#firstCategoryName ~').remove()
          }
          if ($('#firstCategoryName').val()) {
            var modalSelect = "<br><select name='secondCategoryName' id='secondCategoryName' class='form-control'>" +
              "<option></option>" +
              "</select>"
            $(modalSelect).insertAfter($('#firstCategoryName'));
            $('#secondCategoryName option ~').empty();
            queryW(2, $('#firstCategoryName').val(), null, '#secondCategoryName', 'secondCategoryName',url)
            $('#secondCategoryName').on('change', function () {
              if ($('#secondCategoryName ~').length != 0) {
                $('#secondCategoryName ~').remove()
              }
              if ($('#secondCategoryName').val()) {
                var modalSelect = "<br><select name='thirdCategoryName' id='thirdCategoryName' class='form-control'>" +
                  "<option></option>" +
                  "</select>"
                $(modalSelect).insertAfter($('#secondCategoryName'));
                $('#thirdCategoryName option ~').empty();
                queryW(3, $('#firstCategoryName').val(), $('#secondCategoryName').val(), '#thirdCategoryName', 'thirdCategoryName',url)
                $('#thirdCategoryName').on('change', function () {
                  var queryID = new Object();
                  if ($('#secondCategoryName').val()) {
                    queryID.firstCategoryName = $('#firstCategoryName').val();
                    queryID.secondCategoryName = $('#secondCategoryName').val();
                    queryID.thirdCategoryName = $('#thirdCategoryName').val();
                    queryID.resultType = 3;
                    decorateBody(queryID);
                    $.ajax({
                      url: config.api + url,
                      data: JSON.stringify(queryID),
                      type: 'POST',
                      dataType: 'json',
                      beforeSend: function (xhr) {
                        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                      },
                      success: function (data) {
                        $('#myModal button.btn-primary').one('click', function () {
                          var sel = $('.modal select');
                          for (var i = 0; i < sel.length; i++) {
                            if (sel[i].value == "") {
                              sel[i].focus();
                              return false;
                            }
                          }
                          $('#into_detail input[name="alipay_shop_category_code"]').val(data.data[0].categoryId);
                          if($('#into_detail input[name="alipay_shop_category_code"]')[0])$('#into_detail input[name="alipay_shop_category_code"]').parent()[0].lastChild.innerHTML='';
                          $('#into_detail input[name="ms_wx_category_code"]').val(data.data[0].categoryId);
                          if($('#into_detail input[name="ms_wx_category_code"]')[0])$('#into_detail input[name="ms_wx_category_code"]').parent()[0].lastChild.innerHTML='';
                          $('#into_detail input[name="business_type"]').val(data.data[0].firstCategoryName);
                          if($('#into_detail input[name="business_type"]')[0])$('#into_detail input[name="business_type"]').parent()[0].lastChild.innerHTML='';
                          $('#into_detail input[name="business_sub_type"]').val(data.data[0].secondCategoryName + "/" + data.data[0].thirdCategoryName);
                          if($('#into_detail input[name="business_sub_type"]')[0])$('#into_detail input[name="business_sub_type"]').parent()[0].lastChild.innerHTML='';
                          $('#into_detail input[name="upside_rates"]').val(data.data[0].agreedRate);
                          if($('#into_detail input[name="upside_rates"]')[0])$('#into_detail input[name="upside_rates"]').parent()[0].lastChild.innerHTML='';
                          //alertSpan.html("您需提供<span style='color: red'>" + data.data[0].certification + "</span>")
                          //if(WIDTH>=768)alertSpan.css("margin-bottom", "1em");
                          //alertSpan.css("padding", "1em 5px");
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      };//类目信息
      var searchInput="<iframe src='amap.html' id='amap' frameborder='0'  name='iframe' width='100%' height='100%' style='height: 100%'></iframe>";
      if ($(this).parent()[0].firstChild.htmlFor == "alipay_shop_category") {addselect('/category/query')};//行业类目信息
      if ($(this).parent()[0].firstChild.htmlFor == "ms_wx_category") {addselect('/wechatCategory/query');};//微信类目信息
      if ($(this).parent()[0].firstChild.htmlFor == 'business_category') {
        $('#myModal .modal-body').append($(modalS));
        $('#myModal .modal-title').html("请选择行业类目");
        queryMcc(null, '#firstCategoryName', 'firstCategoryName');
        $('#firstCategoryName').on('change', function () {
          if ($('#firstCategoryName ~').length != 0) {
            $('#firstCategoryName ~').remove()
          }
          if ($('#firstCategoryName').val()) {
            var modalSelect = "<br><select name='secondCategoryName' id='secondCategoryName' class='form-control'>" +
              "<option></option>" +
              "</select>"
            $(modalSelect).insertAfter($('#firstCategoryName'));
            $('#secondCategoryName option ~').empty();
            queryMcc($('#firstCategoryName').val(), '#secondCategoryName', 'name')
            $('#secondCategoryName').on('change', function () {
              var queryID = new Object();
              if ($('#secondCategoryName').val()) {
                queryID.firstCategoryName = $('#firstCategoryName').val();
                queryID.name = $('#secondCategoryName').val();
                decorateBody(queryID);
                $.ajax({
                  url: config.api + '/mcc/query',
                  data: JSON.stringify(queryID),
                  type: 'POST',
                  dataType: 'json',
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  },
                  success: function (data) {
                    $('#myModal button.btn-primary').one('click', function () {
                      var sel = $('.modal select');
                      for (var i = 0; i < sel.length; i++) {
                        if (sel[i].value == "") {
                          sel[i].focus();
                          return false;
                        }
                        $('#into_detail input[name="business_type"]').val(data.data[0].firstCategoryName);
                        if($('#into_detail input[name="business_type"]')[0])$('#into_detail input[name="business_type"]').parent()[0].lastChild.innerHTML='';
                        $('#into_detail input[name="business_sub_type"]').val(data.data[0].name);
                        if($('#into_detail input[name="business_sub_type"]')[0])$('#into_detail input[name="business_sub_type"]').parent()[0].lastChild.innerHTML='';
                        $('#into_detail input[name="mcc_code"]').val(data.data[0].mcc);
                        if($('#into_detail input[name="mcc_code"]')[0])$('#into_detail input[name="mcc_code"]').parent()[0].lastChild.innerHTML='';
                      }
                    })
                  }
                })
              }
            })
          }
        })
      };//mcc类
      if($(this).parent()[0].firstChild.htmlFor=='manage_location'){
        $('#myModal .modal-body').append($(searchInput));
        var divInput=$(this).parent()[0].lastChild;
        if(resize_width>=768){
          $('#myModal .modal-body').css('height','400px');
        }else {
          $('#myModal .modal-body').css('height','300px');
        }
        $('#myModal .modal-title').html('请选择正确的地址');
        var iframeHtml=document.getElementById('amap').contentWindow;
        iframeHtml.onload=function () {
          if($('input[name="set_address_detail"]').val())this.document.getElementById('address').value=$('input[name="set_address_detail"]').val();
          this.mapAdd();
        }
        $('#myModal button.btn-primary').one('click', function () {
          var Point=iframeHtml.$PointDetail;
          $('input[name="province"]').val(Point.addressComponent.province)//省
          if(Point.addressComponent.city){
            $('input[name="city"]').val(Point.addressComponent.city)
          }else {
            $('input[name="city"]').val(Point.addressComponent.province)
          }//市
          $('input[name="area"]').val(Point.addressComponent.district)//区
          $('input[name="area_code"]').val(Point.addressComponent.adcode)//地区编码
          $('input[name="longitude"]').val(Point.location.lng)//经度
          $('input[name="latitude"]').val(Point.location.lat)//纬度
          $('input[name="set_address_detail"]').val(Point.formatted_address)//详细地址
          divInput.value=Point.formatted_address;//保存到后台的详细地址
        })
       };//高德地图
      if($(this).parent()[0].firstChild.htmlFor=='merchant_paper_import'){
        var formFile="<form action=" + config.api + "/common/readExcel method='post' enctype='multipart/form-data'>"+
          "<label for='fileExl' class='btn btn-info' style='color: #fff'>选择文件</label><span style='margin-left: 1em'></span>"+
          "<input class='form-control col-xs-6 fileInput' style='display: none' type='file' id='fileExl' name='fileData'>" +
          "<input style='display: none' type='text' name='fileName'>" +
            "<p class='devlue' style='margin-top: 1em'></p>"+
          "</form>";
        $('#myModal .modal-body').append($(formFile));
        $('#myModal .modal-title').html("请选择正确的文件&nbsp;&nbsp;&nbsp;（<a href='../guide/docs/商户进件材料收集表.xlsx' target='_blank'>模板下载</a>）");
        $("#myModal input[type='file']").on("change", function () {
          var parents = $(this).parent();
          var filename = this.name;
          var fileval = $(this).val();
          var reg = new RegExp(/\\|\/+/);
          var s = '';
          if (reg.test(fileval)) {
            s = fileval.split(reg)[fileval.split(reg).length - 1];
          } else {
            s = fileval;
          }
          var files = Array.prototype.slice.call(this.files);
          if (fileval.lastIndexOf(".") != -1) {
            var str = fileval.substr(1);
            var strs = str.split(".");//et,ett,xls,xlt
            if (strs[strs.length - 1].toLowerCase()=='xlsx'||strs[strs.length - 1].toLowerCase()=='xls') {
              $(this).prev().html('上传中,请稍后...');
            }else {
              fileval = "";
              $(this).val("")
              $('#alert').css('display','block');
              $('#alert .modal-body').html("您上传的文件不符合要求！请重新上传！");
              $(this).prev().html('');
              $('#myModal .devlue').html('')
            }
          };
          files.forEach(function (file) {
            if(file.size/1024 >3072){
              $('#alert').css('display','block');
              $('#alert .modal-body').html('文件过大，请重新选择');
              fileval = "";
              $(this).val("");
              $('#myModal .devlue').html('');
            };
          });
          $(this).next().val(s);
          var me = this;
          var thss = parents.serializeObject();
          decorateBody(thss);
          if (fileval) {
            $('#myModal .devlue').html('');
            parents.ajaxSubmit({
              data: thss,
              success: function (data) {
                var file = JSON.parse(data).data;
                if (JSON.parse(data).code == 0) {
                  var merchantInfo = file[0].merchantInfo;
                  var detail_input=$('#into_detail .Input input');
                  var detail_select=$('#into_detail .Input select');
                  $('#myModal button.btn-primary').one('click', function () {
                    for(var i=0;i<detail_input.length;i++){
                      for(var key in merchantInfo){
                        if(key==detail_input[i].name){
                          detail_input[i].value=merchantInfo[key]
                        }
                      }
                    }
                    for(var s=0;s<detail_select.length;s++){
                      for(var key in merchantInfo){
                        if(key==detail_select[s].name)detail_select[s].value=merchantInfo[key];
                      }
                    }
                  });
                  $(me).val("");
                  $(me).prev().html(s);
                  $('#myModal .devlue').html('已获取表格中数据，是否同步数据？')
                } else {
                  $(me).val("");
                  $(me).prev().html('');
                  $('#myModal .devlue').html(JSON.parse(data).info)
                }
              },
              error: function () {
                $(me).val("");
                $(me).prev().html('');
                $('#myModal .devlue').html('获取表格数据失败，请重新上传')
              }
            })
          }
        });//上传文件

      };//exl文件导入
    });//获取类目或地址并生成数据
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
          t.firstChild.onmousewheel=scrollFunc;
          if(Sys.liulan=='firefox')t.firstChild.addEventListener('DOMMouseScroll',scrollFunc,false);
          if (resize_width>=768) {
            $(t)[0].firstChild.style.width = resize_width / 2 + "px";
            if(resize_width / 2>resize_height){
              $(t)[0].firstChild.style.height =resize_height + "px"
            } else {$(t)[0].firstChild.style.height =resize_width / 2 + "px"};
            $(t).width(resize_width);
            $(t).height('100%');
            t.lastChild.style.display='block';
          } else {
            $(t)[0].firstChild.style.height = resize_width + "px";
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
        width(120);
      }

    }//图片放大
    $("#into_detail .img-li form div:first-child").on("click", function () {
      if (this.firstChild) {
        var imgurl = this.firstChild.style.backgroundImage;
        if (imgurl.lastIndexOf('img/pic.png')== -1) {img768(this)};
      }
    });
    $('.iframeA').on('click',function (e) {
      e.preventDefault();
      $('body').css('overflow','hidden');
      this.firstChild.style.display='block';
      this.nextSibling.style.display='block';
      var str=this.nextSibling.nextSibling.innerHTML;
      this.firstChild.firstChild.scrolling='yes';
      this.firstChild.firstChild.src=str;
    });//手机打开帮助页面
    $('.colseI').on('click',function () {
      $('body').css('overflow','');
      this.previousSibling.firstChild.style.display='none';
      this.style.display='none';
      this.previousSibling.firstChild.firstChild.src='';
    });//手机关闭帮助页面
    $('.laydate-icon').focus(function () {
      laydate({
        elem:"#"+this.id,
        event:"click",
        istime:false,
        isclear:false,
        istoday:false,
        issure:false
      });
    });//日期插件
    var arrobj = new Object();
    var fisrtBtn = $('#into_detail input.btn-info')[0];
    if($scope.dataToken.wo_id){fisrtBtn.style.display='none';}
    $(fisrtBtn).removeAttr('onclick');
    $(fisrtBtn).on('click', function () {
      if ($('#into_detail div').length) {
        $('#confirm .modal-body').html( '返回修改将清除已填资料，是否确认？');
        $('#confirm').css('display','block');
        $('#confirm .ok').on('click',function () {
          $('#confirm').css('display','none');
          $("#into_a").css("display", 'block');
          $state.go('into_a');
          if(local_try){
            $window.localStorage.removeItem('firstCun');
            $window.localStorage.removeItem('ZanCun');
          }else {
            console.log('无痕模式我不管');
          }
          document.documentElement.scrollTop = document.body.scrollTop =0;
        })
        $('#confirm .no').on('click',function () {$('#confirm').css('display','none');})
      } else {
        $("#into_a").css("display", 'block');
        $state.go('into_a');
      }
    });//返回到第一个页面
    var subtn = $('#into_detail input.btn-success')[$('#into_detail .btn-success').length - 1];
    $(subtn).removeAttr('onclick');
    $(subtn).attr('form', "into_detail");
    $(subtn).val('申请进件');
    var inputL = $('#into_detail li>input');
    var inputF = $('#into_detail .img-li li form input');
    var textarea=$("#into_detail textarea");
    for (var i = 0; i < inputL.length; i++) {
      inputL[i].onblur = function () {
        if(this.validity.valid == false
          ||(this.required&&Sys.liulan=='safari'&&this.value.length<this.attributes['minlength'].nodeValue)
          ||(this.required&&Sys.liulan=='firefox'&&this.value.length<this.attributes['minlength'].value)
        ){
            $(this).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
          if(Sys.liulan=='safari'||Sys.liulan=='firefox'){
            if(this.attributes['xtype'])$(this).parent()[0].lastChild.innerHTML="";
          }else {
            if(this.attributes[this.attributes.length-1].nodeValue=='date')$(this).parent()[0].lastChild.innerHTML="";
          }
        }else {
          if(this.type!='button'){
            $(this).parent()[0].lastChild.innerHTML="";
          }
        }
      }
    };//表单input初验
    for (var i = 0; i < textarea.length; i++) {
      textarea[i].onblur = function () {
        if(this.validity.valid == false){
          $(this).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
        }else {
          if(this.type!='button'){
            $(this).parent()[0].lastChild.innerHTML="";
          }
        }
      }
    };//表单textarea初验
    $(subtn).on('click', function () {
      //var arrobj = Object.assign(obj,$scope.obj,subobj);//ECM6
      var selectList = $('#into_detail select');
      var theRequest = new Object();
      /*合并需提交的数据---开始*/
      for (var j = 0; j < selectList.length; j++) {
        var options=selectList[j].options;
        if(selectList[j].validity.valid==false){
          selectList[j].focus();
          return false;
        }
        for(var k=0;k<options.length;k++){
          if(options[k].selected)arrobj[selectList[j].name] = options[k].value;
        }
      }
      for(var i=0;i<textarea.length;i++){
        if(textarea[i].validity.valid==false){
          textarea[i].focus();
          $(textarea[i]).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
          return false;
        }
        arrobj[ textarea[i].name] = $.trim(textarea[i].value) ;
      }

      for (var i = 0; i < inputL.length; i++) {
        if (inputL[i].validity.valid == false
          ||(inputL[i].required&&Sys.liulan=='safari'&&inputL[i].value.length<inputL[i].attributes['minlength'].nodeValue)
          ||(inputL[i].required&&Sys.liulan=='firefox'&&inputL[i].value.length<inputL[i].attributes['minlength'].value)
        ) {
          inputL[i].focus();
          $(inputL[i]).parent()[0].lastChild.innerHTML="&nbsp;输入字符数不足或格式错误";
          return false;
        }
        arrobj[inputL[i].name] =$.trim(inputL[i].value);
      }
      for(var l=0;l<inputF.length;l++){
        if(inputF[l].validity.valid == false){
          $('#alert').css('display','block');
          $('#alert .modal-body').html($(inputF[l]).parent().next()[0].firstChild.innerHTML+"未上传");
          return false
        }
        arrobj[inputF[l].name] = inputF[l].value;
      }
      for (var key in obj) {
        arrobj[key] = obj[key]
      }
      for (var key in $scope.obj) {
        arrobj[key] = $scope.obj[key]
      }
      theRequest.paper = arrobj;
      theRequest.paper_channel = $scope.type;
      theRequest.mcode = $scope.obj.mcode;
      theRequest.paper.ref_store ={
        mcode:$scope.obj.ref_store_mcode,
        business_license:$scope.obj.ref_business_license_code
      };
      delete theRequest.paper.pay_mode_id;
      delete theRequest.paper.en;
      delete theRequest.paper.appId;
      delete theRequest.paper.submitTime;
      delete theRequest.paper.sign;
      if($scope.userId&&theRequest.paper.ext)theRequest.paper.ext.userId = $scope.userId;
      if($scope.userType&&theRequest.paper.ext)theRequest.paper.ext.userType = $scope.userType;
      if(local_try){
        if(ZanCun.dataToken){
          ZanCun.paper=theRequest.paper;
          $window.localStorage['ZanCun']=JSON.stringify(ZanCun);
        }//暂存进件表单信息
        if(order_woid.wo_id){
          order_woid.paper=theRequest.paper;
          $window.localStorage['order_woid']=JSON.stringify(order_woid);
        }//暂存补件表单信息
      }else {
        console.log('无痕模式我不管');
      }
      decorateBody(theRequest);
      /*合并需提交的数据---结束*/
      $(subtn).attr('disabled',true);
      if($scope.dataToken.wo_id){//补件提交
        $('#wodang').css('display','block');
        $scope.subm=$http.post(config.api + '/wo/reSubmitMerchantInfo',theRequest).success(function (data) {
          $('#wodang').css('display','none');
          if (data.code == 0) {
            $scope.success = true;
            $scope.hideF = true;
            $scope.href='../workorder/query.html#/detail/'+$scope.dataToken.wo_id;
            $('.breadcrumb').css('display', 'none');
            if(local_try){
              $window.localStorage.removeItem('supplement');
              $window.localStorage.removeItem('order_woid');
            }else {
              console.log('无痕模式我不管');
            }
          } else {
            $scope.err = data.info;
            $scope.erro = true;
            $scope.hideF = true;
            $('.breadcrumb').css('display', 'none');
            $(subtn).removeAttr('disabled');
          }
        }).error(function (data) {
          $('#wodang').css('display','none');
          $('#alert').css('display','block');
          $('#alert .modal-body').html('请求超时，请稍后重试');
          $(subtn).removeAttr('disabled');
        })
      }else {//正常提交
        $('#wodang').css('display','block');
        $scope.subm=$http.post(config.api + '/merchant/addMerchantInfo', theRequest).success(function (data) {
          if (data.code == 0) {
            /*$scope.success = true;
            $scope.hideF = true;
            $scope.href='../workorder/query.html#/detail/'+data.data[0].wo_id;
            $('.breadcrumb').css('display', 'none');*/
            if(local_try){
              $window.localStorage.removeItem('firstCun');
              $window.localStorage.removeItem('ZanCun');
            }else {
              console.log('无痕模式我不管');
            }
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
              $scope.success = true;
              $scope.hideF = true;
              $scope.href='../workorder/query.html#/detail/'+data.data[0].wo_id;
              $('.breadcrumb').css('display', 'none');
            }
          } else {
            $('#alert').css('display','block');
            $('#alert .modal-body').html(data.info);
            $(subtn).removeAttr('disabled');
            $('#wodang').css('display','none');
          }
        }).error(function (data) {
          $('#wodang').css('display','none');
          $('#alert').css('display','block');
          $('#alert .modal-body').html('请求超时，请稍后重试');
          $(subtn).removeAttr('disabled');
        })
      }
    });//提交表单
  } else {
    $state.go('into_a');
  }
})
