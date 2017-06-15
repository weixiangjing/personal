"use strict";
import axios from 'axios';
const Immutable = require('immutable');
const PayChannel = require('../../../../model/PayChannel');
import {message} from 'antd';
import {cleanEmpty} from '../../../../util/helper';
import {arrayMove} from 'react-sortable-hoc';

export const initialState = ()=>{
    return Immutable.fromJS({
        selectedMerchant:null,
        merchants:[],
        tabKey:null,
        formData:null,
        habits:[
            { label: '按设备进行批结算', value: 'settleByEnSW'},
            { label: '批结算单打印交易明细', value: 'settleWithDetail'},
            { label: '挥卡交易优先', value: 'swingCardFirst'},
            { label: '隐藏小票设置功能', value: 'hideReceiptSettings'}
        ],
        logs:{
            pageSize:20,
            pageNum:1,
            total:0,
            data:[]
        }
    })
};

export const handler = {};
export const activeTab = (key)=>{
    handler.$update(exports.state.set('tabKey',key));
};
export const search = (params)=>{
    let data = {};
    data[params.type] = params.keywords;
    Object.assign(data,{pageSize:30,status:1});
    data = cleanEmpty(data);
    return axios.post('/tmsMerchant/getMerchant',data).then((res)=>{
        const state = exports.initialState();
        const merchants = Immutable.fromJS(res.data);
        merchants.totalCount = res.total;
        const newState = state.set('merchants',merchants).set('formData',params);
        handler.$update(newState);
        return merchants;
    })
};
export const getOpenedPayChannel = ()=>{
    const state = exports.state;
    let merchant = state.get('selectedMerchant');
    if(!merchant)return;
    let param = {store_name:merchant.get('store_name'),mcode:merchant.get('mcode')};
    Object.assign(param,{pageSize:999});
    return PayChannel.getOpenPayChannel(param).then((data)=>{
        let map = {};
        data.forEach((item)=>{
            if(!map[item.pay_mode_id])map[item.pay_mode_id] = {
                pay_mode_id:item.pay_mode_id,
                pay_mode_name:item.pay_mode_name,
                channels:[]
            };
            map[item.pay_mode_id].channels.push(item);
        });
        data = Object.values(map);
        data.forEach(mode=>{
            mode.status = 2;
            const opend = [],notOpend = [];
            for(let i=0;i<mode.channels.length;i++){
                const channel = mode.channels[i];
                if(channel.status == 1){
                    mode.status = 1;
                    opend.push(channel);
                }else {
                    notOpend.push(channel);
                }
            }
            notOpend.sort((a,b)=>{
                return a.pay_channel_id<b.pay_channel_id;
            });
            mode.channels = opend.concat(notOpend);
        });
        const merchant = state.get('selectedMerchant').set('modes',Immutable.fromJS(data));
        handler.$update(state.set('selectedMerchant',merchant));
        return data;
    })
};
export const getLog = (pageIndex)=>{
    const state = exports.state;
    let merchant = state.get('selectedMerchant');
    let logs = state.get('logs');
    if(pageIndex==='next')pageIndex = logs.get('pageNum')+1;
    if(isNaN(pageIndex))pageIndex = 1;
    let param = {mcodes:merchant.get('mcode'),pageNum:pageIndex,pageSize:logs.get('pageSize')};
    return axios.post('/tmsPaychannelLog/getLog',param).then((res)=>{
        let newList = logs.get('data').concat(res.data);
        let newLogs = logs.set('data',newList).set('total',res.total).set('pageNum',pageIndex);
        _update(newLogs);
        return res;
    }).catch(err=>{
        _update(err);
        return err;
    });

    function _update(logs) {
        handler.$update(state.set('logs',logs));
    }
};
export const selectMerchant = (merchant)=>{
    handler.$update(exports.state.set('selectedMerchant',merchant));
};
export const sortPayMode = ({oldIndex, newIndex})=>{
    const state = exports.state;
    let merchant = state.get('selectedMerchant');
    let modes = merchant.get('modes').toArray();
    let sortedMode = Immutable.List(arrayMove(modes, oldIndex, newIndex));
    let newMerchant = merchant.set('modes',sortedMode);
    let sortedChannels = [];
    sortedMode.map(mode=>{
        mode.get('channels').map(channel=>{
            let num = sortedChannels.length;
            sortedChannels.push({
                storePaychannelId:channel.get('storePaychannelId'),
                status:channel.get('status'),
                sort_num:num
            });
        });
    });
    handler.$update(state.set('selectedMerchant',newMerchant));
    return axios.post('/tmsStorePaychannel/batchUpdatePaychannel',{storePaychannes:sortedChannels}).catch((err)=>{
            handler.$update(state.set('selectedMerchant',merchant));
            message.error('操作失败：'+err.message)
        });

};
export const updatePayChannel = (param,refreshOnSuccess=true)=>{
    return new Promise((resolve, reject)=>{
        axios.post('tmsStorePaychannel/updatePaychannel',param).then((res)=>{
            if(refreshOnSuccess)getOpenedPayChannel().then(resolve,reject);
            else resolve(res);
        },reject);
    });
};
export const reset = ()=>{
    handler.$update(exports.initialState());
};
export const togglePayMode = (param)=>{
    return new Promise((resolve, reject)=>{
        axios.post('/tmsStorePaychannel/openOrClosePaymode',param).then(()=>{
            getOpenedPayChannel().then(resolve,reject);
        },reject);
    });
};
export const getHabits = (params)=>{
    return axios.post('storeCashierParams/query',params);
};
export const updateHabits = (params)=>{
    return axios.post('storeCashierParams/update',params);
};