import axios from 'axios';
import React from "react";
import {Modal} from "antd";
import {hashHistory} from "react-router";
const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
    return Immutable.fromJS({
        step:0
    });
}

export function registerAccount(){
    Modal.success({
        title:"计费账户开通成功",
        content:<div></div>,
        onText:"设置支付密码",
        onOk:()=>{
            hashHistory.replace("service/buy/pwd")
        }
    })
}