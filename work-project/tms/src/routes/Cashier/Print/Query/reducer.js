/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import React from "react";
import {getPayMode} from "../../../../model/PayChannel"
const Immutable = require('immutable');
export const  initialState=()=> {
   
    return Immutable.fromJS({
       payments:[]
    })
}
export const  handler = {}

export function getPayments(){
    getPayMode().then(data=>handler.$update("payments",Immutable.fromJS(data)));
}