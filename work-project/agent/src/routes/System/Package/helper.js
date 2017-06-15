/**
 *  created by yao jun on 17/2/22
 *
 */
import {accDiv, accMul} from "../../../util/helper";
import immutable from "immutable";
/**
 *  合并数据，将套餐数据和 原始支付方式数据 进行合并
 * @param res  套餐数据数组
 * @param payTypes 已经存在最新的分润银行支付方式及支付通道,将套餐数据合并到最新的数据上。
 */

const MAX_AMOUNT                      = "9999999999999";
export function mergePackageDetailToPayTypes(res, payTypes,isShop=false) {
    var obj = {}
    res.forEach(function (type) {
        if (!obj[type.payModeId]) {
            var _type           = {}
            _type.channels      = []
           
            _type.payModeName   = type.payModeName
            _type.payModeId     = type.payModeId;
            _type.isBank        = _type.payModeId == 1006;
            // _type.isShowRewards = (!isShop && (level == 1 || !level))
            obj[type.payModeId] = _type;
        }
        if (type.payModeId == 1006 && !type.payChannelId && type.subsection && typeof type.subsection == "string" && !isShop) {
            obj[type.payModeId].subsection   = JSON.parse(type.subsection);
            obj[type.payModeId].isBank       = true;
            // obj[type.payModeId].isReward = type.commissionConfigType == 2 ? "1" : "0"
            obj[type.payModeId].payModeId    = type.payModeId;
            obj[type.payModeId].payModeName  = type.payModeName;
            obj[type.payModeId].isCommission = type.isCommission;
            //obj[type.payModeId].isShowRewards = ((!isShop ) && obj[type.payModeId].isReward == 1);
            obj[type.payModeId].subsection.forEach(function (item, index) {
                if (index == obj[type.payModeId].subsection.length - 1) {
                    item.maxClose = true;
                    item.isLast   = true;
                }
                item.isClose = true;
                item.minSubsection /= 1000000;
                if (item.maxSubsection == MAX_AMOUNT) {
                    item.maxSubsection = "";
                } else {
                    item.maxSubsection /= 1000000;
                }
                item.ratio = accMul(item.ratio, 100)
                item.id    = Math.random() + "";
            })
        }
    });
    var channels = {}
    res.forEach(function (item) {
        
        if (!channels[item.payChannelId] && item.payChannelId) {
            channels[item.payChannelId] = []
        }
        if (channels[item.payChannelId]) {
            channels[item.payChannelId].push(item);
        }
    })
    var newChannel = [];
    // 把奖励通道和普通分润通道 合并成一条数据~~~
    for (var i in channels) {
        var channel = channels[i];
        if (channel.length == 2) {
            if (channel[0].commissionConfigType == 2) {
                if (channel[0].payModeId != 1006)
                    channel[1].subsection = channel[0].subsection;
                newChannel.push(channel[1])
            } else {
                if (channel[1].payModeId != 1006)
                    channel[0].subsection = channel[1].subsection;
                newChannel.push(channel[0])
            }
        } else {
            newChannel.push(channel[0]);
        }
    }
    newChannel.forEach(function (channel) {
       
        if (obj[channel.payModeId])
            obj[channel.payModeId].channels.push(channel);
        channel.status = channel.status == 1 ? "1" : "0";
        //channel.isAdd = true;
        // channel.isReward = "1";
        if (channel.ratio) {
            channel.ratio = accMul(channel.ratio, 100)
        }
        if (channel.cap) {
            channel.cap = accDiv(channel.cap, 100);
        }
        if (channel.djkRatio) {
            channel.djkRatio = accMul(channel.djkRatio, 100);
        }
       
        if (channel.subsection && typeof channel.subsection == "string" && !isShop) {
            channel.subsection = JSON.parse(channel.subsection);
            channel.subsection.forEach(function (item, index) {
                if (index == channel.subsection.length - 1) {
                    item.maxClose = true;
                    item.isLast   = true;
                }
                item.isClose = true;
                item.minSubsection /= 1000000;
                if (item.maxSubsection == MAX_AMOUNT) {
                    item.maxSubsection = "";
                } else {
                    item.maxSubsection /= 1000000;
                }
                item.ratio = accMul(item.ratio, 100)
                item.id    = Math.random() + "";
            })
        }
        if (channel.subsection) {
            channel.isShowRewards = true;
        } else {
            channel.subsection = [];
        }
        if (isShop) {
            channel.subsection    = []
            channel.isShowRewards = false;
        }
        // if(channel.commissionConfigType==1){
        //     channel.subsection=[]
        // }
    });
    // 如果银行所有通道都是不分润,则不显示 添加奖励分润按钮
    if (obj['1006']) {
        obj['1006'].hideRewards = newChannel.filter(function (item) {
            return item.payChannelId && item.payModeId == 1006
        }).every(function (item) {
            console.log('status:', item.status);
            return item.status == 0;
        });
    }
    // 将所有套餐数据的支付通道转成map 映射
    var package_channels_map = {};
    Object.keys(obj).forEach(function (item) {
        obj[item]['channels'].forEach(function (channel) {
            package_channels_map[channel.payChannelId] = channel;
        });
    });
    // 将原始支付方式数据与套餐数据合并，以原始数据为准，如果原始数据里面有新增数据，则在套餐数据中显示出来。
    // 如果套餐数据中有支付通道，但在原始数据中已被停用则停用现有通道，保持与原始数据一致
    payTypes.forEach(function (types) {
        if (types.payModeId == 1006) {
            types.subsection  = obj['1006'] ? obj['1006'].subsection : '';
            types.hideRewards = obj[1006].hideRewards;
        }
      
        types.channels = types.channels.map(function (channel) {
            
            var exist = package_channels_map[channel.payChannelId]
            if (exist) {
                return merge(channel, exist);
            } else {
                channel.status = "0";
                return channel;
            }
        });
    
        
        
    });
}

