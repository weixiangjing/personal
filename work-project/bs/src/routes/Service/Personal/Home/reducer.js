import axios from 'axios';
import {notification} from "antd";
const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
    return Immutable.fromJS({
      latelypay:[],
      expiring:[],
      invalid_order_num:0,
      product_num:0,
      unitEn:0,
      unitMcode:0,
      due_to_num:0,
      res_date:''
    });
}
export const getOrderedService=(params)=>{
  axios.post('openApi/purchasedService/getList',{...params,is_latelypay:1,pageSize:10}).then((res)=>{
    const date=res.date.format("YYYY-MM-DD HH:mm:ss");
    handler.$update(exports.state.set('latelypay',Immutable.List(res.data)).set('res_date',date))
  }).catch((err)=>{
    notification.error({message:err.message})
  })
}//最近订购
export const getOrderingService=(params)=>{
  axios.post('openApi/purchasedService/getList',{...params,is_get_expiring:1,pageSize:10}).then((res)=>{
    const date=res.date.format("YYYY-MM-DD HH:mm:ss");
    handler.$update(exports.state.set('expiring',Immutable.List(res.data)).set('res_date',date))
  }).catch((err)=>{
    notification.error({message:err.message})
  })
}//即将到期
export const getService=(params)=>{
  axios.post('openApi/purchasedService/getOrderedService',params).then((res)=>{
    const date=res.date.format("YYYY-MM-DD HH:mm:ss");
    let order_num=res.data.length?res.data[0].invalid_order_num:0;
    handler.$update(exports.state.set('invalid_order_num',order_num).set('res_date',date))
  }).catch((err)=>{
    notification.error({message:err.message})
  })
}//待付款产品--全部产品
export const getUnit=(params)=>{
  axios.post('openApi/purchasedService/getOrderingService',{...params,pageSize:9999}).then((res)=>{
    let unitEn=0;
    let unitMcode=0;
    const date=res.date.format("YYYY-MM-DD HH:mm:ss");
    res.data.map((item)=>{
      if(item.unit_count){
        item.unit_count.map((text)=>{
          if(text.unit_type==2){if(text.unit_num)unitMcode+=text.unit_num;}//门店数
          if(text.unit_type==3){if(text.unit_num)unitEn+=text.unit_num;}//设备数
        })
      }
    })
    let product_num=res.data.length?res.data[0].produce_num:0;
    handler.$update(exports.state.set('unitMcode',unitMcode)
      .set('unitEn',unitEn).set('product_num',product_num)
      .set('res_date',date))
  }).catch((err)=>{
    notification.error({message:err.message})
  })
}//计费单元
export const getDueTo=(params)=>{
  axios.post('openApi/purchasedService/getOrderingService',{...params,is_get_expiring:1}).then((res)=>{
    const date=res.date.format("YYYY-MM-DD HH:mm:ss");
    let num=res.data.length?res.data[0].produce_num:0
    handler.$update(exports.state.set('due_to_num',num).set('res_date',date))
  }).catch((err)=>{
    notification.error({message:err.message})
  })
}
