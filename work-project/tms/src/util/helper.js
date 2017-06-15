/**
 *  created by yaojun on 17/1/4
 *
 */
  


    
import React from 'react';
import {message} from "antd";
export function amountFormat(num){
    if(!num) return "0";
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
   let  sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    let cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
        cents = "0" + cents;
    for (let i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+','+
            num.substring(num.length-(4*i+3));
    let result =(((sign)?'':'-') + num + '.' + cents);
    return result=="0.00"?"0":result ;
}
export function numberFormat(num){
    return amountFormat(num).split('.')[0];
}
/**
 *
 * @param num
 * @returns {*}
 */
export function amountRound(num){
        if(num>1000000){
            numberFormat(num);
        }
    return amountFormat(num);
}

export function cleanEmpty(send){
    let result={}
    for( let key in send){
        if(send[key]!==undefined&&send[key]!==""){
            result[key]=send[key];
        }
    }
    return result;
}

export function paginationOptions(total, pageSize = 20, size = "small", showQuickJumper = true, showSizeChanger = true,pageSizeOptions,pageNum) {
    let obj ={total, pageSize, showQuickJumper, showSizeChanger, size}
    if(pageSizeOptions){
        obj.pageSizeOptions=pageSizeOptions;
    }
    if(typeof pageNum !=="undefined"){
        obj.current=pageNum;
    }
    return obj;
}
export function unique(arr) {
  arr.sort(); //先排序
  let res = [arr[0]];
  for(let i = 1; i < arr.length; i++){
    if(arr[i] !== res[res.length - 1]){
      res.push(arr[i]);
    }
  }
  return res;
}
export function in_array(arr,str) {
  for(let i=0;i<arr.length;i++){
    if(String(arr[i]).indexOf(str) != -1)
      return true;
  }
  return false;
}
let modalDestroy;
export function showTaskModal(type){
    message.success("操作成功");
    document.body.scrollTop=0;
    window.__header.showTaskTips();
    
}
