/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import React from "react";
import {message} from "antd"
import {hashHistory} from "react-router";
import {handler as parentHandler} from '../reducer';
const Immutable = require('immutable');
import axios from "axios"
import {xml2json,json2xml} from "../../../../../components/VisualPrint/util";
export const  initialState=()=> {
   
    return Immutable.fromJS({
       payments:[],
        template:[],
        templateName:""
    })
}
export const  handler = {}

export function echoScheme(query,form){
    
    if(query.templateId){
        axios.post("tprintTemplate/query",query).then(res=>{
            let data =res.data[0];
            data.pay_mode_id+='';
            form.setFieldsValue(data);
            let object =xml2json(data.content);
            let template =object.template
            handler.$update("template",Immutable.fromJS(template),"templateName",object.name);
        });
    }
}

export function submit(form,query){
    form.validateFields((error,value)=>{
       if(error) return;
       let template =handler.$state("template").toJS();
       if(template.length===0){
           message.warn("模板内容不能为空",4)
           return ;
       }
       let xml =json2xml(template,value.type_code);
       if(query.templateId){
           axios.post("tprintTemplate/update",Object.assign({content:xml},query,value)).then(()=>goBack())
        }else{
           axios.post("tprintTemplate/add",Object.assign({content:xml},{pre_set:1},value)).then(()=>goBack())
       }
       
    });
}
export function deleteScheme(query){
    axios.post("tprintTemplate/update",Object.assign({},query,{is_delete:2})).then(()=>goBack())
}

function goBack(){
    message.success("操作成功");
    parentHandler._reload=true;
    hashHistory.goBack();
}