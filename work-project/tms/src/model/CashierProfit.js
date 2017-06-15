/**
 *  created by yaojun on 17/1/6
 *
 */
  


    
import ajax from "axios";

export function getProfit(send){
   return ajax.post("tmsPayRate/getPayRateCombo",send);
}

export function updateProfit(send){
    return ajax.post("tmsPayRate/updatePayRate",send);
}

export function addProfit(send){
    return ajax.post("tmsPayRate/addPayRate",send);
}
export function getRateInfo(id){
    return ajax.post("tmsPayRate/getPayRateInfo",{rate_id:id}).then(res=>res.data[0]);
}