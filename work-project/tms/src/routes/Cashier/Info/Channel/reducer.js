/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import {cleanEmpty} from "../../../../util/helper";
import {
    getPayMode,
    getProvider,
    getChannel,
    updateChannel
} from "../../../../model/PayChannel";
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.Map({
    loading : true,
    types   : [],
    service : [],
    channels: [],
    total   : 0,
    current : 0,
    pageSize:20,
});
export function initialTypesAndService(types, service, channel) {
    let state = exports.state.set("types", types)
                       .set("service", service)
                       .set("channels", channel.data)
                       .set("total", channel.total)
                        .set("loading",false)
    handler.$update(state);
}
export function reloadChannel(send) {
    loading(true);
    getChannel(send).then(({data, total}) => {
        let state = exports.state.set("channels", data)
                           .set("total", total)
                           .set("loading", false);
        if(send.pageSize){
            state = state.set("pageSize",send.pageSize);
        }
        handler.$update(state);
    })
}

let  __value__=null;
export function onFieldsChange(form, fields) {
    let send = form.getFieldsValue();
    if (fields) {
        let key = Object.keys(fields)[0];
        if (key === "pay_channel_name_like") return;
    }
    
    __value__=cleanEmpty(send);
    reloadChannel(__value__);
}
export function initialPage(form) {
 
    getPayMode().then(res => {
       handler.$update(exports.state.set("types",res.slice(0,8)).set("allTypes",res))
    })
}
export function onPageChange(page, form) {
    let send     = form.getFieldsValue();
    send.pageNum = page.current;
    send.pageSize= page.pageSize;
    reloadChannel(cleanEmpty(send));
}
export function loading(s) {
    let state = exports.state;
    handler.$update(state.set("loading", s));
}
export function closeChannel(channel, index) {
    let status = channel.status == 1 ? 2 : 1
    let send   = {status, pay_channel_id: channel.pay_channel_id};
    loading(true)
    updateChannel(send).then(() => {
        let state = exports.state.updateIn(['channels'], (channels) =>{
            return Immutable.fromJS(channels).updateIn([index,'status'],()=>status).toJS()
        }).set("loading", false)
        handler.$update(state);
    })
}

export function cropTypes(expand){
    let state =exports.state;
    let types= state.get("allTypes");
    let cropTypes;
    if(expand){
        cropTypes=types;
    }else{
        cropTypes=types.slice(0,8);
    }

    handler.$update(
        state.set("types",cropTypes)
    )
}