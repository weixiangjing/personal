module.exports=[{path: 'home', keepAlive: false, component: 'Inquiry/Home/index'}, {
    path: 'accurate', component: 'Inquiry/Rule/component', storeKey: "InquiryRuleStore", reducer: 'Inquiry/Rule/reducer'
}, {
    path     : 'advanced',
    component: 'Inquiry/Advanced/component',
    keepAlive: true,
    children : [
        {
            path: 'detail',
            component: 'Inquiry/Rule/Detail/component'
        }]
}, {path: 'liquidate', component: 'Inquiry/Liquidate/component'},];