/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import {getPayPlugin, addPayPlugin, updatePayPlugin} from "../../../../model/PayPlugin";
const Immutable = require('immutable');
export const initialState = () => Immutable.fromJS({visible: false,
    plugins: [],
    modal: {},
    confirmLoading: false});
export const handler      = {};
export function toggleVisible(visible, form) {
    handler.$update(exports.state.set("visible", visible));
}
export function echoPlugins(id) {
    getPayPlugin({pay_channel_id: id}).then(res => {
        handler.$update(
            exports.state.set("plugins", Immutable.fromJS(res))
        )
    })
}
export function addPlugin(form) {
    form.resetFields();
    handler.$update(
        exports.state.set("visible", true).set("modal",Immutable.Map({}))
             
    )
}
export function editPlugin(plugin,form) {
 
    
   
    handler.$update(
        exports.state.set("visible",true).set("modal",plugin)
    )
    setTimeout(()=>form.setFieldsValue(plugin.toJS(),300));
}
/**
 *
 * @param form
 * @param id 有是修改，没有是添加
 * @returns {*}
 */
export function submit(form,id) {
  form.validateFields((error,send)=>{
      console.log(error)
        if(error) return null;
      handler.$update(exports.state.set("confirmLoading", true));
      send.pay_channel_id     = id;
      send.pay_plugin_name    = (send.package_name||"") + ' ' + send.trade_sdk_version;
      send.pay_plugin_version = send.trade_sdk_version;
      let plugin_id = send.pay_plugin_id
    
      update(plugin_id, send).catch(() => closeLoading()).then(() => {
          closeLoading();
          echoPlugins(id);
      });
    })
 
   
}
function update(id, send) {
    let post;
    if (id) {
        send.pay_plugin_id = id;
        post               = updatePayPlugin
    } else {
        post = addPayPlugin
    }
    send._msg=1;
    return post(send)
}
function closeLoading() {
    handler.$update(exports.state.set("confirmLoading", false).set("visible",false));
}
export function deletePlugin(id, item, index) {
    let send = {
        pay_channel_id: id,
        pay_plugin_id : String(item.get("pay_plugin_id")),
        _msg:1,
        is_delete:"2"
    }
    updatePayPlugin(send).then(() => {
       echoPlugins(id);
    })
}