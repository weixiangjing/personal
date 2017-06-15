/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import React from "react";
import {notification, message, Modal} from "antd";
import {
    getChannel,
    getPayMode,
    getProvider,
    updateChannel,
    addChannel,
    getWorkable,
    getConfigPayChannelBis
} from "../../../../model/PayChannel";
import {handler as parentHandler} from "../Channel/reducer";
import {hashHistory} from "react-router";
const Immutable=require('immutable');
export const handler={};
export const initialState=()=>Immutable.fromJS({
    controls: [],
    isDragEnter: false,
    inspector: {},
    printInspector: {},
    info: {},
    types: [],
    providers: [],
    step: "1",
    loading: false,
    infoLoading: false,
    
    workable: [],
    enabled: [],
    deleteLoading: false,
    printControls: [],
    templateName:"",// 打印模板名称,
    isDirty:false
})
// 可视化拖拽
export const toggleEnterClass=(flag)=> {
    let state=exports.state.updateIn(['isDragEnter'], isEnter=>flag);
    handler.$update(state);
}
export const pushControlToDisplay=(control, index)=> {
    let state=exports.state.updateIn(["controls"], controls=> {
        controls=controls.map(item=>item.set("active", false));
        if(index!==undefined&&index> -1) {
            return controls.splice(index, 0,
                Immutable.fromJS(control));
        } else {
            return controls.push(Immutable.fromJS(control))
        }
    }).set("isDragEnter", false);
    
    handler.$update(state);
    let _index=(typeof index==="undefined"||index== -1) ? state.get("controls").size-1 : index
    control.index=_index
    setInspectorWithActiveControl(control, _index);
}
export const pushPrintControlToDisplay=(control, index)=> {
    
    handler.$update(
        exports.state.updateIn(["printControls"], controls=> {
            controls=controls.map(item=>item.set("active", false));
            if(index!==undefined&&index> -1) {
                return controls.splice(index, 0,
                    Immutable.fromJS(control));
            } else {
                return controls.push(Immutable.fromJS(control))
            }
        }).set("isDragEnter", false).set("isDirty",true).set("printInspector", Immutable.fromJS(control).set("index",index)))
    
}
export const deleteControlFromDisplay=(index)=> {
    let states=exports.state.updateIn(["controls"], controls=>controls.delete(index))
    states=states.set("isDirty",true).updateIn(["inspector"], ()=>Immutable.fromJS({}));
    handler.$update(states);
}
export const updateControlWithKeys=(key, value)=> {
    let state=exports.state.updateIn(key, a=>value).set("isDirty",true);
    handler.$update(state);
}
export const resetControls=(controls)=> {
    let state=exports.state.set("isDirty",true).set("controls", Immutable.fromJS(controls));
    handler.$update(state);
}
export const setInspectorWithActiveControl=(value, index)=> {
    
    let state=exports.state.set("isDirty",true).updateIn(['controls'], control=>control.map(item=>item.set("active", false))).updateIn(["controls", index], control=>control.set("active", true)).set("inspector", Immutable.fromJS(value));
    handler.$update(state);
}
export const updateInspectorOptionsAndDropControl=(index, options, key)=> {
    let state=exports.state.updateIn(['controls', index, key], ()=>options);
    state=state.updateIn(['inspector', key], ()=>options).set("isDirty",true);
    
    handler.$update(state);
}
// 通道配置======
let __is_update__;
let __echo_channel_id__;
export function initialChannel(id) {
    __is_update__=false;
    __echo_channel_id__=null;
    if(id) {
        __is_update__=true;
        __echo_channel_id__=id;
        getChannel({pay_channel_id: id, ascOrDesc: 1}).then(res=> {
            let result=res.data[0];
            let state=exports.state.set("info", Immutable.fromJS(result));
            
            let controls=_getStoreParams(result);
            state=state.set("controls", Immutable.fromJS(controls));
            let printControls =xml2json(result.pos_ticket_template,false);
            if(printControls){
                state=state.set("printControls",Immutable.fromJS(printControls.template)).set("printInspector",Immutable.fromJS(printControls.template[0]?printControls.template[0]:{})).set("templateName",printControls.name)
            }
            
            handler.$update(state);
        })
    }
    getPayMode().then(data=> {
        getProvider({status: 1}).then(provider=> {
            let state=exports.state.set("types", Immutable.fromJS(data)).set("providers", Immutable.fromJS(provider));
            if(!id) state=state.set("info", Immutable.Map({}));
            handler.$update(state);
        });
    })
}
export function nextStep(step) {
    if(step==4) {
        let payment=ChannelConf.normal.getFieldValue("pay_mode_id")
        let isBank=payment==1006;
        
        if(!isBank&&payment) {
            Modal.info({
                title: '提示',
                content: "仅银行卡支付方式可配置业务能力，其它支付方式可跳过"
                
            })
        } else {
            handler.$update(
                exports.state.set("step", step)
            )
        }
        
    } else {
        handler.$update(
            exports.state.set("step", step)
        )
    }
}