/**
 *  Helper 从 代理商 1.5 angular 版本 复制的
 * @param isDelete {boolean}
 * @param isShop {boolean}
 * @returns {{}}
 *
 */
export function mergePackageParams(store,isDelete,isShop) {
    var send                   = {};
    var packageStore           = store.get("payments");
    send.packageName           =store.get("packageName");
    send.commissionPackageItem = []
    var types =packageStore.toJS();
    types.forEach(function (type) {
        getPageParams(type, send.commissionPackageItem,isShop);
    })
    if (isDelete) {
        send.commissionPackageItem.forEach(function (item) {
            item.isDelete = "1";
        })
    }
    send.commissionPackageItem = JSON.stringify(send.commissionPackageItem);
    return send;
    
}


export  function getPageParams(type, array,isShop) {
  
    if (type.isConfigChannel == 0) {
        return
    }
    
    var _sub;
    if (type.payModeId == 1006 && type.subsection && type.subsection.length > 0) {
        var obj = {}
        obj.commissionConfigType = "2";
        obj.ratio = "0"
        obj.status = "1";
        obj.payModeId = type.payModeId + '';
        obj.isReward = "1";
        obj.isCommission = type.isCommission;
        obj.payModeName = type.payModeName;
        
        
        obj.subsection = type.subsection.map(function (item) {
            return {
                minSubsection: accMul(item.minSubsection, 1000000) + "",
                maxSubsection: item.maxSubsection ? accMul(item.maxSubsection, 1000000) : MAX_AMOUNT + "",
                ratio: accDiv(item.ratio, 100)
            }
        });
      
        
        _sub = JSON.parse(JSON.stringify(obj.subsection));
        array.push(obj);
        
        
    }
    
    type.channels.forEach(function (item) {
        var obj = getParams(item)
        array.push(obj);
        
        
        var reaward = JSON.parse(JSON.stringify(obj));
        reaward.commissionConfigType = "2";
        
        if(reaward.status=="2" && isShop){
            array.push(reaward);
        }
        
        if (obj.subsection && obj.subsection.length > 0) {
            reaward.status = "1";
            
            delete obj.subsection;
            
            
        } else {
            if (obj.payModeId == 1006 && !isShop) {
                if (obj.status == 1) {
                    reaward.subsection = _sub;
                    reaward.status = "1";
                    
                } else {
                    reaward.status = "2";
                }
            } else {
                
                if (isShop && obj.status == 1) return;
                
                reaward.status = "2"
            }
            
        }
        if (reaward.subsection && reaward.subsection.length > 0) {
            array.push(reaward);
        }
        
    });
    _sub = null;
}
/**
 * 添加套餐 时准备参数
 * @param type payType
 * @param item payChannel
 */
function getParams(item) {
    var obj = {
        commissionConfigType: "1",
        payModeId           : item.payModeId + ''
    }
    if (item) {
        obj.payChannelId = item.payChannelId + ''
    }
    if (item) {
        obj.ratio = accDiv(item.ratio || 0, 100) + ""
        obj.djkRatio = accDiv(item.djkRatio || 0, 100) + ""
    }
    if (item.cap) {
        obj.cap = accMul(item.cap, 100) + ""
    }
    obj.status = item.status == 1 ? "1" : "2";
    if (item.payModeId != 1006 && item.subsection && item.subsection.length > 0 && item.status == 1) {
        obj.subsection = item.subsection.map(function (a) {
            return {
                minSubsection: accMul(a.minSubsection, 1000000) + "",
                maxSubsection: (a.maxSubsection ? accMul(a.maxSubsection, 1000000) : MAX_AMOUNT) + "",
                ratio        : accDiv(a.ratio, 100) + ""
            }
        });
    }
    return obj;
}


function merge(target,obj){
    target = JSON.parse(JSON.stringify(target));
   for(var key in target){
        target[key]=obj[key];
   }
   return target
}