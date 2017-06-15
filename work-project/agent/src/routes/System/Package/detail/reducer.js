/**
 *  created by yaojun on 17/2/22
 *
 */



"use strict";
import {getPaymentsAndChannel} from "../../../../model/Package";
import {ProfitAPI} from "../../../../config/api"
import {mergePackageDetailToPayTypes} from "../helper"
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    detail: []
});

window.imm= Immutable
export function echoDetail({id,n}){
    ProfitAPI.commission_getCommissionPackageItem({commissionPackageId:id})
             .then(function (res) {
    
                 getPaymentsAndChannel((data)=>{
                     mergePackageDetailToPayTypes(res.data, data);
                     handler.$update(exports.state.set("detail",Immutable.fromJS(data)))
                 })
             });
   
}
