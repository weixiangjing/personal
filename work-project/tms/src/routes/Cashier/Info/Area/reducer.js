/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import axios from 'axios';
import {cleanEmpty} from "../../../../util/helper"
const Immutable = require('immutable');
export const initialState=()=> {
    return Immutable.fromJS({
        list:[],
        items:[],
        total:0,
        loading:false,
        uploading:false,
        province:""
    })
}

export const handler = {}

export function closeUploading(status){
    handler.$update(
        exports.state.set("uploading",status)
    )
}
export function echoArea(send={}){
    handler.$update(
        exports.state.set("loading",true)
    )
    
    if(send){
        delete send.card_class;
    }
  return   axios.post("area/query",cleanEmpty(send)).then(res=>{
        handler.$update(
            exports.state.set("list",res.data).set("loading",false).set("total",res.total).set("pageSize",send.pageSize)
        )
    })
}

export function echoAreaWithFirstLevel(){
  return   axios.post("area/query",{area_level:1,pageSize:99}).then(res=>{
      if(res.data==0) return ;
        let firstCode =res.data[0].area_code;
        handler.$update(
            exports.state.set("items",res.data).set("province",firstCode)
        )
        echoArea({parent_area_code:firstCode})
    })
}


    

