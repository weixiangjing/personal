var app = angular.module('myapp', ['ng', 'ui.router', 'cgBusy']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider.state("login", {
    url: "/login",
    templateUrl: 'tal/login.html',
    controller: 'login'
  })
  $stateProvider.state("muen", {
    url: "/muen",
    templateUrl: 'tal/muen.html',
    controller: 'muen'
  })
}]);
app.value('cgBusyDefaults',{
  message:'玩命加载中...',
  backdrop: false,
});
function setStore(k, v) {sessionStorage.setItem(k,typeof v=== "object" ? JSON.stringify(v) : v )}
function getStore(key) {
  var obj = sessionStorage.getItem(key);
  try {
    obj = JSON.parse(obj);
  } catch (e) {
    return false
  }
  return obj || null;
}
const cacheStore='CACHE';
app.controller('login',function ($scope,$rootScope,$state,$http) {
  $scope.arr=['招聘者','游客'];
  $scope.form_obj=new Object();
  $scope.keyword=function (e) {
    $scope.form_obj.role=e.v;
    if(e.v=='招聘者'){$scope._role=true;}else {$scope._role=false;}
  };
  $scope.onchange=function () {
    if($scope.form_obj.role.indexOf('招聘')!=-1){$scope._role=true;}else {$scope._role=false;}
    $scope.role_err='';
  };
  $scope.salaryOnchange=function () {
    if(!/^[0-9]+$/.test($scope.form_obj.salary)){$scope.salary_err='薪资只能是纯数字格式';}else {$scope.salary_err='';}
    if(!$scope.form_obj.salary)$scope.salary_err='';
  }
  $scope.submit=function () {
    if(!$scope.form_obj.role){$scope.role_err='请输入角色';return false;}
    if($scope.form_obj.salary){
      if($scope.salary_err){return false;}
      if(6000>=$scope.form_obj.salary>4000){
        $http.post('sever/sever5.json').success(function (data) {
          $rootScope.Permissions=data;
          setStore(cacheStore,data)
          $state.go('muen');
        })}
      if($scope.form_obj.salary>6000){
        $http.post('sever/sever6.json').success(function (data) {
          $rootScope.Permissions=data;
          setStore(cacheStore,data)
          $state.go('muen');
        })
      }
    }
    if(!$scope.form_obj.salary||$scope.form_obj.salary<=4000){
      $http.get('sever/sever4.json').success(function (data) {
        $rootScope.Permissions=data;
        setStore(cacheStore,data)
        $state.go('muen');
      })
    }
  }
})


