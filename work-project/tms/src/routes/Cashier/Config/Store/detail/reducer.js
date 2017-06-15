"use strict";
import axios from 'axios';
const Immutable = require('immutable');
const PayChannel = require('../../../../../model/PayChannel');
export const initialState = ()=>{
    return Immutable.Map({
        busy:false,
        merchant:null,
        channel:null,
        channelConfig:null,
        merchantDevice:Immutable.List()
    })
};
export const handler = {};

export const setBusy = (flag)=>{
    return handler.$update(exports.state.set('busy',flag));
};

export const getMerchantInfo = (mcode)=>{
    if(!mcode)return Promise.reject(new Error('缺少MCODE'));
    return new Promise((resolve,reject)=>{
        axios.post('/tmsMerchant/getMerchant',{mcode:mcode}).then(res=>{
            let data = res.data;
            if(!data || !data.length)return Promise.reject('门店不存在');
            let merchant = data[0];
            handler.$update(exports.state.set('merchant',merchant));
            resolve(merchant);
        },reject)
    })
};

export const getDevices = ()=>{
    const state = exports.state;
    const merchant = state.get('merchant');
    const channelConfig = state.get('channelConfig');
    let posParamMap = {};
    if(channelConfig)posParamMap = channelConfig.pos_params_map;
    return axios.post('/tmsMerchant/getMerchantDevice',{mcode:merchant.mcode}).then(res=>{
        let devices = res.data;
        devices.map(device=>{
            let params = posParamMap[device.device_en];
            if(params){
                params.forEach(param=>{
                    device[param.attr_name] = param.attr_value;
                });
                device.last_pos_params_update = params.update_time;
            }
        });
        handler.$update(state.set('merchantDevice',Immutable.fromJS(devices)));
    })
};

export const getPayRate = (pay_mode_id,pay_channel_id)=>{
    return axios.post('/tmsPayRate/getPayRateCombo',{pay_mode_id:pay_mode_id,pay_channel_id:pay_channel_id,status:1,pageSize:999}).then(res=>{
        return res.data;
    })
};

export const getPayChannelDetail = (pay_mode_id,pay_channel_id)=>{
    return new Promise((resolve,reject)=>{
        axios.post('/tmsPaychannel/getPayChannel',{pay_mode_id:pay_mode_id,pay_channel_id:pay_channel_id})
            .then(res=>{
                let data = res.data;
                if(!data || !data.length)return reject(new Error('支付通道不存在'));
                let channel = data[0];
                if(channel.pay_channel_store_params){
                    channel.pay_channel_store_params = window.JSON.parse(channel.pay_channel_store_params);
                }
                if(channel.pay_channel_terminal_params){
                    channel.pay_channel_terminal_params = window.JSON.parse(channel.pay_channel_terminal_params)
                }
                getPayRate(pay_mode_id,pay_channel_id).then(rates=>{
                    channel.rate = {
                        uinInner:[],//银联卡(境内)
                        uinOuter:[],//银联卡(境外)
                        outer:[],//外卡
                        other:[]//其他
                    };
                    rates.forEach(rate=>{
                        switch (rate.rate_type){
                            case 1:channel.rate.uinInner.push(rate);
                                break;
                            case 2:channel.rate.uinOuter.push(rate);
                                break;
                            case 3:channel.rate.outer.push(rate);
                                break;
                            default:channel.rate.other.push(rate);
                                break;
                        }
                    });
                    getChannelById(pay_mode_id,pay_channel_id).then(c=>{
                        if(c){
                            channel.isOpen = true;
                            channel.storePaychannelId = c.storePaychannelId;
                            channel.bind_en_num = c.bind_en_num;
                        }else {
                            channel.isOpen = false;
                            channel.bind_en_num = 0;
                        }
                        handler.$update(exports.state.set('channel',channel));
                        //如果已经开通了获取配置以供修改,如果没有则进入开通模式
                        if(channel.isOpen){
                            getConfigPaychannel().then(config=>{
                                resolve({channel:channel,config:config});
                            },reject);
                        }else {
                            resolve({channel:channel})
                        }
                    }).catch(reject);
                },reject)
            },reject)
    });
};

export const getChannelById = (pay_mode_id,pay_channel_id)=>{
    const merchant = exports.state.get('merchant');
    let param = {store_name:merchant.store_name,mcode:merchant.mcode,pageSize:999};
    return PayChannel.getOpenPayChannel(param).then((data)=>{
        for(let i=0;i<data.length;i++){
            let channel = data[i];
            if(channel.pay_mode_id==pay_mode_id
                &&channel.pay_channel_id==pay_channel_id){
                return channel;
            }
        }
        return null;
    })
};

