"use strict";
const Immutable = require('immutable');
import * as OrderModel from '../../../model/Order';

exports.initialState = ()=>{
    return Immutable.Map({
        pending:false,
        order:null,
        logs:Immutable.Map({
            pageSize:20,
            pageNum:1,
            total:0,
            data:[]
        })
    });
};
export const handler = {};

export const getDetail = (params) => {
    let state = exports.state;
    handler.$update(state.set('pending',true));
    return OrderModel.getDetail(params).then((order)=>{
        state = state.set('order',order);
        return handler.$update(state);
    }).finally(()=>{
        handler.$update(state.set('pending',false));
    });
};

export const updateRemark = (bill,remark) => {
    const state = exports.state;
    let order = state.get('order');
    return OrderModel.update({
        pay_mode:bill.pay_mode,
        agent_instalment_bill_detail_id:bill.agent_instalment_bill_detail_id,
        remark:remark
    }).then(()=>{
        bill.remark = remark;
        handler.$update(state.set('order',order))
    });
};

export const markPaid = (params)=>{
    let state = exports.state;
    handler.$update(state.set('pending',true));
    return OrderModel.update(params).finally(()=>{
        handler.$update(state.set('pending',false));
    });
};

export const getLogs = (pageIndex)=>{
    const state = exports.state;
    const order = state.get('order');
    let logs = state.get('logs');
    if(pageIndex==='next')pageIndex = logs.get('pageNum')+1;
    if(isNaN(pageIndex))pageIndex = 1;
    let params = {agent_instalment_bill_id:order.agent_instalment_bill_id,pageNum:pageIndex,pageSize:logs.get('pageSize')};
    return OrderModel.getLogs(params).then((res)=>{
        let newList = logs.get('data').concat(res.data);
        let newLogs = logs.set('data',newList).set('total',res.total).set('pageNum',pageIndex);
        handler.$update(state.set('logs',newLogs));
        return res;
    });
};