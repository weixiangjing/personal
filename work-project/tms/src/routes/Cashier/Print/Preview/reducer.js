/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import React from "react";
import {cleanEmpty} from "../../../../util/helper";
import {xml2json} from "../../../../components/VisualPrint/util";

import axios from "axios";
const Immutable = require('immutable');
export const  initialState=()=> {
    return Immutable.fromJS({
        list:[],
        activeIndex:0,
       template:[]
    })
}
export const  handler = {}

export function getDetail(send={}) {
    if(!send.apply_id){
        handler.$update("list",Immutable.fromJS([]),"template",Immutable.fromJS([]),"activeIndex",0)
        return ;
    }
    axios.post("tprintPlan/printPreView",cleanEmpty(Object.assign({pageSize:199},send))).then((res)=>{
        let data =res.data[0];
            data=Immutable.fromJS(data?xml2json(data.content).template:[]);
        handler.$update("list",Immutable.fromJS(res.data),"template",data,"activeIndex",0)
    })
}

export function displayTemplate(xml,index){
    
    handler.$update("template",Immutable.fromJS(xml2json(xml).template),"activeIndex",index);
}