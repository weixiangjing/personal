export const routes=[{
    path: 'personal/home',
    component: 'Service/Personal/Home/component',
    reducer: "Service/Personal/Home/reducer",
    storeKey: "Service/Personal/Home/component",
}, {
    path: 'personal/buy',
    component: 'Service/Personal/Service/component',
    reducer: "Service/Personal/Service/reducer",
    storeKey: "Service/Personal/Service/component"
}, {
    path: 'personal/usable',
    component: 'Service/Personal/Usable/component',
    reducer: "Service/Personal/Usable/reducer",
    storeKey: "Service/Personal/Usable/component"
}, {
    path: 'buy/product',
    component: 'Service/Buy/Product/component',
    reducer: "Service/Buy/Product/reducer",
    storeKey: "Service/Buy/Product/component",
    children: [{
        path: "add",
        component: "Service/Buy/Cart/component",
        reducer: "Service/Buy/Cart/reducer",
        storeKey: "Service/Buy/Cart/component"
    }]
}, {
    path: 'buy/package',
    component: 'Service/Buy/Package/component',
    reducer: "Service/Buy/Package/reducer",
    storeKey: "Service/Buy/Package/component",
    children: [{
        path: "add",
        component: "Service/Buy/PackageAdd/component",
        reducer: "Service/Buy/PackageAdd/reducer",
        storeKey: "Service/Buy/PackageAdd/component"
    }]
}, {
    path: 'buy/order',
    component: 'Service/Buy/Order/component',
    reducer: "Service/Buy/Order/reducer",
    storeKey: "Service/Buy/Order/component",
    children: [{
        path: "detail",
        component: 'Service/Buy/Order/details/component',
        reducer: "Service/Buy/Order/details/reducer",
        storeKey: "Service/Buy/Order/details/component",
    }]
}, {
    path: 'account/home',
    component: 'Service/Account/Home/component',
    reducer: "Service/Account/Home/reducer",
    storeKey: "Service/Account/Home/component", /*children:[
     {
     path     : 'setpassword',
     component: 'Service/Account/Home/SetPassWord/index',
     storeKey : "Service/Account/Home/SetPassWord/index",
     }
     ]*/
}, {
    path: 'account/home/setpassword',
    component: 'Service/Account/Home/SetPassWord/index',
    storeKey: "Service/Account/Home/SetPassWord/index",
}, {
    path: 'account/deposit',
    component: 'Service/Account/Deposit/component',
    reducer: "Service/Account/Deposit/reducer",
    storeKey: "Service/Account/Deposit/component"
}, {
    path: 'account/deposit/details',
    component: 'Service/Account/Deposit/details/component',
    reducer: "Service/Account/Deposit/details/reducer",
    storeKey: "Service/Account/Deposit/details/component"
}, {
    path: 'account/bill',
    component: 'Service/Account/Bill/component',
    reducer: "Service/Account/Bill/reducer",
    storeKey: "Service/Account/Bill/component",
    keepAlive: true, /*children:[
     {
     path:":order_no",
     component:"Service/Account/Bill/details/component",
     reducer:"Service/Account/Bill/details/reducer",
     storeKey:"Service/Account/Bill/details/component"
     }
     ]*/
}, {
    path: ":account/bill/details",
    component: "Service/Account/Bill/details/component",
    reducer: "Service/Account/Bill/details/reducer",
    storeKey: "Service/Account/Bill/details/component"
}, {
    path: "buy/cart",
    component: "Service/Buy/CartBuy/component",
    reducer: "Service/Buy/CartBuy/reducer",
    storeKey: "Service/Buy/CartBuy/component"
}, {
    path: "buy/step",
    component: "Service/Buy/StepBuy/component",
    reducer: "Service/Buy/StepBuy/reducer",
    storeKey: "Service/Buy/StepBuy/component"
}];
export const menus=[
    {
        route: "service/personal",
        name: "我的服务",
        icon_url:"file-text",
        children: [{
            route: "service/personal/home",
            name: "总览"
        }, {
            route: "service/personal/buy",
            name: "已购服务"
        }, {
            route: "service/personal/usable",
            name: "服务余量"
        }]
    }, {
        route: "service/buy",
        name: "选购服务",
        icon_url:"shopping-cart",
        children: [{
            route: "service/buy/product",
            name: "按服务产品"
        }, {
            route: "service/buy/package",
            name: "按套餐"
        }, {
            route: "service/buy/order",
            name: "服务订单"
        }]
    }, {
        route: "service/account",
        name: "账户中心",
        icon_url:"user-circle",
        children: [{
            route: "service/account/home",
            name: "账户总览"
        }, {
            route: "service/account/deposit",
            name: "充值订单"
        }, {
            route: "service/account/bill",
            name: "服务账单"
        }]
    }]
export const BreadcrumbConf={
    "service/personal": "我的服务",
    "service/personal/home": "总览",
    "service/personal/buy": "已购服务",
    "service/personal/usable": "剩余流量",
    "service/buy": "选购服务",
    "service/buy/product": "按服务产品",
    "service/buy/product/add": "订购",
    "service/buy/package": "按套餐",
    "service/buy/package/add": "订购",
    "service/buy/order": "服务订单",
    "service/buy/order/detail": "订单详情",
    "service/buy/cart": "购物车",
    "service/buy/step": "确认购买",
    "service/account": "账户中心",
    "service/account/home": "账户总览",
    "service/account/deposit": "充值订单",
    "service/account/deposit/details": "详情",
    "service/account/bill": "服务账单",
    "service/account/bill/details": "详情",
}
export function getBreadcrumb(path) {
    let head=path.splice(0, 2);
    let conf=[]
    
    function getBreadConf() {
        let route=head.join("/");
        let label=BreadcrumbConf[route];
        if(label) {
            conf.push({route, label});
        }
        if(path.length>0) {
            head.push(path.shift());
            getBreadConf();
        }
    }
    
    getBreadConf()
    return conf;
}