app.controller('muen',function ($scope,$rootScope,$state) {
  $scope.exit=function () {$state.go('login');}
  $scope.isLogin=true;
  console.log(getStore(cacheStore))
  $scope.navLeft=$rootScope.Permissions?$rootScope.Permissions[0].children:getStore(cacheStore)[0].children;
  $scope.headers=$rootScope.Permissions?$rootScope.Permissions:getStore(cacheStore);
  $scope.headers[0].class='active';
  $scope.HeadRoute='user';
  $scope.active=function (e) {
    for(var i=0;i<$scope.navLeft.length;i++){
      if(e.link.route==$scope.navLeft[i].route){
        $scope.navLeft[i].class='active'
      }else {$scope.navLeft[i].class=''}
    }
    $scope.activ=e.link.route;
    if( $scope.activ=='planewar'){var timer=setTimeout(function(){$scope.planewar()},100);}
  }
  $scope.onClickHead=function (e) {
    for(var i=0;i<$scope.headers.length;i++){
      if(e.link.route==$scope.headers[i].route){
        $scope.headers[i].class='active';
        $scope.navLeft=$scope.headers[i].children;
      }else {$scope.headers[i].class=''}
    }
    $scope.HeadRoute=e.link.route;
  }
  $scope.writeNum=function (e) {
    if(e.gameNum){
      if(!/^[2-8]$/.test(e.gameNum)){$scope.write_err='请输入2-8的纯数字';}else {$scope.write_err='';}
    }else {
      $scope.write_err=''
    }
    $scope.gameNum=e.gameNum;
  }
  $scope.startGame=function () {
    if(!$scope.gameNum||$scope.write_err)return false;
    if($scope.gameNum>8)$scope.gameNum=8;
    $scope.game={
      data:null,//保存游戏数据
      RN:$scope.gameNum,//保存总行数
      CN:$scope.gameNum,//保存总列数
      score:0,//保存目前分数
      top:0,//保存最高分
      state:1,//游戏的状态：进行中:1  结束:0
      GAMEOVER:0,//结束状态
      RUNNING:1,//运行状态
      init:function(){//生成gridpanel中的所有div
        var arr=[];
        var div=document.getElementById("gridpanl");
        div.style.width=this.CN*116+16+"px";
        div.style.height=this.RN*116+16+"px";
        for (var r=0;r<this.RN;r++)
        {
          for (var c=0;c<this.CN;c++)
          {
            arr.push(""+r+c);
          }
        }
        var grids='<div id="j'+arr.join('" class="grid"></div><div id="j')+'" class="grid"></div>';
        var cells='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
        div.innerHTML=grids+cells;
      },
      start:function(){//负责启动游戏
        this.init();//调用init初始化页面格子div
        this.score=0;//分数清零
        this.state=this.RUNNING;//初始化游戏状态为运行
        //从cookie中读取最大值
        if(document.cookie.indexOf("=")!=-1){
          this.top=parseInt(document.cookie.split("=")[1]);
        }
        this.data=[];//初始化data为空数组
        for (var r=0;r<this.RN;r++)//r从0开始，到<rn结束,r++
        {
          this.data[r]=[];//设置data中r位置为空数组
          for (var c=0;c<this.CN;c++)//c从0开始，到<cn结束,c++
          {
            this.data[r][c]=0;//将data中r行c列设置为0
          }
        }
        //调用randomNum随即生成2个2或4
        this.randomNum();
        this.randomNum();
        this.updataView();
        var me=this;
        //为当前页面注册键盘事件
        document.onkeydown=function(e){
          //获得事件对象--事件发生时自动封装事件信息的对象
          e=window.event||e;
          //根据不同的按键，调用不同的方法
          switch(e.keyCode){
            case 37:me.moveLeft();break;
            case 38:me.moveUp();break;
            case 39:me.moveRight();break;
            case 40:me.moveDown();break;
          }
        }
      },
      /****左移****/

      moveLeft:function(){//左移所有行
        var before=String(this.data);//移动前
        for (var r=0;r<this.RN;r++)//r从0开始，到<RN结束，遍历data中每一行
        {
          this.moveLeftInRow(r);//调用moveLeftInRow(r)，移动第r行
        }
        //(遍历结束)
        var after=String(this.data);//移动后
        //如果发生移动，随机生成数,更新页面
        if(before!=after){
          this.randomNum();
          if (this.isGameOver())
          {
            this.state=this.GAMEOVER;
            if (this.score>this.top)
            {
              var now=new Date();
              now.setFullYear(now.getFullYear()+1);
              document.cookie="top1="+this.score+";expires="+now.toGMTString();
            }
          };
          this.updataView();
        }

      },
      moveLeftInRow:function(r){//左移第r行
        for(var c=0;c<this.CN-1;c++){//c从0开始，到<CN-1结束，每次增1
          //调用getNextInRow(r,c),查找r行c位置之后，下一个不为0的位置，保存在变量nextc中
          var nextc=this.getNextInRow(r,c);
          if (nextc==-1){break;}//如果nextc等于-1，就退出循环
          else{//否则
            if(this.data[r][c]==0){//如果data中r行c列为0
              this.data[r][c]=this.data[r][nextc];//将data中r行nextc位置的值赋值给c位置
              this.data[r][nextc]=0;//将data中r行nextc位置重置为0
              c--;//c--;//让c倒退一步，抵消c++，留在原地
            }
            //否则
            else if(this.data[r][c]==this.data[r][nextc]){//如果data中r行c列的值等于data中r行nextc列的值
              this.data[r][c]*=2; //将data中r行c列的值*=2;
              this.data[r][nextc]=0;//将data中r行nextc的值设置为0
              this.score+=this.data[r][c];
            }
          }
        }
      },
      //查找r行c列之后下一个不为0的位置
      getNextInRow:function(r,c){
        for (var nextc=c+1;nextc<this.CN;nextc++ )//nextc从c+1开始，到<CN结束，每次增1
        {
          if (this.data[r][nextc]!=0)//如果data中r行nextc位置不等于0
          {
            return nextc;//就返回nextc
          }
        }
        return -1;//(遍历结束)返回-1
      },

      /****右移****/
      moveRight:function(){//右移所有行
        var before=String(this.data);//移动前
        for (var r=0;r<this.RN;r++)//r从0开始，到<RN结束，遍历data中每一行
        {
          this.moveRightInRow(r);//调用moveRightInRow(r)，移动第r行
        }
        //(遍历结束)
        var after=String(this.data);//移动后
        //如果发生移动，随机生成数,更新页面
        if(before!=after){
          this.randomNum();
          if (this.isGameOver())
          {
            this.state=this.GAMEOVER;
            if (this.score>this.top)
            {
              var now=new Date();
              now.setFullYear(now.getFullYear()+1);
              document.cookie="top1="+this.score+";expires="+now.toGMTString();
            }
          };
          this.updataView();
        }
      },
      moveRightInRow:function(r){//右移第r行
        for(var c=this.CN-1;c>0;c--){//c从this.CN-1开始，到>0结束，每次-1
          //调用getPrevInRow(r,c),查找r行c位置之前，下一个不为0的位置，保存在变量prevc中
          var prevc=this.getPrevInRow(r,c);
          if (prevc==-1){break;}//如果nextc等于-1，就退出循环
          else{//否则
            if(this.data[r][c]==0){//如果data中r行c列为0
              this.data[r][c]=this.data[r][prevc];//将data中r行prevc位置的值赋值给c位置
              this.data[r][prevc]=0;//将data中r行prevc位置重置为0
              c++;//c++;//让c倒退一步，抵消c--，留在原地
            }
            //否则
            else if(this.data[r][c]==this.data[r][prevc]){//如果data中r行c列的值等于data中r行prevc列的值
              this.data[r][c]*=2; //将data中r行c列的值*=2;
              this.data[r][prevc]=0;//将data中r行prevc的值设置为0
              this.score+=this.data[r][c];
            }
          }
        }
      },
      //查找r行c列之前下一个不为0的位置
      getPrevInRow:function(r,c){
        for (var prevc=c-1;prevc>=0;prevc-- )//prevc从C-1开始，到>=0结束，每次-1
        {
          if (this.data[r][prevc]!=0)//如果data中r行prevc位置不等于0
          {
            return prevc;//就返回prevc
          }
        }
        return -1;//(遍历结束)返回-1
      },

      /*****上移*****/

      moveUp:function(){//上移所有列
        var before=String(this.data);//移动前
        for (var c=0;c<this.CN;c++)//r从0开始，到<RN结束，遍历data中每一行
        {
          this.moveUpInCol(c);//调用moveLeftInRow(c)，移动第c行
        }
        //(遍历结束)
        var after=String(this.data);//移动后
        //如果发生移动，随机生成数,更新页面
        if(before!=after){
          this.randomNum();
          if (this.isGameOver())
          {
            this.state=this.GAMEOVER;
            if (this.score>this.top)
            {
              var now=new Date();
              now.setFullYear(now.getFullYear()+1);
              document.cookie="top1="+this.score+";expires="+now.toGMTString();
            }
          };
          this.updataView();
        }
      },
      moveUpInCol:function(c){//上移第c列
        for(var r=0;r<this.RN-1;r++){//c从this.CN-1开始，到>0结束，每次-1
          //调用getPrevInRow(r,c),查找r行c位置之前，下一个不为0的位置，保存在变量prevc中
          var nextr=this.getNextrIncol(r,c);
          if (nextr==-1){break;}//如果nextc等于-1，就退出循环
          else{//否则
            if(this.data[r][c]==0){//如果data中r行c列为0
              this.data[r][c]=this.data[nextr][c];//将data中r行prevc位置的值赋值给c位置
              this.data[nextr][c]=0;//将data中r行prevc位置重置为0
              r--;//c++;//让c倒退一步，抵消c--，留在原地
            }
            //否则
            else if(this.data[r][c]==this.data[nextr][c]){//如果data中r行c列的值等于data中r行prevc列的值
              this.data[r][c]*=2; //将data中r行c列的值*=2;
              this.data[nextr][c]=0;//将data中r行prevc的值设置为0
              this.score+=this.data[r][c];
            }
          }
        }
      },
      //查找r行c列之前下一个不为0的位置
      getNextrIncol:function(r,c){
        for (var nextr=r+1;nextr<this.RN;nextr++ )//prevc从CN-1开始，到>=0结束，每次-1
        {
          if (this.data[nextr][c]!=0)//如果data中r行nextc位置不等于0
          {
            return nextr;//就返回nextc
          }
        }
        return -1;//(遍历结束)返回-1
      },

      /*****下移******/
      moveDown:function(){//右移所有行
        var before=String(this.data);//移动前
        for (var c=0;c<this.CN;c++)//r从0开始，到<RN结束，遍历data中每一行
        {
          this.moveDownInCol(c);//调用moveRightInRow(r)，移动第r行
        }
        //(遍历结束)
        var after=String(this.data);//移动后
        //如果发生移动，随机生成数,更新页面
        if(before!=after){
          this.randomNum();
          if (this.isGameOver())
          {
            this.state=this.GAMEOVER;
            if (this.score>this.top)
            {
              var now=new Date();
              now.setFullYear(now.getFullYear()+1);
              document.cookie="top1="+this.score+";expires="+now.toGMTString();
            }
          };
          this.updataView();
        }
      },
      moveDownInCol:function(c){//右移第r行
        for(var r=this.RN-1;r>0;r--){//c从this.CN-1开始，到>0结束，每次-1
          //调用getPrevInRow(r,c),查找r行c位置之前，下一个不为0的位置，保存在变量prevc中
          var prevr=this.getPrevInCol(r,c);
          if (prevr==-1){break;}//如果nextc等于-1，就退出循环
          else{//否则
            if(this.data[r][c]==0){//如果data中r行c列为0
              this.data[r][c]=this.data[prevr][c];//将data中r行prevc位置的值赋值给c位置
              this.data[prevr][c]=0;//将data中r行prevc位置重置为0
              r++;//c++;//让c倒退一步，抵消c--，留在原地
            }
            //否则
            else if(this.data[r][c]==this.data[prevr][c]){//如果data中r行c列的值等于data中r行prevc列的值
              this.data[r][c]*=2; //将data中r行c列的值*=2;
              this.data[prevr][c]=0;//将data中r行prevc的值设置为0
              this.score+=this.data[r][c];
            }
          }
        }
      },
      //查找r行c列之前下一个不为0的位置
      getPrevInCol:function(r,c){
        for (var prevr=r-1;prevr>=0;prevr-- )//prevc从C-1开始，到>=0结束，每次-1
        {
          if (this.data[prevr][c]!=0)//如果data中r行prevc位置不等于0
          {
            return prevr;//就返回prevc
          }
        }
        return -1;//(遍历结束)返回-1
      },
      updataView:function(){//将data中数据更新到页面
        //遍历data中每个元素
        for (var r=0;r<this.RN;r++)
        {
          for (var c=0;c<this.CN;c++)
          {	//找到id为"c"+r+c的div，保存在变量div中
            var d=document.getElementById("c"+r+c);
            //如果data中当前元素不等于0
            if (this.data[r][c]!=0)
            {
              //设置div的内容为data中当前元素的值
              d.innerHTML=this.data[r][c];
              //设置div的className为"cell n"+data中当前元素的值
              d.className="cell n"+this.data[r][c];
            }//否则
            else{
              d.innerHTML="";//清空div的内容
              d.className="cell";//设置div的className为"cell"
            }
          }
        }
        document.getElementById("score").innerHTML=this.score;
        document.getElementById("topscore").innerHTML=this.top;
        if (this.state==this.GAMEOVER)
        {
          document.getElementById("gameover").style.display="block";
          document.getElementById("finalScore").innerHTML=this.score;
        }else{
          document.getElementById("gameover").style.display="none";}
      },
      randomNum:function(){//负责在随机位置生成2或4
        //反复执行
        while(true){
          //在0~RN-1随机生成r
          var r=parseInt(Math.random()*this.RN);
          //在0~CN-1随机生成c
          var c=parseInt(Math.random()*this.CN);
          //如果data中r行c列为0
          if (this.data[r][c]==0)
          {//设置data中r行c列的值为
            //如果math.random()小于0.5就赋值2，否则赋值4
            this.data[r][c]=Math.random()<0.5?2:4;
            break;//退出循环
          }
        }
      },
      isGameOver:function(){//检查当前游戏是否结束
        //遍历data中每个元素
        for(var r=0;r<this.RN;r++){
          for(var c=0;c<this.CN;c++){
            //如果当前元素是0，返回false
            if(this.data[r][c]==0){return false;}
            //否则，如果c<CN-1,而且当前元素等于右侧元素
            else if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){
              return false;//返回false
            }
            //否则，如果R<rn-1，而且当前元素等于下方元素
            else if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){
              return false;//返回false
            }
          }
        }
        return true;//遍历结束返回true
      }
    }
    $scope.game.start();
  }
  $scope.planewar=function () {
    /**游戏基本设置**/
    var WIDTH = window.innerWidth;//480;
    var HEIGHT = window.innerHeight;//650;
    var bulletSpeed = 10;//初始子弹速度
    var bulletRate = 10;//初始每50*4ms发射一次子弹
    var enemy1Speed = 5;//初始敌机速度
    var enemy2Speed = 3;
    var enemy3Speed = 2;
    var difficulty = 500;//难度50~150
    var heroLife = 3;
    var SCORE = 0;
    var TopScore = 0;
    var canvas = document.getElementById("plane");
    if (WIDTH >= 480) {
      WIDTH = 480;
      HEIGHT = 650;
    }
    ;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    var ctx = canvas.getContext("2d");
    const PHASE_READY = 1;
    /**就绪阶段**/
    const PHASE_LOADING = 2;
    /**加载阶段**/
    const PHASE_PLAY = 3;
    /**游戏阶段**/
    const PHASE_PAUSE = 4;
    /**暂停阶段**/
    const PHASE_GAMEOVER = 5;
    /**结束阶段**/
    var curPhase = 0;//当前阶段
    if (SCORE >= 1000) {//提升游戏难度
      bulletSpeed = 12;
      bulletRate = 12;
      enemy1Speed = 6;
      enemy2Speed = 4;
      enemy3Speed = 3;
    }
    else if (SCORE >= 2000) {
      bulletSpeed = 15;
      bulletRate = 15;
      enemy1Speed = 8;
      enemy2Speed = 5;
      enemy3Speed = 4;
    } else if (SCORE > 3000) {
      bulletSpeed = 20;
      bulletRate = 20;
      enemy1Speed = 10;
      enemy2Speed = 6;
      enemy3Speed = 5;
    }
    ;

    /**第一阶段**/
    var bgImg = new Image();
    bgImg.src = "img/background.png";
    var logo = new Image();
    logo.src = "img/start.png";
    var sky = null;
    bgImg.onload = function () {
      curPhase = PHASE_READY;
      sky = new Sky(this);
    };
    function Sky(bgImg) {
      this.x1 = 0;
      this.y1 = 0;
      this.x2 = 0;
      this.y2 = -bgImg.height;
      this.draw = function () {
        ctx.drawImage(bgImg, this.x1, this.y1);
        ctx.drawImage(bgImg, this.x2, this.y2);
      };
      this.move = function () {
        this.y1++;
        this.y2++;
        if (this.y1 >= HEIGHT) {
          this.y1 = this.y2 - bgImg.height
        }
        ;
        if (this.y2 >= HEIGHT) {
          this.y2 = this.y1 - bgImg.height
        }
        ;
      };
    };
    /**第二阶段**/
    var loadingImgs = [];
    loadingImgs[0] = new Image();
    loadingImgs[0].src = "img/game_loading1.png";
    loadingImgs[1] = new Image();
    loadingImgs[1].src = "img/game_loading2.png";
    loadingImgs[2] = new Image();
    loadingImgs[2].src = "img/game_loading3.png";
    loadingImgs[3] = new Image();
    loadingImgs[3].src = "img/game_loading4.png";
    function Loading(imgs) {
      this.index = 0;//需要绘制图的下标
      this.moveCount = 0;
      this.draw = function () {
        ctx.drawImage(imgs[this.index], this.index * imgs[this.index].width, HEIGHT - imgs[this.index].height);
      };
      this.move = function () {
        this.moveCount++;
        if (this.moveCount % 6 == 0) {
          this.index++;
          if (this.index >= imgs.length) {
            curPhase = PHASE_PLAY;
            if (document.cookie.indexOf("=") != -1) {
              TopScore = parseInt(document.cookie.split("=")[1]);
            }
          }
        }
      }
    };
    var loading = new Loading(loadingImgs);
    canvas.onclick = function () {
      if (curPhase === PHASE_READY) {
        curPhase = PHASE_LOADING;
      }
      if (curPhase == PHASE_GAMEOVER) {
        curPhase = PHASE_PLAY;
        heroLife = 2;
        SCORE = 0;
      }
    };
    /**第三阶段**/
    var heroImgs = [];
    heroImgs[0] = new Image();
    heroImgs[0].src = "img/hero1.png";
    heroImgs[1] = new Image();
    heroImgs[1].src = "img/hero2.png";
    heroImgs[2] = new Image();
    heroImgs[2].src = "img/hero_blowup_n1.png";
    heroImgs[3] = new Image();
    heroImgs[3].src = "img/hero_blowup_n2.png";
    heroImgs[4] = new Image();
    heroImgs[4].src = "img/hero_blowup_n3.png";
    heroImgs[5] = new Image();
    heroImgs[5].src = "img/hero_blowup_n4.png";
    function Hero(imgs) {
      this.index = 0;
      if(WIDTH<480){
        this.width=parseInt(99*WIDTH/480);
        this.height=parseInt(124*WIDTH/480);
      }else{
        this.width = 99;
        this.height = 124;
      };
      this.movecount = 0;
      this.crashed = false;
      this.canDelete = false;
      this.x = (WIDTH - this.width) / 2;
      this.y = HEIGHT - this.height;
      this.draw = function () {
        if (!this.canDelete) {
          ctx.drawImage(imgs[this.index], this.x, this.y);
        }
      };
      this.move = function () {
        if (this.index == 0) {
          this.index = 1
        } else if (this.index == 1) {
          this.index = 0
        }
        ;
        this.movecount++;
        if (this.movecount >= bulletRate) {
          this.fire();
          this.movecount = 0;
        }
        ;
        if (this.crashed) {//crashed为true,开始坠毁
          if (this.index == 0 || this.index == 1) {
            this.index = 2;
          } else if (this.index >= imgs.length - 1) {
            this.canDelete = true;
            heroLife--;
            if (heroLife < 0) {
              curPhase = PHASE_GAMEOVER;
            } else {
              hero = new Hero(heroImgs);
            }
          } else {
            this.index++;
          }
        }
      };
      this.fire = function () {
        bulletList.list.push(new Bullet(bulletImg));
      }
    };
    var hero = new Hero(heroImgs);
    if (WIDTH < 480) {
      canvas.ontouchmove =function(e) {
        e.preventDefault();
        var touch = e.touches[0];
        if (curPhase === PHASE_PLAY) {
          var x = touch.pageX;
          var y = touch.pageY;
          hero.x = x - heroImgs[hero.index].width / 2;
          hero.y = y - heroImgs[hero.index].height / 2;
          console.log(x);
        }
        ;
        if (curPhase == PHASE_PAUSE) {
          curPhase = PHASE_PLAY;
        }
      };
    }
    else {
      canvas.onmousemove = function (e) {
        if (curPhase === PHASE_PLAY) {
          var x = e.offsetX;
          var y = e.offsetY;
          hero.x = x - heroImgs[hero.index].width / 2;
          hero.y = y - heroImgs[hero.index].height / 2;
        }
        ;
        if (curPhase == PHASE_PAUSE) {
          curPhase = PHASE_PLAY;
        }
      };
    }
    ;
//3.2绘制子弹
    var bulletImg = new Image();
    bulletImg.src = "img/bullet.png";
    function Bullet(img) {
      if(WIDTH<480){
        this.width=parseInt(9*WIDTH/480);
        this.height=parseInt(21*WIDTH/480);
        this.x = hero.x + (hero.width+this.width)/2;
      }else{
        this.width = 9;
        this.height = 21;
        this.x = hero.x + (hero.width - this.width) / 2;
      };
      this.canDelete = false;
      this.crashed = false;
      this.y = hero.y - this.height;
      this.x1 = this.x - hero.width / 4;
      this.x2 = this.x + hero.width / 4;
      this.draw = function () {
        if (SCORE < 1000) {
          ctx.drawImage(img, this.x, this.y)
        }
        else if (SCORE < 2000) {
          ctx.drawImage(img, this.x1, this.y);
          ctx.drawImage(img, this.x2, this.y)
        } else if (SCORE > 3000) {
          ctx.drawImage(img, this.x, this.y);
          ctx.drawImage(img, this.x1, this.y);
          ctx.drawImage(img, this.x2, this.y)
        }
        ;

      };
      this.move = function () {
        this.y -= bulletSpeed;
        if (this.y <= -this.height || this.crashed) {
          this.canDelete = true;
        }
      }
    };
    function BulletList() {
      this.list = [];//保存屏幕中所有的子弹
      this.draw = function () {
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].draw();
        }
      };
      this.move = function () {
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].move();
          if (this.list[i].canDelete) {
            this.list.splice(i, 1);
            i--;
          }
        }
      }
    }
    var bulletList = new BulletList();
