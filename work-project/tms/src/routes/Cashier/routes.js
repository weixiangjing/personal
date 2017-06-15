module.exports = [
    {path: 'config/task',  component: 'Cashier/Config/TaskManager/index'},
    {path: 'home', keepAlive: true, component: 'Cashier/Home/index'},
    // {path: 'config/store', component: 'Cashier/Home/component'},
    {path        : 'config/query',
        keepAlive: true,
        storeKey : 'CashierConfigQuery',
        reducer  : 'Cashier/Config/Query/reducer',
        component: 'Cashier/Config/Query/component'
    },
    {path        : 'config/store',
        keepAlive: true,
        storeKey : 'CashierConfigStore',
        reducer  : 'Cashier/Config/Store/reducer',
        component: 'Cashier/Config/Store/component'
    },
    {path        : 'config/store/:mcode',
        storeKey : 'CashierConfigStoreDetail',
        reducer  : 'Cashier/Config/Store/detail/reducer',
        component: 'Cashier/Config/Store/detail/component'
    },
    {path        : 'config/stores',
        storeKey : 'CashierConfigStores',
        reducer  : 'Cashier/Config/Stores/reducer',
        component: 'Cashier/Config/Stores/component'
    },
    {
        path:"info/payment",
        storeKey:"CashierInfoPayment",
        reducer  : 'Cashier/Info/Payment/reducer',
        component: 'Cashier/Info/Payment/component',
        children:[
            {
                path:"detail",
                storeKey:"CashierInfoPaymentQuery",
                reducer  : 'Cashier/Info/Payment/Detail/reducer',
                component: 'Cashier/Info/Payment/Detail/component',
            }
        ]
    },
    //通道基本信息
    {path        : 'info/channel',
        storeKey : 'CashierInfoChannel',
        reducer  : 'Cashier/Info/Channel/reducer',
        component: 'Cashier/Info/Channel/component',
        keepAlive:true,
        children:[

            {path        : 'add',
                storeKey : 'CashierInfoAdd',
                reducer  : 'Cashier/Info/Config/reducer',
                component: 'Cashier/Info/Config/component'
            },
            {path        : 'query',
                storeKey : 'CashierInfoConf',
                reducer  : 'Cashier/Info/Config/reducer',
                component: 'Cashier/Info/Config/component'
            },
            {path        : 'plugin',
                storeKey : 'CashierInfoPlugin',
                reducer  : 'Cashier/Info/Plugin/reducer',
                component: 'Cashier/Info/Plugin/component'
            }
        ]
    }, {
        path: "print/query",
        storeKey: "CashierPrintQuery",
        component: "Cashier/Print/Query/index",
        reducer: "Cashier/Print/Query/reducer",
        keepAlive:true,
        children:[
            {
                path: "detail",
                storeKey: "CashierPrintQueryDetail",
                component: "Cashier/Print/Query/Detail/index",
                reducer: "Cashier/Print/Query/Detail/reducer"
            }
        ]
    },  {
        path:"print/preview",
        component:"Cashier/Print/Preview/index",
        reducer:"Cashier/Print/Preview/reducer",
        storeKey:"CashierPrintPreview"
    },{
        path:"print/scheme",
        component:"Cashier/Print/Scheme/index",
        reducer:"Cashier/Print/Scheme/reducer",
        storeKey:"CashierPrintScheme",
        children:[
            {
                path:"range",
                component:"Cashier/Print/Scheme/Add/index",
                reducer:"Cashier/Print/Scheme/Add/reducer",
                storeKey:"CashierPrintSchemeAdd",
            },{
                path:"custom",
                component:"Cashier/Print/Scheme/Custom/index",
                reducer:"Cashier/Print/Scheme/Custom/reducer",
                storeKey:"CashierPrintSchemeCustom",
            }
        ]
    }
    
    ,
    {path        : 'info/profit',
        storeKey : 'CashierInfoProfit',
        reducer  : 'Cashier/Info/Profit/reducer',
        component: 'Cashier/Info/Profit/component'
    },
    {path        : 'info/bin',
        storeKey : 'CashierInfoBin',
        reducer  : 'Cashier/Info/CardBin/reducer',
        component: 'Cashier/Info/CardBin/component'
    },
    {path        : 'info/area',
        storeKey : 'CashierInfoArea',
        reducer  : 'Cashier/Info/Area/reducer',
        component: 'Cashier/Info/Area/component'
    },
    {path        : 'info/provider',
        storeKey : 'CashierInfoProvider',
        reducer  : 'Cashier/Info/Provider/reducer',
        component: 'Cashier/Info/Provider/component'
    },
];