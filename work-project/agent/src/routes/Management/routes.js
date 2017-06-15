module.exports = [
  {path        : 'resources',
    storeKey : 'ManagementResources',
    reducer  : 'Management/Resources/reducer',
    component: 'Management/Resources/component'
  },
  {path        : 'config',
    storeKey : 'ManagementConfigPermissions',
    reducer  : 'Management/ConfigPermissions/reducer',
    component: 'Management/ConfigPermissions/component'
  },
  
];