//3.3绘制敌机
    var enemy1Imgs = [];
    enemy1Imgs[0] = new Image();
    enemy1Imgs[0].src = "img/enemy1.png";
    enemy1Imgs[1] = new Image();
    enemy1Imgs[1].src = "img/enemy1_down1.png";
    enemy1Imgs[2] = new Image();
    enemy1Imgs[2].src = "img/enemy1_down2.png";
    enemy1Imgs[3] = new Image();
    enemy1Imgs[3].src = "img/enemy1_down3.png";
    enemy1Imgs[4] = new Image();
    enemy1Imgs[4].src = "img/enemy1_down4.png";
    var enemy2Imgs = [];
    enemy2Imgs[0] = new Image();
    enemy2Imgs[0].src = "img/enemy2.png";
    enemy2Imgs[1] = new Image();
    enemy2Imgs[1].src = "img/enemy2_down1.png";
    enemy2Imgs[2] = new Image();
    enemy2Imgs[2].src = "img/enemy2_down2.png";
    enemy2Imgs[3] = new Image();
    enemy2Imgs[3].src = "img/enemy2_down3.png";
    enemy2Imgs[4] = new Image();
    enemy2Imgs[4].src = "img/enemy2_down4.png";
    var enemy3Imgs = [];
    enemy3Imgs[0] = new Image();
    enemy3Imgs[0].src = "img/enemy3_n1.png";
    enemy3Imgs[1] = new Image();
    enemy3Imgs[1].src = "img/enemy3_n2.png";
    enemy3Imgs[2] = new Image();
    enemy3Imgs[2].src = "img/enemy3_down1.png";
    enemy3Imgs[3] = new Image();
    enemy3Imgs[3].src = "img/enemy3_down2.png";
    enemy3Imgs[4] = new Image();
    enemy3Imgs[4].src = "img/enemy3_down3.png";
    enemy3Imgs[5] = new Image();
    enemy3Imgs[5].src = "img/enemy3_down4.png";
    enemy3Imgs[6] = new Image();
    enemy3Imgs[6].src = "img/enemy3_down5.png";
    enemy3Imgs[7] = new Image();
    enemy3Imgs[7].src = "img/enemy3_down6.png";
    function Enemy1(imgs) {
      this.index = 0;
      if(WIDTH<480){
        this.width=parseInt(57*WIDTH/480);
        this.height=parseInt(51*WIDTH/480);
      }else{
        this.width = 57;
        this.height = 51;
      };
      this.canDelete = false;
      this.life = 1;//1条命
      this.crashed = false;//炸毁状态
      this.x = Math.random() * (WIDTH - this.width + 1);
      this.y = -this.height;
      this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y)
      };
      this.move = function () {
        this.y += enemy1Speed;
        if (this.y >= HEIGHT) {
          this.canDelete = true;
        }
        ;
        if (this.crashed) {//crashed为true,开始坠毁
          if (this.index == 0) {
            this.index = 1;
          } else if (this.index >= imgs.length - 1) {
            this.canDelete = true;
          } else {
            this.index++;
          }
          ;
        }
      };
      this.hit = function (target) {//target表撞击目标
        if ((this.x + this.width >= target.x || this.x + this.width >= target.x1 || this.x + this.width >= target.x2) &&
            (target.x + target.width >= this.x || target.x1 + target.width >= this.x || target.x2 + target.width >= this.x)
            && this.y + this.height >= target.y
            && target.y + target.height >= this.y) {
          this.life--;
          if (this.life <= 0) {
            this.crashed = true;
            SCORE += 10;
          }
          ;
          target.crashed = true;
        }
      }
    };
    function Enemy2(imgs) {
      this.index = 0;
      if(WIDTH<480){
        this.width=parseInt(69*WIDTH/480);
        this.height=parseInt(95*WIDTH/480);
      }else{
        this.width = 69;
        this.height = 95;
      };
      this.canDelete = false;
      this.life = 3;
      this.crashed = false;
      this.x = Math.random() * (WIDTH - this.width + 1);
      this.y = -this.height;
      this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y)
      };
      this.move = function () {
        this.y += enemy2Speed;
        if (this.y >= HEIGHT) {
          this.canDelete = true;
        }
        ;
        if (this.crashed) {//crashed为true,开始坠毁
          if (this.index == 0) {
            this.index = 1;
          } else if (this.index >= imgs.length - 1) {
            this.canDelete = true;
          } else {
            this.index++;
          }
          ;
        }
      };
      this.hit = function (target) {//target表撞击目标
        if ((this.x + this.width >= target.x)
            && (target.x + target.width >= this.x)
            && (this.y + this.height >= target.y)
            && (target.y + target.height >= this.y)) {
          this.life--;
          if (this.life <= 0) {
            this.crashed = true;
            SCORE += 30;
          }
          ;
          target.crashed = true;
        }
      }
    };
    function Enemy3(imgs) {
      this.index = 0;
      if(WIDTH<480){
        this.width=parseInt(169*WIDTH/480);
        this.height=parseInt(258*WIDTH/480);
      }else{
        this.width = 169;
        this.height = 258;
      };
      this.canDelete = false;
      this.life = 6;
      this.crashed = false;
      this.x = Math.random() * (WIDTH - this.width + 1);
      this.y = -this.height;
      this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y)
      };
      this.move = function () {
        //this.index=this.index===0?1:0;
        if (this.index == 0) {
          this.index = 1
        }
        else if (this.index == 1) {
          this.index = 0
        }
        ;
        this.y += enemy3Speed;
        if (this.y >= HEIGHT) {
          this.canDelete = true;
        }
        ;
        if (this.crashed) {//crashed为true,开始坠毁
          if (this.index == 0 || this.index == 1) {
            this.index = 2;
          } else if (this.index >= imgs.length - 1) {
            this.canDelete = true;
          } else {
            this.index++;
          }
          ;
        }
      };
      this.hit = function (target) {//target表撞击目标
        if ((this.x + this.width >= target.x)
            && (target.x + target.width >= this.x)
            && (this.y + this.height >= target.y)
            && (target.y + target.height >= this.y)) {
          this.life--;
          if (this.life <= 0) {
            this.crashed = true;
            SCORE += 50;
          }
          ;
          target.crashed = true;
        }
      }
    };
