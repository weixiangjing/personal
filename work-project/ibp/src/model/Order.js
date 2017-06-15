"use strict";
import axios from 'axios';

export const Status = {
    '1':'未认证',
    '2':'还款中',
    '3':'还款成功',
    '4':'还款失败',
    '5':'已关闭'
};

export const getList = (params)=>{
    return axios.post('/manage/bill/get',params);
};

export const getDetail = (agent_instalment_bill_id) => {
    return new Promise((resolve,reject)=>{
        let order = null;
        getList({agent_instalment_bill_id,pageSize:1}).then(res=>{
            order = res.data[0];
            if(!order)return reject(new Error('订单不存在'));
            if(order.expense_detail){
                if(typeof order.expense_detail === 'string')order.expense_detail = JSON.parse(order.expense_detail);
            }else {
                order.expense_detail = {};
            }
            axios.post('/manage/bill/getDetail',{agent_instalment_bill_id,pageSize:1}).then(res=>{
                const data = res.data[0];
                order.sns = data.sns;
                order.agent_instalment_list = data.agent_instalment_list;
                // order.agent_instalment_list = [...data.agent_instalment_list,...data.agent_instalment_list,...data.agent_instalment_list];
                resolve(order);
            },reject);
        },reject);
    })
};

export const update = (params)=>{
    return axios.post('manage/bill/update',params);
};

export const getStatusText = (statusCode)=>{
    return Status[String(statusCode)];
};

export const getLogs = (params)=>{
    return axios.post('log/getLog',params);
};