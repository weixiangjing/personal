module.exports = [
    {path        : 'pcalc',
        storeKey : 'SystemCalc',
        reducer  : 'System/Calc/reducer',
        component: 'System/Calc/component'
    },
    {path        : 'detail',
        storeKey : 'SystemDataExport',
        reducer  : 'System/DataExport/reducer',
        component: 'System/DataExport/component'
    },
    {path        : 'export',
        storeKey : 'SystemDetailExport',
        reducer  : 'System/DetailExport/reducer',
        component: 'System/DetailExport/component'
    },
    {path        : 'notice',
        storeKey : 'SystemPushNotice',
        reducer  : 'System/PushNotice/reducer',
        component: 'System/PushNotice/component'
    }, {path        : 'sync',
        storeKey : 'SystemDeviceSync',
        reducer  : 'System/DeviceSync/reducer',
        component: 'System/DeviceSync/component'
    },{
        path:"package",
        storeKey:"SystemPackageList",
        reducer:"System/Package/list/reducer",
        keepAlive:true,
        component:"System/Package/list/component",
        children:[
            {
                path:"detail",
                storeKey:"SystemPackageDetail",
                component:"System/Package/detail/component",
                reducer:"System/Package/detail/reducer"
            },{
                path:"addOrUpdate",
                storeKey:"SystemPackageAddOrUpdate",
                component:"System/Package/addAndUpdate/component",
                reducer:"System/Package/addAndUpdate/reducer"
            }
        ]
    },{
    path        : 'userams',
    storeKey : 'SystemUserAms',
    reducer  : 'System/UserAms/reducer',
    component: 'System/UserAms/component' 
  }
];