/**
 *  or 1(终端模板，商户模板) or 2（打印模板）
 */
export function saveTemplate(type) {
    let info=exports.state.get("info");
    let list=exports.state.get("controls");
    let send={}
    let keyMaps={};
    if(type==1) {// 商户模板 和终端模板
        let isRepeat=false;
        let controls=list.toJS().map((item, index)=> {
            if(typeof keyMaps[item.key]!=="undefined"&&item.key!=undefined) {
                notification.error({
                    message: `通道参数模板配置错误`,
                    description: `第${index+1}个控件 和第${keyMaps[item.key]+1} 个控件，使用了相同的key , ${item.title||'-'} ${item.key||"-"} ,key 必须是唯一的`
                });
                handler.$update(
                    exports.state.set("loading", false)
                )
                isRepeat=true
            }
            if(item.key!==undefined) {
                keyMaps[item.key]=index
            }
            if(item.validator) {
                item.validator=item.validator.map(item=>({
                    [item.rule]: item.value,
                    message: item.message
                }))
            }
            return item;
        })
        if(isRepeat) {
            console.error("字段名称重复 "+isRepeat);
            return;
        }
        let merchant_template=[];
        let terminal_template=[];
        controls.forEach(item=> {
            if(item.classify=="terminalControls") {
                terminal_template.push(item)
            } else {
                merchant_template.push(item);
            }
        })
        if(terminal_template.length>0) {
            send.pay_channel_terminal_params=window.JSON.stringify(terminal_template);
        } else {
            send.pay_channel_terminal_params="[]";
        }
        if(merchant_template.length>0) {
            send.pay_channel_store_params=JSON.stringify(merchant_template);
        } else {
            send.pay_channel_store_params="[]";
        }
    }
    return send;
}
export function echoWorkable() {
    getWorkable().then(res=> {
        getConfigPayChannelBis(__echo_channel_id__).then(data=> {
            let store=res.data;
            let enabled=data;
            let enabledMaps={};
            enabled.forEach(item=> {
                
                if(item.status==1&&__echo_channel_id__) {
                    enabledMaps[item.attr_key]=1;
                }
            });
            let group=[
                {
                    title: "支持交易类型",
                    items: [],
                    checked: false
                }, {
                    title: "特色功能",
                    items: [],
                    checked: false
                }
            ]
            store.forEach(item=> {
                if(enabledMaps[item.attr_key]) {
                    item.checked=true;
                }
                if(item.status==1) {
                    group[+item.attr_type-1].items.push(item);
                }
            });
            group.forEach(items=> {
                items.checked=items.items.every(item=>item.checked);
            })
            handler.$update(
                exports.state.set("workable", Immutable.fromJS(group))
            )
        })
    })
}
export function selectWork(value, id, type, subIndex) {
    let state=exports.state.updateIn(["workable", type, 'items', subIndex], (work)=>work.set("checked", value));
    if(!value) {
        state=state.updateIn(['workable', type, 'checked'], ()=>false);
    }
    handler.$update(state.set("isDirty",true))
}
export function selectAll(index, checked) {
    let state=exports.state.updateIn(['workable', index, "checked"], ()=>checked);
    state=state.updateIn(['workable', index, 'items'], items=>items.map(item=>item.set("checked", checked)));
    handler.$update(state.set("isDirty",true));
}
export function submitWorks() {
    let works=[];
    exports.state.get("workable").forEach(item=> {
        works=works.concat(item.get('items').toJS());
    });
    works=works.filter(item=>item.checked).map(item=>({bz_ability_id: item.id, attr_value: 1}))
    return {
        bz_ablity: works
    }
}
export function formatTemplate() {
}
// 基本信息，和小票打印模板 form，最后收集数据时候使用
export let ChannelConf={}
export function saveForm(key, form) {
    ChannelConf[key]=form;
}

