/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import axios from "axios";
import {message} from "antd"
import {handler as parentHandler} from "../reducer";
import {hashHistory} from "react-router"
const Immutable           = require('immutable');

export const handler      = {}
export const initialState = () => Immutable.Map({
    
});

export function submit(form,alterId){
    form.validateFields((error,value)=>{
       if(error) return;
       
       
       let object = Object.assign({},value);
        object.icon_url={}
        if(value.icon_key_4)
            object.icon_url.icon_key_4="tmsIcon"+ value.icon_key_4.split("tmsIcon")[1]
        if(value.icon_key_3)
            object.icon_url.icon_key_3="tmsIcon"+ value.icon_key_3.split("tmsIcon")[1]
        if(value.icon_key_2)
            object.icon_url.icon_key_2="tmsIcon"+ value.icon_key_2.split("tmsIcon")[1]
        if(value.icon_key_1)
            object.icon_url.icon_key_1="tmsIcon"+ value.icon_key_1.split("tmsIcon")[1]
    
       
      
      
        if(alterId){
            object.id=alterId
            axios.post("tmsPaymode/updatePayMode",object).then(()=>goBack())
        }else{
            axios.post("tmsPaymode/addPayMode",object).then(()=>goBack())
        }
        
    
    });
}
export function deletePayment(form){
    axios.post("tmsPaymode/updatePayMode",{is_delete:2,id:handler.$state("id")}).then(()=>goBack())
}


export function getDetail(id,form){
    axios.post("tmsPaymode/query",{pay_mode_id:id}).then((res)=>{
        let data =res.data[0];
            if(data.icon_url && typeof data.icon_url ==="object"){
                data = Object.assign({},data,data.icon_url);
            }
            form.setFieldsValue(data);
            handler.$update("id",data.id);
    })
}
function goBack() {
    message.success("操作成功");
    parentHandler._reload=true;
    hashHistory.goBack();
}