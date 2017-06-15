var app=angular.module('myapp', ['ng', 'ui.router','cgBusy']);
var formP=new Object();
app.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/order');
  $stateProvider.state("order",{
    url:"/order?form",
    templateUrl: 'tal/order.html',
    controller: 'order'
  })
  $stateProvider.state("detail",{
    url:"/detail/:dishId",
    templateUrl: 'tal/detail.html',
    controller: 'detail'
  })
}]);
app.value('cgBusyDefaults',{
  message:'Loading...',
  backdrop: false,
});
app.controller('order', function ($scope, $http,$state,$window,$anchorScroll,$rootScope) {
  $('#alert button').on('click',function () {$('#alert').css('display','none');/*$window.history.go(0);*/})
  var ttt=new Object();
  decorateBody(ttt);
  if(ttt.dataToken){
    $http.post(config.api+'/common/getData',ttt).success(function (data) {
      if(data.code==0){
        if(data.data[0].data.paper_channel)$scope.paper_channel=data.data[0].data.paper_channel;
        if(data.data[0].data.mcode){$scope.code=data.data[0].data.mcode;}
        if(data.data[0].data.mobile)$scope.mobile=data.data[0].data.mobile;
        if(data.data[0].data.userType)$scope.userType=data.data[0].data.userType;
        if(data.data[0].type)$scope.Type=data.data[0].type;
        $scope.userId=data.data[0].userId;
        if($scope.paper_channel==2||$scope.Type==2||$scope.userType==2){
          $('form input[name="mcode"]').removeAttr('required');
          $('form input[name="mcode"]').attr('placeholder',"mcode");
          $('form input[name="salesman_phone"]').remove();
        };
        queryT();
      }else {
        $('#alert').css('display','block');
        $('#alert .modal-body').html(data.info);
      }
    }).error(function () {
      $('#alert').css('display','block');
      $('#alert .modal-body').html('请求超时，请稍后重试');
    });
  }else {
    //if($state.params.form)queryT();
    if(isEmptyObject(formP)==false)queryT();
  }
  $scope.width=screen.width;
  $scope.form={};
  function queryT(num) {
    var theRequest = new Object();
    if(isEmptyObject(formP)==false){
      if(formP.salesman_phone)$scope.mobile =  formP.salesman_phone;
      if(formP.mcode)$scope.code =  formP.mcode;
      if(formP.wo_type)$scope.woType= formP.wo_type;
      if(formP.pay_mode_id)$scope.payId= formP.pay_mode_id;
      if(formP.num)num= formP.num;
    };
    if($scope.form&&$scope.form.mcode){theRequest.mcode=$.trim($scope.form.mcode);$scope.code= $scope.form.mcode;}
    else if($scope.code){theRequest.mcode=$.trim($scope.code);}
   if($scope.form&&$scope.form.salesman_phone){theRequest.salesman_phone=$.trim($scope.form.salesman_phone);$scope.mobile = $scope.form.salesman_phone;}
    else if($scope.mobile){theRequest.salesman_phone=$.trim($scope.mobile);}
    if($scope.paper_channel){theRequest.paper_channel=$scope.paper_channel;$scope.Num=$scope.paper_channel}
    if($scope.userId)theRequest.userId=$scope.userId;
    if($scope.Type)theRequest.type=$scope.Type;
    if($scope.userType)theRequest.userType=$scope.userType;
    if($scope.form&&$scope.form.wo_type) {
      theRequest.wo_type=$scope.form.wo_type;
      $scope.woType= $scope.form.wo_type;
    } else if($scope.woType){
      theRequest.wo_type=$scope.woType;
    }else {delete theRequest.wo_type;};
    if($scope.form&&$scope.form.pay_mode_id) {
      theRequest.pay_mode_id=$scope.form.pay_mode_id;
      $scope.payId= $scope.form.pay_mode_id;
    } else if($scope.payId){
      theRequest.pay_mode_id=$scope.payId;
    }else {delete theRequest.pay_mode_id;};
    theRequest.pageSize=25;
    theRequest.sortFiled='create_time';
    //theRequest.pageNum=num;
    if($scope.width<480&&num)theRequest.pageSize=num;
    if($scope.width>=480&&num)theRequest.pageNum=num;
    $scope.next=function () {
      $rootScope.hasBtn=true;
      if(isEmptyObject($scope.form)==false){$rootScope.form_p=$scope.form;}
      if(local_try){
        if(isEmptyObject($scope.form)==false){$window.sessionStorage['form_p']=JSON.stringify($scope.form);};
        $window.sessionStorage['hasBtn']=true;
      };
    };
    decorateBody(theRequest);
    delete theRequest.dataToken;
    if(theRequest.paper_channel==2||theRequest.type==2||theRequest.userType==2)delete theRequest.salesman_phone;
    if($(".loadmore").html()!='没有更多数据了')$scope.Promise=$http.post(config.api + '/webWo/getWOListCommon', theRequest).success(function (data) {
      if(data.code==0){
        $scope.disArr = data.data;
        if($scope.disArr.length==0){
          $scope.deng=true;
          $scope.hasshow=true;
          delete $scope.form.wo_type;
          delete $scope.form.pay_mode_id;
        }else {
          if($scope.width<480)$(".loadmore").css('display','block');
          $scope.hasshow=false;
          $scope.deng=true;
          for (var i = 0; i < $scope.disArr.length; i++) {
            $scope.disArr[i].num=i+1;
            var haoms=interval(data.data[i].begin_time,data.data[i].last_update_time);
            $scope.date=dateTime(haoms,'','');
            $scope.status = data.data[i].status;
            $scope.type = data.data[i].wo_type;
            if($scope.width<480){
              if($scope.date){
                $scope.disArr[i].date ="已处理"+$scope.date;
              }else {
                $scope.disArr[i].date ="等待处理";
              }
              $scope.disArr[i].mob_create_time=new Date(($scope.disArr[i].create_time).replace(/-/g, "/")).Format('yyyy-MM-dd hh:mm')
            }else {
              $scope.disArr[i].date=$scope.date;
            }
            if($scope.disArr[i].status==21){
              $scope.disArr[i].bgcolr="background:#393";
            }else if($scope.disArr[i].status==0){
              $scope.disArr[i].bgcolr="background:#933";
            }else if($scope.disArr[i].status==12){
              $scope.disArr[i].bgcolr="background:#e83";
            }else {$scope.disArr[i].bgcolr='background:#777';}
          }
          var numB=Math.ceil(data.total/theRequest.pageSize);
          if(numB>1&&$scope.width>=480){
            $(".tcdPageCode").css('display','block');
            $(".tcdPageCode").createPage({
              pageCount:numB,
              current:num,
            });
          }else {$(".tcdPageCode").css('display','none');};
          if($scope.width<480&&(data.total<=num||data.total<=25))$(".loadmore").html('没有更多数据了');
        }
      }else {
        $scope.deng=true;
        $scope.hasshow=true;
        delete $scope.form.wo_type;
        delete $scope.form.pay_mode_id;
      }
    }).error(function () {
      $scope.deng=true;
      $scope.hasshow=true;
      delete $scope.form.wo_type;
      delete $scope.form.pay_mode_id;
    });
  }
  $('form button').on('click',function () {
    for(var i=0;i<$('form input').length;i++){
      if($('form input')[i].validity.valid==false){
        $('form input')[i].focus();
        return false;
      }
    }
    $scope.form=$('form').serializeObject();
    //if($scope.form.wo_type=='')delete $scope.form.wo_type;
    $('.tcdPageCode').empty();
    queryT();
    $(".loadmore").html('加载更多...');
  });
  $(".tcdPageCode").createPage({
    backFn:function(p){
      document.documentElement.scrollTop = document.body.scrollTop =0;
      queryT(p);
      $scope.form.num=p;
    }
  });
  var numb=50;
  $window.onscroll=function(){
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    var Height=screen.height;
    $scope.top_order=function () {
      $anchorScroll();
    }
    if(top>Height/2){
      $(".footer").css("display","block");
    }else {
      $(".footer").css("display","none");
    };
    if(top>=(document.body.scrollHeight-Height)&&$scope.width<480){
      queryT(numb);
      $scope.form.num=numb;
      numb+=25;
    }
  };
});
app.filter("statusNum",function () {
  var statusTxt=function (num) {
    switch (num) {
      case 10:num = "待初审";break;
      case 11:num = "待复审";break;
      case 12:num = "待补充";break;
      case 21:num = "已完成";break;
      case 0:num = "已终止";break;
    }
    if(num=="direct"){return num= "直销"};
    return num;
  }
  return statusTxt;
});
app.filter("payNum",function () {
  var payTxt=function (num) {
    switch (num) {
      case 0:num = "不限";break;
      case 1006:num = "银行卡";break;
      case 1003:num = "微信";break;
      case 1004:num = "支付宝";break;
      case 1005:num = "百度钱包";break;
    }
    return num;
  }
  return payTxt;
});
app.filter("typeNum",function () {
  var typeTxt=function (num) {
    switch (num) {
      case 1:num = "进件";break;
      case 2:num = "增机";break;
      case 3:num = "换机";break;
      case 4:num = "配置";break;
    }
    return num;
  }
  return typeTxt;
});
app.controller('detail', function ($scope, $http, $state,$window,$anchorScroll,$rootScope) {
  $scope.width=screen.width;
  var hasBtn=$rootScope.hasBtn;
  if($rootScope.form_p)formP=$rootScope.form_p;
  if(local_try){
    hasBtn=$window.sessionStorage['hasBtn'];
    if($window.sessionStorage['form_p'])formP=JSON.parse($window.sessionStorage['form_p']);
  };
  $window.history.pushState(formP,'');
  $window.history.go(-1);
  var old=new Object();
  decorateBody(old);
  if(hasBtn){$scope.btn=false}else if(!old.dataToken){$scope.btn=true};
  $scope.before=function () {$state.go('order')};
  $window.onscroll=function(){
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    var Height=screen.height;
    $scope.top=function () {
      $anchorScroll();
    }
    if(top>Height/2){
      $(".footer").css("display","block");
    }else {
      $(".footer").css("display","none");
    }
  }
  var id = $state.params.dishId;
  if(id){
  var quest = new Object();
  quest.wo_id = id;
  quest.pageSize = 50;
  decorateBody(quest);
  $scope.Promise1=$http.post(config.api + '/webWo/getWODetailCommon', quest).success(function (data) {
    if(data.code==0){
      $scope.disarr = data.data;
      if($scope.disarr.length==0){
        $('#alert').css('display','block');
        $('#alert .modal-body').html("您商户的工单ID未查询到，请刷新重试!" +
          "<br>如有疑问，请联系客服<br>" +
          "<a href='tel:028-69296292'>028-69296292</a>");
      }
      $scope.merchant_name=data.data[0].merchant_name;
      $scope.status = data.data[0].status;
      $scope.paperchannel = data.data[0].paper_channel;
      switch ($scope.paperchannel) {
        case 1:$scope.paperChannel = "展业APP";break;
        case 2:$scope.paperChannel = "代理商平台";break;
        case 3:$scope.paperChannel = "人工";break;
      }
      $scope.disarr[0].paperchannel = $scope.paperChannel;
      $scope.Wotype = data.data[0].wo_type;
      var payChannel = data.data[0].payChannel;
      //var payPaper = data.data[0].paper;
      if(Array.prototype.isPrototypeOf(payChannel)&&payChannel.length){
        var channel = payChannel[0].channel;
        $scope.pay_mode_name=payChannel[0].pay_mode_name;
      }else {
        var channel = payChannel.channel;
        $scope.pay_mode_name=payChannel.pay_mode_name;
      };
      /*if(payPaper.ext.enlist.length){
       for(var payE=0;payE<payPaper.ext.enlist;payE++){
       if(payPaper.ext.enlist[payE]){

       }
       }
       }*/
      if($scope.Wotype==4){
        if(channel.length)$scope.name=channel[0].name;
      }else {$scope.zhifT=true}
      var arr=[],NameArr=[];
      if(data.data[0].enlist){
        $scope.device=data.data[0].enlist;
        for(var i=0;i<$scope.device.length;i++){
          arr.push($scope.device[i].en)
        }
        if($scope.device.length==0){$scope.showt=true;}
      }else {
        for (var k = 0; k < channel.length; k++) {
          var device_info = channel[k].device_info;
          if (device_info.length != 0) {
            $scope.device = channel[k].device_info;
            for(var j=0;j<$scope.device.length;j++){
              for(var l=0;l<$scope.device[j].length;l++){
                if($scope.device[j][l].key=='en'){
                  arr.push($scope.device[j][l].value);
                }
              }
            }
            if($scope.device.length==0){$scope.showt=true;}
          }else {
            $scope.showt=true;
          }
          if(channel[k].device_info)break;
        }
      }
      if(Array.prototype.isPrototypeOf(channel)){
        for(var n=0;n<channel.length;n++){
          if(channel[n].isOpen){
            NameArr.push(channel[n].name);
            $scope.name=NameArr.join('/');
          }
        }
        if(channel.length==0||(!$scope.name))$scope.name='';
      }else {
        if(channel.name){$scope.name=channel.name}else {$scope.name=''};
      }
      $scope.sheStr=arr.join('；')
    }else {
      $('#alert').css('display','block');
      $('#alert .modal-body').html(data.info);
    }
  }).error(function () {
    $('#alert').css('display','block');
    $('#alert .modal-body').html('获取数据超时，请稍后重试');
  })
    $scope.Promise2=$http.post(config.api + '/webWo/getWOLogCommon', quest).success(function (data) {
      if(data.code==0){
        $scope.arr = data.data;
        for(var i=0;i<$scope.arr.length;i++){
          var haoms=$scope.arr[i].process_period;
          $scope.date=dateTime(haoms,'(',')')
          $scope.arr[i].date=$scope.date;
          if($scope.arr[i].description.indexOf("将工单处理人指派为")!=-1){
            $scope.arr[i].description='指派工单处理人'
          }
        }
        if($scope.arr.length==0){
          $scope.showf=true;
        }
      }else {
        $('#alert').css('display','block');
        $('#alert .modal-body').html('获取工单日志信息失败，请稍后重试');
      }
  }).error(function () {
      $('#alert').css('display','block');
      $('#alert .modal-body').html('获取数据超时，请稍后重试');
    })
  }else{
    $state.go('order');
  }
  $('#alert button').on('click',function () {$('#alert').css('display','none');/*$window.history.go(0);*/})
})