export function saveConf(isAlter) {
    let send={}
    let isError=false
    Object.keys(ChannelConf).map(key=> {// 基础信息和 小票打印模板数据
        ChannelConf[key].validateFields((error, value)=> {
            if(error) {
                isError=true;
                notification.error({
                    message: "基础配置信息错误",
                    description: error[Object.keys(error)[0]].errors.map(item=>item.message).join(',')
                })
                return;
            }
            Object.assign(send, value)
        })
    });
    
    
    Object.assign(send, submitWorks());
    
    let temp=saveTemplate(1);
    if(temp) {// 终端参数模板数据
        Object.assign(send, saveTemplate(1));
    } else {
        return;
    }
    if(isError) return;
    
  
    handler.$update(
        exports.state.set("loading", true)
    )
    let promise;
    send.auto_sign=2;
    if(send.used_time && send.status==1){
        send.used_time=send.used_time.format("YYYY-MM-DD");
    }
    if(isAlter) {
        //alter
        promise=updateChannel(send)
    } else {
        //add
        promise=addChannel(send).then(()=>parentHandler._reload=true);
    }
    promise.then(()=> {
        message.success("操作成功");
        if(!isAlter) {// 修改成功后更改为 编辑页面
            hashHistory.replace(`cashier/info/channel/query?id=${send.pay_channel_id}`);
        }
    }).catch(({message})=>message.error(message)).finally(()=> {
        handler.$update(
            exports.state.set("loading", false)
        )
    })
}

export function deleteChannel(id) {
    updateChannel({pay_channel_id: id, is_delete: 2, _msg: 1}).then(res=> {
        handler.$update(exports.state.set("deleteLoading", false))
        hashHistory.goBack();
    })
}

export function _getStoreParams(result) {
    let terminal=result.pay_channel_terminal_params;
    let store=result.pay_channel_store_params;
    let controls=[];
    if(store) {
        controls=window.JSON.parse(store);
    }
    if(terminal) {
        terminal=window.JSON.parse(terminal);
        controls=controls.concat(terminal);
    }
    return controls.map(item=> {
        if(item.validator) {
            item.validator=item.validator.map(item=> {
                let result={};
                result.message=item.message;
                if(item.required) {
                    result.rule='required';
                    result.value=item.required;
                }
                if(item.pattern) {
                    result.rule="pattern";
                    result.value=item.pattern;
                }
                return result;
            })
        }
        return item;
    })
}

export function setStoreParams(controls) {
    
    if(controls.length==0) {
        handler.$update("controls", Immutable.fromJS([]), "inspector", Immutable.fromJS({}))
    } else {
        handler.$update("controls", Immutable.fromJS(controls));
        let control=controls[0];
        control.index=0
        setInspectorWithActiveControl(Immutable.fromJS(control), 0);
    }
    
}
export function _getControlsLength() {
    return exports.state.get("controls").size;
}
export function setDropControls(data,name=""){
    handler.$update("printControls",Immutable.fromJS(data),"printInspector",Immutable.fromJS(data[0]?data[0]:{}),"templateName",name);
}
export function deleteControl(){
    let store = exports.state;
    let controls =store.get("printControls");
    let inspector=store.get("printInspector")
    let index = controls.findIndex((item)=>item.get("id")==inspector.get("id"));
        controls=    controls.toJS();
        controls.splice(index,1);
    handler.$update("printControls",Immutable.fromJS(controls),"printInspector",Immutable.fromJS({}));
}

export function xml2json(xml,needUpdate=true){
   
    if(!xml) {
        setDropControls([]);
        return ;
    }
    let sourceCode=xml;
    let root =document.createElement("div");
    root.innerHTML=sourceCode;
    
    let template =root.children[0];
    let temAttr= template.attributes[0];
    let temName =temAttr?temAttr.value:"";
  
    let row=template.content.children;
    let array=[]
    for(let i=0;i<row.length;i++) {
        let object={}
        let item=row[i];
        let attributes=item.attributes;
        object.id=Math.random();
        object.classify="";
        let props=object.props={}
        for(let j=0; j<attributes.length; j++) {
            let attr=attributes[j];
            props[attr.name]=attr.value;
        }
        props.label=item.textContent;
        array.push(object);
    }
    if(needUpdate){
        setDropControls(array,temName)
    }else{
        return {template:array,name:temName};
    }
   
}

export function _json2xml(){
    let sourceCode = handler.$state("printControls").toJS();
    let templateName = exports.state.get("templateName");
    let root= document.createElement("div");
    
    for(let i=0;i<sourceCode.length;i++){
        let row = document.createElement("row");
        let item = sourceCode[i].props;
        for(let prop in item){
            if(prop!=="label"){
                row.setAttribute(prop,item[prop]);
            }
        }
        row.innerText=item.label||"";
        root.appendChild(row);
    }
    if(templateName){
        return `<Template name=${templateName}>${root.innerHTML}</Template>`;
    }
    return "<Template>"+root.innerHTML+"</Template>";
}