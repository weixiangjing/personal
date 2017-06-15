/**
 *  created by yaojun on 17/1/22
 *
 */




import {Link} from "react-router";
import User from  "../model/User";
import {Button} from "antd";
import React from "react";
export const AuthLink =({to,className})=>{
    let action =User.get('actionMap')[to.split("?")[0]];

    if(action){
        return <Link to={to} className={className}>{action.res_name}</Link>
    }
    return null;

}
export const Auth =({to,children,replace})=>{
    let action =User.get('actionMap')[to.split("?")[0]];
    if(action) {
        if(replace) return children;
        return  <span>{children}</span>
    }

    return null;
}

export const AuthAction =({auth,type,loading=false,onClick})=>{
    let action =User.get('actionMap')[auth];
    if(User.get('actionMap')[auth]){
        return <Button onClick={onClick} loading={loading} type={type}>{action.res_name}</Button>
    }
    return null;
}

