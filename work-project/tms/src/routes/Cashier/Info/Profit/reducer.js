/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import {getPayMode} from "../../../../model/PayChannel";
import {Table} from "../../../../components/Table";
import {getProfit, addProfit, updateProfit,getRateInfo} from "../../../../model/CashierProfit";
import {message,notification} from "antd"
const Immutable           = require('immutable');
const decimal =require("decimal.js");
window.d=decimal;
export const initialState = () => {
    return Immutable.fromJS({
        confirmLoading: false,
        types         : [],
        profit        : [],
        total         : 0,
        visible       : false,
        loading       : false,
        title         : "",
        echo          : {},
        pageSize:20
    })
}
export const handler      = {}
export function echoPayTypes() {
    getPayMode().then(data => handler.$update(
        exports.state.set("types", Immutable.fromJS(data))
    ))
}
let __searchProfitParams={}
export function echoProfit(send={},form) {
    __searchProfitParams=send;
    handler.$update(
        exports.state.set("loading", true)
    )
    getProfit(send).then(res => {
        handler.$update(
            exports.state.set("profit", Immutable.fromJS(res.data)).set("total", res.total).set("loading", false).set("pageSize",send.pageSize)
        );
    })
}
export function toggleVisible(visible, title, row,form) {

    if(row){
        row.status=row.status==1?true:false;
        getRateInfo(row.rate_id).then(rate=>{
            let rate_service =rate.rate_service;
            if(rate_service){
                rate_service = rate_service.map(item=>{
                    let value={}
                    value.max_amount=decimal(item.max_amount).div(100)
                    value.begin_amount=decimal(item.begin_amount).div(100);
                    value.rate=decimal(item.rate).mul(100);
                    if(rate.pay_mode_id==1006){
                        if(rate.rate_type=="1"||rate.rate_type=="2"){
                            value.card_type=item.card_type;
                        }else if(rate.rate_type=="3"){
                            value.card_brand=item.card_brand;
                            value.rate_change_type=item.rate_change_type;
                            value.card_type=item.card_type;
                        }
                    }
                    value.id=item.id;
                    return value;
                });
            }
            showLoading();
           form.setFieldsValue(row);
            if(row.pay_mode_id==1006){
                setTimeout(()=>form.setFieldsValue({rate_type:row.rate_type,rate_service}));
            }else{
                setTimeout(()=>form.setFieldsValue({rate_service}));
            }
        });
    }
    if(!visible){
        form.resetFields();
    }
    showLoading();


    function showLoading(){
        let state = exports.state.set("visible", visible).set("title", title).set("echo",row||{});
        handler.$update(state)
    }
}
export function disableProfit(item) {
    let status =item.status==1?2:1;
    let send ={}
    
    send.status=status;
    send.rate_id=item.rate_id;
    updateProfit(send).then(({data})=>{
        echoProfit(__searchProfitParams);
    }).catch(({message})=>{
        message.error(message)
    })
        
}
function round(value) {
    return isNaN(value) ? 0 : Number(Number(+value * 100).toFixed(2));
}
export function submit(form) {
    form.validateFields((error,send)=>{
        if(error) return;
        let rate_id = exports.state.get("echo").rate_id;


        handler.$update(
            exports.state.set("confirmLoading", true)
        )

        send.status = send.status == true ? 1 : 2;
        // todo
         error = validatePackage(send);
        if(error) {
            handler.$update(
                exports.state.set("confirmLoading", false)
            )
            form.setFields({
                rate_service:{
                    value:send.rate_service,
                    errors:[new Error(error)]
                }
            });
            return ;
        }
        
        if(!send.rate_type)send.rate_type=4;
        if(send.rate_service){
          send.rate_service=  send.rate_service.map(item=>{
               return Object.assign({},item,{
                    begin_amount:decimal(item.begin_amount).mul(100),
                    max_amount:decimal(item.max_amount).mul(100),
                   rate:decimal(item.rate).div(100)
                })


            })
        }
        let Request;
        if (rate_id) {//update
            send.rate_id = rate_id;
            Request      = updateProfit;
        } else {
            //add
            Request = addProfit;
        }
        console.log("send:",send);
        Request(send).then(() => {
            form.resetFields();
            handler.$update(
                exports.state.set("confirmLoading", false).set("visible", false)
            )
            if(rate_id){
                Table.getTableInstance().update();
            }else{
                Table.getTableInstance().reload();
            }
        }).catch((data) => {
            message.error(data.message);
            handler.$update(
                exports.state.set("confirmLoading", false)
            )
        })
    })
    
}
    


function validatePackage(value){
    let isBank = value.pay_mode_id==1006;
    let external=value.rate_type==3;
    let repeats;
    if(!value.rate_service) return false;
     
    if(isBank){
        if(external){
            repeats=  value.rate_service.map(item=>item.card_brand+"--"+item.card_type+"--"+item.rate_change_type);
        }else{
            repeats= value.rate_service.map(item=>item.card_type+"");
        }

    }

    let repeatItem =getRepeatItem(repeats);
    let card_type=['','借记卡','贷记卡'];
    if(repeatItem){
        let type = repeatItem.split("--")
        return (isBank && !external)?`卡类型【${card_type[type[0]]}】重复设置`:`卡品牌【${type[0]}】,汇率转换类型【${type[2]}】,卡种【${card_type[type[1]]}】重复设置`;
    }
    
 
 
    return  isEmpty(value.rate_service) ;
}
function isEmpty(value){
    if(!value) return "请填写套餐配置信息";
    let validator={
        rate:"费率",
        begin_amount:"起扣金额（元）",
        max_amount:"手续费封顶（元）",
        card_brand:"卡品牌",
        card_type:"卡类型",
        rate_change_type:"汇率转换类型"
    }
    
   let errorMsg;

    value.some(item=>{

        for(let key in item){
            if(!item[key]){
                errorMsg=`请输入${validator[key]} `
                return true;
            }
            if(!isNaN(item[key])){
                if(item[key]<0){
                    errorMsg=`${validator[key]}不能小于0`;
                    return true;
                }

            }
        }
    });
    
    return errorMsg;
    
    
   
    
}

function getRepeatItem(arr=[]) {
    var ret = [];
    var repeat;
    arr.forEach(function(item){
        if(!ret.includes(item)){
            ret.push(item);
        }else{
            repeat=item;
        }
    });
    return repeat?repeat+"":repeat
}