//构建敌机列表
    function EnemyList() {
      this.list = [];
      this.draw = function () {
        this.generate();//生成敌机
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].draw();
        }
      }
      this.move = function () {
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].move();//敌机每移动一次都做子弹与敌机的碰撞检验
          for (var j = 0; j <= bulletList.list.length; j++) {
            var b = bulletList.list[j];
            if (b != undefined) {
              this.list[i].hit(b);
            }
          }
          ;
          this.list[i].hit(hero);
          if (this.list[i].canDelete) {
            this.list.splice(i, 1);
            i--;
          }
        }
      };
      this.generate = function () {//生成敌机
        if (SCORE < 1000) {
          difficulty = 400;
        }
        else if (SCORE < 2000) {
          difficulty = 300;
        } else if (SCORE < 3000) {
          difficulty = 200;
        }
        ;
        var num = parseInt(Math.random() * difficulty + 1);//500敌机出现的频率
        if (num == 1) {
          enemyList.list.push(new Enemy3(enemy3Imgs))
        } else if (num <= 4) {
          enemyList.list.push(new Enemy2(enemy2Imgs))
        } else if (num <= 10) {
          enemyList.list.push(new Enemy1(enemy1Imgs))
        }
      }
    };
    var enemyList = new EnemyList();
    function drawHeroLife() {
      var txt = "LIFE:" + heroLife;
      ctx.font = "18px 'Helvetica Neue'";
      var w = ctx.measureText(txt).width;
      ctx.fillText(txt, WIDTH - w - 10, 25)
    };
    function drawGameOver() {
      var txt = "GameOver";
      ctx.font = "50px 'Helvetica Neue'";
      var w = ctx.measureText(txt).width;
      ctx.fillText(txt, (WIDTH - w) / 2, (HEIGHT + 50) / 2)
    };
    function drawScore() {
      var txt = "Score:" + SCORE;
      ctx.font = "18px 'Helvetica Neue'";
      ctx.fillText(txt, 10, 25)
    };
    function drawTopScore() {
      if (TopScore <= SCORE) {
        TopScore = SCORE;
      }
      ;
      var txt = "TopScore:" + TopScore;
      ctx.font = "18px 'Helvetica Neue'";
      var w = ctx.measureText(txt).width;
      ctx.fillText(txt, (WIDTH - w) / 2, 25)
    }
    canvas.onmouseout = function () {
      if (curPhase == PHASE_PLAY) {
        curPhase = PHASE_PAUSE;
      }
    };
    canvas.ontouchend = function () {
      if (curPhase == PHASE_PLAY) {
        curPhase = PHASE_PAUSE;
      }
    };

    function drawPause() {
      var pause = new Image();
      pause.src = "img/game_pause_nor.png";
      ctx.drawImage(pause, (WIDTH - pause.width) / 2, (HEIGHT - pause.height) / 2);
    }
