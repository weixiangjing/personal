import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    account:[{}],
    fwq_statistics:[{}],
    loading:true
  });
}
export const getList=(params)=>{
  axios.post('openApi/serviceAccount/get',params).then((res)=>{
    const state=exports.state;
    handler.$update(state.set('account',Immutable.List(res.data)).set('loading',false))
  })
};//账户列表
export const getFwS=(params)=>{
  axios.post('openApi/serviceAccount/getAccountPandect',params).then((res)=>{
    const state=exports.state;
    handler.$update(state.set('fwq_statistics',Immutable.List(res.data)))
  })
};//账户统计
export const getDate=(date)=>{
  let newDate=new Date(date);
  let dateYear = newDate.getFullYear(newDate);
  let dateMonth = newDate.getMonth(newDate) + 1;
  let dateDate,endDate;
  if(dateYear%4==0&&dateMonth==2){dateDate=29;}
  else if(dateMonth==2){dateDate=28}
  else if(dateMonth<8){dateDate=dateMonth%2==0?30:31}
  else if(dateMonth>7){dateDate=dateMonth%2==0?31:30}
  dateMonth = dateMonth < 10 ? "0" + dateMonth : dateMonth;
  dateDate = dateDate < 10 ? "0" + dateDate : dateDate;
  endDate= dateYear + "-" + dateMonth + "-" + dateDate + " 23:59:59";
  return endDate
}
