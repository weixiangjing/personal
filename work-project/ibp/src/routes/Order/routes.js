module.exports = [
    {path:'./',component: 'Order/list/Component', keepAlive: true, storeKey : 'OrderList',reducer:'Order/list/reducer'},
    {path:':id',component: 'Order/detail/Component', storeKey : 'OrderDetail',reducer:'Order/detail/reducer'}
];
