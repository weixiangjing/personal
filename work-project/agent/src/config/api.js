/**
 * Created by yaojun on 16/11/7.
 */


import {notification} from "antd";
import moment from "moment";
import ajax from "axios";
const enc = require("crypto");


export const BASE_URL= "/api/";
export const PROFIT_API="/profit/";
export const OLD_AGENT_API="/wangPosAgent/";
export const APP_ID ="576d55169033a826dcd4675a"
export const PAGE_SIZE="20";
export const APP_SECRET_ID="3db37a59b12e47429e2a2a250b61797e";


export const API_MERCHANT ="merchant";
export const API_MERCHANT_DETAIL ="merchant/:storeId";
export const API_LOGIN ="account/login";
export const API_SALES="sales";
export const API_SALES_ALTER="sales/:_id";
export const API_SEND_SMS_WITH_PASSWORD="account/password/retrieve/smsCode";
export const API_SEND_SMS_WITH_MERCHANT="merchant/smsCode";
export const API_AGENT_AUDIT="agent/:agentId/audit";
export const API_MERCHANT_IS_EXIST="merchant/exist";// ?phone


export const API_DEVICES="device";
export const API_DEVICE_DETAIL="device/:_id"
export const API_AGENT="agent";
export const API_AGENT_DETAIL="agent/:agentId";// get post
export const API_BASIC_CLASSIFY="basic/classify";
export const API_SMS="utils/sms/:phone";
export const API_ADDRESS="basic/address";
export const API_ALTER_PASSWORD="account/password/modify";
export const API_FIND_PASSWORD="account/password/retrieve";
export const API_STAT_DEVICES="statistics/device";
export const API_ACCOUNT_STATUS="account/:accountId/status";
export const API_AGENT_RELATION="agent/:agentId/relation";
export const API_DEVICE_BIND="device/:deviceId/bind";
export const API_DEVICE_UNBIND="device/:deviceId/unbind";
export const API_NEWS="news";

export const API_PROFIT_COMMISSION_SUMMARY="commissionRecord/getCommissionSummary";
export const API_PROFIT_COMMISSION_DETAIL="commissionRecord/getCommissionDetails";
export const API_PROFIT_COMMISSION_SUMMARY_MONTH="commissionRecord/getCommissionDetails?a=1";


function parseParam(url,param){
    if(param&&typeof param !=="object"){
      return   url.replace(/\:\w+/,()=>param);
    }
    return url.replace(/\:\w+/g,(match)=>{
      let  key=match.slice(1);
      let val =param[key];
      if(!val) throw Error("缺少参数:",key,'value:',val);
      return   val;
        
    })
}
 function Get (url,send,entity){
    if(param){
        url=parseParam(entity);
    }
   return  ajax.get(url,send);
}
function Post(url,body,param){
    if(param){
        url =parseParam(url,param);
    }
   return  ajax.post(url,body);
}
function md5(str) {
    let md = enc.createHash("md5");
        md.update(str);
        return md.digest("hex");
}

export function validateMerchantHasRegister(phone){
    return Get(API_MERCHANT_IS_EXIST,{phone});
}

export function getAgentAudit(agentId) {
    return Get(API_AGENT_AUDIT, null, agentId);
}
export function auditAgent(agentId,auditStatus,refuseReason,_msg){
    return Post(API_AGENT_AUDIT,{auditStatus,refuseReason,_msg},agentId)
}

export function getNews(type,target){
    initPage(API_NEWS,{type},target);
}
export function alterSale(send,e){
    return Post(API_SALES_ALTER,send,e);
}
export function sendSMSWithPassword(phone){
  return    Get(API_SEND_SMS_WITH_PASSWORD,{phone});
}
export function alterPassword(send){
    return Post(API_ALTER_PASSWORD,send);
}
/**
 *
 * @param mcode
 * @param deviceId
 * @param type 1 代理商 2 门店
 * @returns {*}
 */
export function bindDeviceToMerchant(mcode,deviceId){
   return  Post(API_DEVICE_BIND,{_msg:"操作成功",mcode},deviceId)
}
export function unbindDeviceFromMerchant(mcode,deviceId){
    return Post(API_DEVICE_UNBIND,{_msg:"操作成功",mcode},deviceId)
}
export function getDevices(isBind=false,mcode){
    return Get(API_DEVICES,{isBind,mcode});
}
export function getMerchantDetail(storeId,cb){
    Get(API_MERCHANT_DETAIL,null,storeId).then(cb);
}
export function toggleStatus(accountId,status,cb){
    Post(API_ACCOUNT_STATUS,{status},accountId).then(cb);
}

export function addSale(send,cb){
    Post(API_SALES,send).then(cb);
}

/**
 *
 * @param level -1 取省份 -2 取城市 默认取所有
 * @returns {*}
 */
export function getAddress(level) {
    
    
    return     Get(API_ADDRESS).then(function (res) {
            res.forEach(function (add) {
                add.value=add.name;
                add.label=add.name;
                if(level==1) return ;
                add.children=add.city;
                add.city=null;
                if(add.children){
                    add.children.forEach(function (city) {
                        city.value=city.name;
                        city.label=city.name;
                        if(level==2) return ;
                        city.children=city.county;
                        city.county=null;
                        if(city.children){
                            city.children=city.children.map(function (county) {
                                return {value:county,label:county};
                            })
                        }
                    
                    })
                }
            });
        
            return res;
        })
    
   
    
}

