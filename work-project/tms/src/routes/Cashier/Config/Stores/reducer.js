"use strict";
import axios from 'axios';
const Immutable = require('immutable');
const PayChannel = require('../../../../model/PayChannel');
const CashierProfit = require('../../../../model/CashierProfit');
const moment = require('moment');

export const initialState = ()=>{
    return Immutable.Map({
        step:0,
        busy:false,
        forms:Immutable.List(),
        merchants:[],
        configItems:Immutable.fromJS([
            { label: '通道收银功能开关', value: 'cashier',disabled:false,visible:true },
            { label: '交易手续费率', value: 'rate',disabled:false,visible:true },
            { label: '门店支付参数', value: 'params',disabled:false,visible:true },
            { label: '通道业务能力', value: 'biz',disabled:false,visible:true },
            { label: '通道运营类型', value: 'operator',disabled:false,visible:true }
        ])
    })
};
export const handler = {};
export const storeFormData = (data,step)=>{
    let state = exports.state;
    let forms = state.get('forms').set(null==step?state.get('step'):step,data);
    handler.$update(state.set('forms',forms))
};
export const getFormData = (step)=>{
    let state = exports.state;
    step = null==step?state.get('step'):step;
    return state.get('forms').get(step);
};
export const resetState = ()=>{
    handler.$update(initialState())
};
export const nextStep = ()=>{
    handler.$update(exports.state.set('step',exports.state.get('step')+1));
};
export const preStep = ()=>{
    handler.$update(exports.state.set('step',exports.state.get('step')-1));
};
export const getMerchantsInfo = ()=>{
    let state = exports.state;
    let form = getFormData(0);
    return axios.post('/tmsStorePaychannel/batchGetMcodesOpenedPaychannel',
        {pay_mode_id:form.payment[0],mcodes:form.mcodes})
        .then(res=>{
            let groupByMcode = {};
            res.data.map(item=>{
                if(!groupByMcode[item.mcode]){
                    groupByMcode[item.mcode] = {
                        payment:[],
                        mcode:item.mcode,
                        store_name:item.store_name,
                        status:item.status,
                        bind_en_num:item.bind_en_num,
                        update_time:item.update_time
                    };
                }
                const merchant = groupByMcode[item.mcode];
                merchant.payment.push({
                    pay_mode_id:item.pay_mode_id,
                    pay_mode_name:item.pay_mode_name,
                    pay_channel_id:item.pay_channel_id,
                    pay_channel_name:item.pay_channel_name,
                    create_time:item.create_time,
                    storePaychannelId:item.storePaychannelId,
                    update_time:item.update_time
                });
                if(moment(merchant.update_time).isBefore(item.update_time))merchant.update_time = item.update_time;
            });
            let data = Object.values(groupByMcode);
            handler.$update(state.set('merchants',data));
            return data;
        })
};
export const getConfig = (storePaychannelId,channelParams)=>{
    return new Promise((resolve,reject)=>{
        getChannel(channelParams).then(channel=>{
            return axios.post('/tmsStorePaychannel/getConfigPaychannel',{storePaychannelId:storePaychannelId})
                .then(res=>{
                    if(!res.data || !res.data.length)resolve(null);
                    let data = res.data[0];
                    let params = {};
                    data.storeParms.map(param=>{
                        params[param.attr_name] = param;
                    });
                    channel.pay_channel_store_params.map(item=>{
                        if(params[item.key]){
                            params[item.key].title = item.title;
                        }
                    });
                    resolve({template:channel.pay_channel_store_params,params:Object.values(params)});
                },reject)
        },reject)
    });
};
export const updateConfig = ()=>{
    let from1 = getFormData(0);
    let mcodes = [];
    let merchants = getFormData(1);
    merchants.selectedStore.map(item=>{
        if(mcodes.indexOf(item.mcode)==-1)mcodes.push(item.mcode);
    });
    let from3 = getFormData(2);
    let store_params = [];
    if(from3.params)Object.keys(from3.params).map(key=>{
        store_params.push({
            attr_name:key,
            attr_value:from3.params[key]
        })
    });
    let bz_ability = [];
    if(from3.settings.biz)from3.settings.biz.map(item=>{
        bz_ability.push({
            bz_ability_id:item,
            attr_value:1
        })
    });
    return axios.post('/tmsStorePaychannel/batchConfigPaychannel',{
        mcodes:mcodes.join(','),
        pay_mode_id:from1.payment[0],
        pay_channel_id:from1.payment[1],
        rate_id:from3.settings.rate_id,
        store_params:store_params,
        bz_ability:bz_ability,
        operation_mode:from3.settings.operation_mode,
        status:from3.settings.isOpen?1:2
    })
};

export const setConfigItemVisible = (index,bisible)=>{
    let state = exports.state;
    let configItems = state.get('configItems');
    let item = configItems.get(index);
    item = item.set('visible',bisible);
    configItems = configItems.set(index,item);
    handler.$update(state.set('configItems',configItems));
};
export const setConfigItems = (items)=>{
    let state = exports.state;
    handler.$update(state.set('configItems',items));
};
export const setBusy = (busy)=>{
    handler.$update(exports.state.set('busy',busy));
};

export const getChannel = (params)=>{
    if(!params){
        let state = exports.state,
            payment = state.get('forms').get(0).payment;
        params = {pay_mode_id:payment[0],pay_channel_id:payment[1]};
    }
    return PayChannel.getChannel(params).then(res=>{
        let data = res.data[0];
        if(data.pay_channel_store_params){
            data.pay_channel_store_params = window.JSON.parse(data.pay_channel_store_params);
        }else {
            data.pay_channel_store_params = [];
        }
        return data;
    })
};

export const getPayRate = ()=>{
    let form = getFormData(0);
    return CashierProfit.getProfit({status:1,pageSize:999,pay_mode_id:form.payment[0],pay_channel_id:form.payment[1]});
};

export const getBzAblity = (channel)=>{
    if(!channel)channel = getFormData(0).payment[1];
    return axios.post('tmsPaychannel/getPaychannelBzAblity',{pay_channel_id:channel,pageSize:999});
};