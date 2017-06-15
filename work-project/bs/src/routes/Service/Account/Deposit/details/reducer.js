import axios from 'axios';
import {notification} from 'antd';
import moment from "moment";

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    list:[{}],
    loading:false
  });
}
export const getList=(params)=>{
  axios.post("openApi/serviceAccount/getOrders",params).then((res)=>{
    handler.$update(exports.state.set('list',Immutable.List(res.data)).set('loading',true))
  })
}
