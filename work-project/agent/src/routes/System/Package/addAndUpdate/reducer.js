/**
 *  created by yaojun on 17/2/7
 *
 */



"use strict";
const Immutable = require('immutable');
import {getPaymentsAndChannel, cleanRewards} from "../../../../model/Package";
import {showMessage, showError} from "../../../../util/helper";
import {ProfitAPI} from "../../../../config/api";
import {mergePackageDetailToPayTypes, mergePackageParams} from "../helper";
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    payments   : [],
    packageName: "",
    isShop     : false,
    isEmpty    : false
});
let __editObj;
let __editMerchant;
/**
 *
 * @param editObj {Object} 如果有该参数，视为修改当前套餐，否则为创建套餐;
 * @param merchant {Object} 1 or 0 从门店那边过来的
 */
export function echoPayments(editObj, merchant) {
    __editObj = __editMerchant = null;
    getPaymentsAndChannel((payments) => {
        if (editObj) {// update
            __editObj = editObj;
            ProfitAPI.commission_getCommissionPackageItem({commissionPackageId: editObj.id})
                     .then(res => {
                         mergePackageDetailToPayTypes(res.data, payments);
                         setPayments(payments, editObj.name);
                     })
        } else if (merchant) {
            __editMerchant = merchant;
            ProfitAPI.commission_getAgentCommissionConfig({...merchant})
                     .then(res => {
                         cleanRewards(payments);// 门店无奖励
                         if (res.data.length > 0) {
                             mergePackageDetailToPayTypes(res.data, payments, true);
                             cleanRewards(payments);
                             setPayments(payments, false, true, false);
                         } else {
                             setPayments(payments, false, true, true);
                         }
                     })
        } else {
            setPayments(payments);
        }
    })
}
// helper merge
function setPayments(payments, name = "", isShop = false, isEmpty = false) {
    handler.$update(
        exports.state.set("payments", Immutable.fromJS(payments))
               .set("packageName", name)
               .set("isShop", isShop)
               .set("isEmpty", isEmpty)
    )
}
/**
 *提交新增套餐 或者保存
 *
 */
export function submit() {
    if (__editObj) {
        return save()
    }
    if (__editMerchant) {
        return saveProfitToMerchant();
    }
    if (!validateAmount()) return;
    let send = mergePackageParams(exports.state);
    if (!send.packageName) {
        showError("请填写套餐名称");
        return false;
    }
    ProfitAPI.commission_addCommissionPackage(send).then(() => {
        showMessage("恭喜您,套餐添加成功了");
        setTimeout(() => {
            location.reload();
        }, 1000);
    });
}
function validateAmount() {
    let send = exports.state.get("payments");
    return send.every(item => {
        let isError = item.get("channels").every(item => {
            let rewardsError = _validateRewardsAmount(item.get("subsection"), item.get("payChannelName"));
         return rewardsError && _validateProfit(item);
        });
        if (item.get("payModeId") == 1006) {
            let sub  = item.get("subsection");
            let name = item.get("payModeName");
            return _validateRewardsAmount(sub, name) && isError;
        }
        return isError;
    });
}

function _validateProfit(channel){
    if(channel.get("status")!=1) return true;// 如果没有开启分润则不验证
    
    let ratio =channel.get("ratio");
    let djk =channel.get("djkRatio");
    let name =channel.get("payChannelName");
    if(!ratio) return showError(`${name} 费率必须设置`),false;
    if(djk === undefined) return true;
    if(!djk) return  showError(`${name} 费率必须设置`),false;
    return true;
}

// return false 表示有错误 提前结束循环
function _validateRewardsAmount(sub = [], name) {
    let yes = sub.every(item => {
        let max = item.get("maxSubsection");
        let min = item.get("minSubsection");
        if (max !== "" && max < min) {
            return false;
        }
        return true;
    })
    if (!yes) {
        showError(`${name} 奖励金额区间设置不正确`);
    }
    return yes;
}
/**
 * 将当前查看的套餐保存
 */
export function save() {
    if (!validateAmount()) return;
    var send = mergePackageParams(exports.state);
    send.commissionPackageId = __editObj.id;
    ProfitAPI.commission_updateCommissionPackage(send).then(() => {
        showMessage("套餐修改成功");
    });
}
// ==门店分润设置
export function saveProfitToMerchant() {
    var send   = mergePackageParams(exports.state, false, true);
    send.mcode = __editMerchant.mcode;
    delete  send.packageName;
    ProfitAPI.commission_addOrUpdateMerchantCommissionConfig(send).then(() => {
        showMessage("套餐设置成功");
    })
}
export function deleteProfitFromMerchant() {
    var send   = mergePackageParams(exports.state, true, true);
    send.mcode = __editMerchant.mcode;
    ProfitAPI.commission_addOrUpdateMerchantCommissionConfig(send).then(() => {
        showMessage("删除成功");
    })
}
// 通道奖励增加删除
const defaultRewardConf = () => (Immutable.fromJS({
    maxSubsection: "",
    minSubsection: 0,
    id           : Math.random(),
    radio        : ""
}))
export function addReward(path) {
    let state = exports.state.updateIn(path, (rewards) => {
        let last = rewards.last();
        if (last) {
            let max = last.get("maxSubsection")
            if (!max) return rewards;
            last = defaultRewardConf().set("minSubsection", max);
        }
        return rewards.push(last || defaultRewardConf());
    });
    handler.$update(state);
}
export function subReward(path) {
    let index = path.pop();
    let state = exports.state.updateIn(path, (rewards) => rewards.delete(index));
    handler.$update(state);
}
// 双向绑定
export function updateControl(path, value, fromRadio, name) {
    let state = exports.state.updateIn(path, (oldValue) => name ? value : (isNaN(value) ? oldValue : value));
    if (fromRadio) { // 是否分润选择
        state = hideRewardsIfClose(path, state);
    }
    handler.$update(state);
}
// 如果关闭了通道分润,则不显示分润设置和奖励
function hideRewardsIfClose(path, state) {
    path.pop();
    let item = state.getIn(path);
    if (item.get("payModeId") == 1006) {
        path.pop();
        let isClose  = false;
        let channels = state.getIn(path);
        isClose      = !channels.some(obj => obj.get("status") == 1);
        state        = state.updateIn([...path.slice(0, -1), 'status'], () => isClose ? 0 : 1)
    }
    return state;
}