export function getDeviceDetail(id,cb){
     Get(API_DEVICE_DETAIL,null,id).then(cb);
}
export function statDevices(cb){
    Get(API_STAT_DEVICES).then(res=>cb(res));
}
export function getAgentDetailById(id,cb){
    Get(API_AGENT_DETAIL,null,id).then(cb);
}
export function alterAgentDetail(id,detail,cb){
    Post(API_AGENT_DETAIL,detail,id).then(cb)
}
export function getPersonalInfo(send,entiy,cb){
    Get(API_AGENT_RELATION,send,entiy).then(cb)
}
let lastRequestTime=0;
// profit
/**
 *  查询支付方式
 *
 *
 */

const profit_api={
    
    commission_getPayMode (data) {
        
        return this.post("commission/getPayMode", data);
    },
    /**
     *  查询支付渠道
     * @param data
     * @returns {*|HttpPromise}
     */
    commission_getPayChannel (data) {
        return this.post("commission/getPayChannel", data);
    },
    /**
     * 添加分润套餐
     * @param data
     */
    commission_addCommissionPackage (data) {
        
        return this.post("commission/addCommissionPackage", data);
    },
    /**
     * 修改分润套餐
     * @param data
     */
    commission_updateCommissionPackage (data) {
        return this.post("commission/updateCommissionPackage", data);
        
    },
    commission_getCommissionPackage (data) {
        return this.post("commission/getCommissionPackage", data);
    },
    /**
     * 查询分润明细
     * @param data
     */
    commission_getCommissionPackageItem (data={}) {
        data.pageSize=999;
        return this.post("commission/getCommissionPackageItem", data);
        
    },
    /**
     * 添加或修改门店分润配置
     * @param data
     * @returns {*|HttpPromise}
     */
    commission_addOrUpdateMerchantCommissionConfig (data) {
        return this.post("commission/addOrUpdateMerchantCommissionConfig", data);
        
    },
    /**
     * 查询门店分润配置
     * @param data
     * @returns {*|HttpPromise}
     */
    commission_getMerchantCommissionConfig (data={}) {
        data.pageSize=999;
        return this.post("commission/getMerchantCommissionConfig", data);
    },
    /**
     * 添加或修改一级代理商分润配置
     * @param data
     * @returns {*|HttpPromise}
     */
    commission_addOrUpdateFirstLevelAgentCommissionConfig (data) {
        return this.post("commission/addOrUpdateFirstLevelAgentCommissionConfig", data);
    },
    /**
     * 查询一级代理商分润配置
     * @param data
     * @returns {*|HttpPromise}
     */
    commission_getFirstLevelAgentCommissionConfig (data) {
        
        return this.post("commission/getFirstLevelAgentCommissionConfig", data);
    },
    /**
     * 设置二级代理商分润比例
     * @param data
     * @returns {*|HttpPromise}
     */
    commission_setSecondLevelAgentCommissionConfig (data) {
        return this.post("commission/setSecondLevelAgentCommissionConfig", data);
    },
    /**
     * 查询二级代理商分润比例
     * @param data
     * @returns {*|HttpPromise}
     */
    commission_getSecondLevelAgentCommissionConfig (data) {
        return this.post("commission/getSecondLevelAgentCommissionConfig", data);
    },
    /**
     * 查询代理商分润汇总
     * @param data
     * @returns {*|HttpPromise}
     */
    commissionRecord_getCommissionSummary (data) {
        return this.post(API_PROFIT_COMMISSION_SUMMARY, data);
        
    },
    commission_getAgentCommissionConfig (data) {
        return this.post("commission/getAgentCommissionConfig",data);
    },
    /**
     * 查询代理商分润明细
     * @param data
     * @returns {*|HttpPromise}
     */
    commissionRecord_getCommissionDetails (data) {
        
        return this.post("commissionRecord/getCommissionDetails", data);
    },
    imp_importTradeData (data) {
        return this.post("imp/importTradeData", data);
        
    }, imp_importRelationship (data) {
        
        return this.post("imp/importRelationship", data);
    }, commissionHandle_reckonOrdinaryCommission (data) {
        
        return this.post("commissionHandle/reckonOrdinaryCommission", data);
    }, commissionHandle2_reckonRewardCommission (data) {
        return this.post("commissionHandle2/reckonRewardCommission", data)
    },commission_getAgent(data){
        return this.post("commission/getAgent",data);
    },
    
    
    /**
     *  post
     * @param url
     * @param data
     * @returns {HttpPromise}
     */
    post (url, data, forward) {
        
       
        if(!data)data={}
        
        var _url =PROFIT_API+"newApi/forward";
        if (!data) {
            
            data = {}
        }
       
        
        var send = {}
    
        data.action = url;
        data.forward = forward || "";
        for (var key in data) {
        
            if (key.indexOf("__") > -1) {
                continue;
            }
            if (data[key] || data[key]===0){
                send[key] =data[key];
                send[key] = typeof send[key]==="number"? send[key]+"":send[key];
            }
        }
        send.submitTime =moment(new Date).format("YYYY-MM-DD HH:mm:DD");
        send.appId = APP_ID;
        send.pageSize = data.pageSize||PAGE_SIZE;
        
        var sign = Object.keys(send).sort().map(function (key) {
            var str = send[key];
            str = Array.isArray(str)||typeof str ==="object"?JSON.stringify(str):str;
            return key + str;
        }).join('');
        
        send.sign =md5(APP_SECRET_ID + sign + APP_SECRET_ID);
        
    return   request(_url,send);
        
     
    }
}

function request (url,send){
  return   Post(url,send).then(res=>{
        var result;
        if(typeof res ==="string"){
             result = JSON.parse(res);
        }else{
            result = res;
        }
       
        if(result.code =="0"){
          return result;
        }else{
            
            notification.error({message:"请求错误",description:result.msg});
            console.log(result);
          var error = new Error(result.status);
                error.message= result.info;
            throw  error;
        }
        
    });
}

export const ProfitAPI= profit_api;