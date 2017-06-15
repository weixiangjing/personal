/**
 *  created by yaojun on 17/2/21
 *
 */
  


    

import {ProfitAPI} from "../config/api";
/**
 *
 *
 * 获取有效的支付方式，及支付方式下有效的通道
 * @param cb {Function<Object>}
 *
 * Object=>[
 * {
 *      ...,
 *      channels:[
 *          {
 *              ...,
 *              payChannelId:--
 *
 *          }
 *      ]
 * }
 *
 * ]
 *
 */
export  function getPaymentsAndChannel(cb,shop){
    
    ProfitAPI.commission_getPayMode({isCommission:1}).then((res)=>{
        var length =res.total;
        var types = res.data;
        types.forEach((item)=>{
            bankRewardProfit(item,shop);
            ProfitAPI.commission_getPayChannel({pageSize:999,payModeId:item.payModeId,isCommission:1})
                     .then((res)=>{
                         length-=1;
                         item.channels=res.data.map((channel)=>{
                             return presetProfit(channel);
                         });
                         if(length==0){// over
                    
                                cb(types);
                    
                    
                         }
                     });
            
        });
    });
}


function bankRewardProfit(item,isShop){
    if(item.payModeId!=1006) return ;
    item.hideRewards=false;
    
    item.subsection = [
        {
            minSubsection: 50,
            maxSubsection: 100,
            ratio: 0.02,
            id: Math.random()
        },
        {
            isLast: true,
            minSubsection: 100,
            maxSubsection: 10000,
            ratio: 0.04,
            id: Math.random()
        }
    ]
}
export function cleanRewards(types){
    types.forEach((type)=>{
        if(type.subsection){
            type.subsection=[];
        }
        type.channels.forEach((item)=>{
            if(item.subsection){
                item.subsection=[];
            }
            
        })
    });
    return types;
}


function presetProfit(item,isShop){
    item.status = item.status == 1 ? "1" : "0"; // 分润
    
    if (item.payModeId == 1006) {
        item.ratio = 0.03
        item.djkRatio = 0.03
        item.cap = 2
    } else if (item.payModeId == 1004) {
        item.ratio = 0.2
        
    } else if (item.payModeId == 1003) {
        item.ratio = 0.2;
        
    }
    
    
    
    if (item.payModeId == 1006) {
        
        
        //todo
        
    } else if (item.payModeId == 1004) {//alipay
        item.subsection = [
            
            {
                isLast: true,
                minSubsection: 5,
                maxSubsection: 10000,
                ratio: 0.1,
                id: Math.random()
            }
        ]
        
    } else if (item.payModeId == 1003) {//wx
        item.subsection = [
            
            {
                minSubsection: 5,
                maxSubsection: 20,
                ratio: 0.1,
                id: Math.random()
            },
            {
                isLast: true,
                minSubsection: 20,
                maxSubsection: 10000,
                ratio: 0.15,
                id: Math.random()
            },
        
        ]
    }
    
    return item;
    
    
    
    
}