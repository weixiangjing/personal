/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import React from "react";
import {getCard} from "../../../../model/CardBind";
import {cleanEmpty,showTaskModal} from "../../../../util/helper";

import axios from "axios"
const Immutable = require('immutable');
export const  initialState=()=> {
    return Immutable.fromJS({
        list:[],
        loading:{upload:false,list:true},
        total:0,
        detailModalStatus:false,
        detailItem:{}
    })
}
export const  handler = {}

let modalDestroy;
export function echoCard(send={}){
    if(send){
        send =cleanEmpty(send);
    }
    delete send.card_class;
  toggleLoadingWithPath("list",true);
    getCard(send).then(res=>{
        handler.$update(
            exports.state
                   .set("list",res.data)
                   .updateIn(['loading','list'],()=>false)
                   .set("total",res.total)
                   .set("pageSize",send.pageSize)
        )
    })
}
export function exportCards(send){
   let params= cleanEmpty(send);
    axios.post("cardBin/query",params).then(()=>showTaskModal());
}

export function toggleLoadingWithPath(path,status){
    handler.$update(
        exports.state.updateIn(['loading',path],()=>status)
    )
}

export function toggleDetailModal(item={}){
    handler.$update(
        exports.state.set("detailItem",Immutable.fromJS(item))
    )
}