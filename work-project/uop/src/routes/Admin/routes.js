module.exports = [
    {path: 'login', keepAlive: true, component: 'Admin/Login/Component'},

    {path: 'user', keepAlive: true,
      storeKey:'AdminUserTms',
      reducer:'Admin/UserTms/reducer',
      component: 'Admin/UserTms/component'
    },

    {path: 'user/detail', keepAlive: true,
      storeKey:'AdminUserTmsDetail',
      reducer:'Admin/UserTms/Detail/reducer',
      component: 'Admin/UserTms/Detail/component'},

    {path: 'user/create', keepAlive: true,
      storeKey:'AdminUserTmsCreate',
      reducer:'Admin/UserTms/CreateUser/reducer',
      component: 'Admin/UserTms/CreateUser/component'},

    {path: 'user/detail/add', keepAlive: true,
      storeKey:'AdminUserTmsDetailAdd',
      reducer:'Admin/UserTms/Detail/AddSysTem/reducer',
      component: 'Admin/UserTms/Detail/AddSysTem/component'},

    {path: 'system', keepAlive: true,
      storeKey:'AdminSysTem',
      reducer:'Admin/SysTem/reducer',
      component: 'Admin/SysTem/component'},
  {path:'modifyPassword',keepAlive:true,component:'Admin/SetPassword/Component'}

];