//3.4子弹碰敌机
//为敌机添加属性life,炸毁状态crashed
//子弹命中敌机hit,
//3.5英雄碰敌机
    /**第四阶段**/
    /**第五阶段**/
    /**游戏主定时器**/

    var timer = setInterval(function () {
      sky.draw();
      sky.move();
      switch (curPhase) {
        case PHASE_READY:
          ctx.drawImage(logo, (WIDTH - logo.width) / 2, (HEIGHT - logo.height) / 2);
          break;
        case PHASE_LOADING:
          loading.draw();
          loading.move();
          break;
        case PHASE_PLAY:
          hero.draw();
          hero.move();
          bulletList.draw();
          bulletList.move();
          enemyList.draw();
          enemyList.move();
          drawHeroLife();
          drawScore();
          drawTopScore();
          break;
        case PHASE_PAUSE:
          drawHeroLife();
          hero.draw();
          bulletList.draw();
          enemyList.move();
          drawPause();
          drawScore();
          drawTopScore();
          break;
        case PHASE_GAMEOVER:
          drawHeroLife();
          drawGameOver();
          drawScore();
          drawTopScore();
          break;
      }
    }, 50)
  }
  $scope.getmap=function () {
    var iframe=document.getElementById('amap').contentWindow
    $('#myModal').modal('hide');
  }
  $scope.onsubmit=function () {
    

  }
})