export const getConfigPaychannel = ()=>{
    let channel = exports.state.get('channel');
    return axios.post('/tmsStorePaychannel/getConfigPaychannel',{storePaychannelId:channel.storePaychannelId})
        .then(res=>{
            let data = res.data;
            if(!data || !data.length)return;
            let config = data[0];
            let paramMap = {};
            const posParams = config.pos_params || [];
            posParams.forEach(param=>{
                if(!paramMap[param.device_en])paramMap[param.device_en] = [];
                paramMap[param.device_en].update_time = param.update_time;
                paramMap[param.device_en].push({
                    attr_name:param.attr_name,
                    attr_value:param.attr_value
                })
            });
            config.pos_params_map = paramMap;
            handler.$update(exports.state.set('channelConfig',config));
            return config;
        })
};
//更新修改终端参数
export const updatePosParam = (device,newVal)=>{
    const isRemove = (()=>{
        let values = Object.values(newVal);
        for(let i=0;i<values.length;i++){
            if(values[i] != '')return false;
        }
        return true;
    })();
    let state = exports.state;
    const index = device.index;
    let deviceList = state.get('merchantDevice');
    let currentDevice = deviceList.get(index).toJS();
    deviceList = deviceList.set(index,Immutable.fromJS(Object.assign(currentDevice,newVal,{change_status:isRemove?'remove':'edit'})));
    handler.$update(state.set('merchantDevice',deviceList));
};
//移除终端参数
export const cleanPosParams = (list)=>{
    let state = exports.state;
    const terminalParams = state.get('channel').pay_channel_terminal_params || [];
    let merchantDevice = state.get('merchantDevice');
    list.map(index=>{
        let newDevice = merchantDevice.get(index);
        terminalParams.forEach(param=>{
            newDevice = newDevice.set(param.key,'');
        });
        newDevice = newDevice.set('change_status','remove');
        merchantDevice = merchantDevice.set(index,newDevice);
    });
    handler.$update(state.set('merchantDevice',merchantDevice));
};
//查询业务能力
export const getBzAblity = ()=>{
    const state = exports.state;
    const channel = state.get('channel');
    const channelConfig = state.get('channelConfig');
    const bzAbilityMap = {};
    if(channelConfig){
        const bzAbility = channelConfig.bz_ability || channelConfig.bzAbility || [];
        bzAbility.forEach(item=>{
            bzAbilityMap[item.attr_key] = item;
        });
    }
    return axios.post('tmsPaychannel/getPaychannelBzAblity',{pay_channel_id:channel.pay_channel_id,pageSize:999})
        .then(res=>{
            let data = res.data;
            const Types = {1:{label:'支持交易类型'},2:{label:'特色功能'}};
            let group = {};
            if(data && data.length)data.map(item=>{
                let type = item.attr_type;
                let param = bzAbilityMap[item.attr_key];
                item.attr_value = param?param.attr_value:0;
                let root = Types[type];
                if(!root)type = 4;
                if(!group[type]){
                    root.child = [];
                    group[type] = root;
                }
                root.child.push(item);
            });
            return Object.values(group);
        });
};
const transferRequestParams  = (params)=>{
    const state = exports.state;
    const merchantDevice = state.get('merchantDevice');
    params.pos_params = [];
    merchantDevice.map(device=>{
        const terminalParams = state.get('channel').pay_channel_terminal_params || [];
        terminalParams.forEach(terminalParam=>{
            let param = {
                device_en:device.get('device_en'),
                device_sn:device.get('device_sn')
            };
            param.attr_name = terminalParam.key;
            param.attr_value = device.get(terminalParam.key);
            if(!device.get('change_status')){//如果没有发生变化（非edit,remove则上传最后更新时间）
                param.update_time = device.get('last_pos_params_update');
            }
            params.pos_params.push(param);
        })
    });
    return params;
};
//参数设置保存
export const applyConfig = (form)=>{
    const state = exports.state;
    let params = transferRequestParams(form);
    params.storePaychannelId = state.get('channel').storePaychannelId;
    return axios.post('/tmsStorePaychannel/configPaychannel',params);
};
//开通支付通道
export const openPayChannel = (pay_mode_id,pay_channel_id,form)=>{
    let state = exports.state;
    let merchant = state.get('merchant');
    let params = transferRequestParams(form);
    return PayChannel.openPaychannel(Object.assign({mcode:merchant.mcode,pay_mode_id,pay_channel_id},params))
};
//删除配置
export const delConfig = ()=>{
    const storePaychannelId = exports.state.get('channel').storePaychannelId;
    return axios.post('/tmsStorePaychannel/configPaychannel',{
        storePaychannelId:storePaychannelId,
        is_delete:2
    })
};