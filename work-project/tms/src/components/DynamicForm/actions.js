"use strict";
import axios from 'axios';
import {message} from 'antd';

export default class Actions{
    form = null;
    constructor(form){
        this.form = form;
    };

    exec(action,actionItem){
        if(!action)return console.warn('empty action',actionItem);
        if((typeof Handlers[action])!='function')return console.warn('action not implements',actionItem);
        Handlers[action].bind(this)(actionItem);
    }
}

export const Handlers = {
    generateKeys:function () {
        const form = this.form;
        form.setBusy(true);
        return axios.post('keygen/alipay2RsaGen').then(res=>{
            let data = res.data[0];
            form.setFieldsValue({privateKey:data.privateKey,publicKey:data.publicKey});
            message.success('密钥对更新成功')
        },err=>{
            message.error(err.message);
        }).finally(()=>{
            form.setBusy(false);
        })
    }
};