"use strict";
import React from 'react';
import BaseLayout from '../layouts/BaseLayout'
import notFoundRoute from "./404";
import {browserHistory} from 'react-router'
import User from '../model/User';

const ROOT_PATH = '/';
export default (store) => ({
    path: ROOT_PATH,
    component: BaseLayout,
    childRoutes: [
        require('./Sign/Layout')(store),
        require('./User/Layout')(store),
        require('./Order/Layout')(store),
        require('./System/Layout')(store),
        notFoundRoute
    ]
});
/**
 * 登录和权限判断
 */
const LoginPath = '/sign';
const DefaultPath = '/order';
checkUserLogin(browserHistory.getCurrentLocation());
browserHistory.listen((nextLocation) => {
    if(['PUSH','REPLACE'].indexOf(nextLocation.action) !== -1){
        checkUserLogin(nextLocation);
    }
});
User.event.addListener('logout',()=>{
    if(isMatchPath(LoginPath)){
        browserHistory.replace({pathname:LoginPath})
    }else {
        browserHistory.push({pathname:LoginPath})
    }
});
function checkUserLogin(location) {
    if (User.logged || isMatchPath(LoginPath)) {
        if(location.pathname==="/"||location.pathname===""){
            browserHistory.replace({pathname: DefaultPath});
        }else{
            // checkUserAuth(location);
        }

    } else {
        console.log('not login');
        browserHistory.replace({pathname: LoginPath});
    }
}
function isMatchPath(pathname) {
    const reg = new RegExp('^/?'+pathname+'/?$');
    const curr = browserHistory.getCurrentLocation().pathname;
    return reg.test(curr);
}
