/**
 *  created by yaojun on 17/2/22
 *
 */



"use strict";
import {ProfitAPI} from "../../../../config/api";
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    packages: [],
    total:0,
    size:20,
    loading:false,
});
export function echoPackages(send={}) {
    handler.$update(exports.state.set("loading",true));
    ProfitAPI.commission_getCommissionPackage(send)
             .then(res => handler.$update(
                 exports.state.set("loading",false)
                              .set("size",send.pageSize||20)
                              .set("total",res.total)
                              .set("packages", Immutable.fromJS(res.data))));
}