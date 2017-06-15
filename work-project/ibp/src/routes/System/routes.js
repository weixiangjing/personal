module.exports = [
  {path: 'users', storeKey:'SystemUserList',reducer:'System/UserList/reducer', component: 'System/UserList/component'},
  {path: 'permissions', storeKey:'SystemPermissions',reducer:'System/Permissions/reducer', component: 'System/Permissions/component'},
  {path: 'set', storeKey:'SystemSetPermissions',reducer:'System/SetPermissions/reducer', component: 'System/SetPermissions/component'},
];
