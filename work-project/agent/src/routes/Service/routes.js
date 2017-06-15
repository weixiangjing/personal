module.exports=[{
    path: "home", component: "Service/Home/index"
}, {
    path     : "device/basis",
    component: "Service/Device/Basis/component",
    reducer  : "Service/Device/Basis/reducer",
    storeKey : "Service/Device/Basis/component",
}, {
    path     : "device/after",
    component: "Service/Device/After/component",
    reducer  : "Service/Device/After/reducer",
    storeKey : "Service/Device/After/component",
    children:[{
        path     : "apply",
        component: "Service/Device/After/Apply/component"
    },{
        path     : "detail",
        component: "Service/Device/After/Detail/component"
    }]
}, {
    path     : "device/stat",
    component: "Service/Device/Stat/component",
    reducer  : "Service/Device/Stat/reducer",
    storeKey : "Service/Device/Stat/component"
}, {
    path     : "device/transfer",
    component: "Service/Device/Transfer/component",
    reducer  : "Service/Device/Transfer/reducer",
    storeKey : "Service/Device/Transfer/component"
},{
    path     : "merchant/manage",
    component: "Service/Merchant/Manage/component",
    reducer  : "Service/Merchant/Manage/reducer",
    storeKey : "Service/Merchant/Manage/component",
    children:[
        {
            path     : "detail",
            component: "Service/Merchant/Detail/component",
            reducer  : "Service/Merchant/Detail/reducer",
            storeKey : "Service/Merchant/Detail/component",
        }
    ]
}, {
    path     : "merchant/claim",
    component: "Service/Merchant/Claim/component",
    reducer  : "Service/Merchant/Claim/reducer",
    storeKey : "Service/Merchant/Claim/component"
}, {
    path     : "agent/basis",
    component: "Service/Agent/Basis/component",
    reducer  : "Service/Agent/Basis/reducer",
    storeKey : "Service/Agent/Basis/component",
    children:[{
        path     : "detail",
        component: "Service/Agent/Detail/component",
        reducer: "Service/Agent/Detail/reducer",
        storeKey: "Service/Agent/Detail/component"
    }]
}, {
    path     : "agent/alter",
    component: "Service/Agent/Alter/component",
    reducer  : "Service/Agent/Alter/reducer",
    storeKey : "Service/Agent/Alter/component"
}, {
    path     : "agent/detail",
    component: "Service/Agent/Add/component",
    reducer  : "Service/Agent/Add/reducer",
    storeKey : "Service/Agent/Add/component"
},{
    path: "sale",
    component: "Service/Sale/index",
    reducer:"Service/Sale/reducer",
    storeKey:"Service/Sale/index"
}];
