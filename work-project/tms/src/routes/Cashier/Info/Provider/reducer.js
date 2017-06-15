/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import {updateProvider, getProvider, addProvider} from "../../../../model/PayProvider";
import {cleanEmpty} from "../../../../util/helper";
import {Table} from "../../../../components/Table"
const Immutable           = require('immutable');
export const initialState = () => {
    return Immutable.fromJS({
        total         : 0,
        loading       : true,
        confirmLoading: false,
        items         : [],
        echo          : {},
        visible       : false
    })
}
export const handler      = {}
export function showModal(visible, item, form) {
    let state = exports.state.set("visible", visible)
    if (item) {
        form.setFieldsValue(item);
    } else {
        form.resetFields();
    }
    handler.$update(state)
}
export function disableProvider(col){
    
    updateProvider({status:col.status==1?2:1,pay_sp_id:col.pay_sp_id}).then(res => {
        handler.$update(
            exports.state.set("loading", true).set("confirmLoading", false).set("visible", false))
        Table.getTableInstance().update();
       
    })
}
export function editorProvider(form) {
    let promise;
    let isError = false;
    form.validateFields((error, value) => {
        if (error) return isError = 1;
        let send = value
        let id = value.pay_sp_id;
        if (id) {
            promise = updateProvider(send).then(()=>Table.getTableInstance().update())
        } else {
            promise = addProvider(send).then(()=>Table.getTableInstance().reload())
        }
    });
    if (isError) return;
    // 关于form表单清空的问题
    promise.then(res => {
        handler.$update(
            exports.state.set("loading", true).set("confirmLoading", false).set("visible", false)
        )
       
    })
}
export function toggleStatus(col) {
    col.status = col.status == 1 ? 2 : 1;
    handler.$update(
        exports.state.set("loading", true)
    )
    updateProvider(col).then(res => {
        Table.getTableInstance().update()
    })
}
let __sp_name__ = {pay_sp_name_like: ""}
export function echoProvider(send = {}) {
    if (send.pay_sp_name_like) {
        __sp_name__["pay_sp_name_like"] = send.pay_sp_name_like;
    } else if(send.pageNum) {
        send.pay_sp_name_like =__sp_name__["pay_sp_name_like"];
    }
    console.log(send)
    getProvider(cleanEmpty(send)).then(res => {
        handler.$update(
            exports.state.set("items", Immutable.fromJS(res.data))
                   .set("loading", false)
                   .set("total", res.total)
                   .set("pageSize", send.pageSize)
        )
    })
}
export function change(send) {
    handler.$update(
        exports.state.set("loading", true)
    )
    echoProvider(send)
}


export function deleteProvider(id){
    let obj ={
        is_delete:2,
        pay_sp_id:id
    }
    updateProvider(obj).then(res => {
        handler.$update("visible",false);
        Table.getTableInstance().update()
    })
}