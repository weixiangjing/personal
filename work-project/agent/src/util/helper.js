/**
 *  created by yaojun on 17/1/4
 *
 */
  


    
import React from 'react';
import {notification} from "antd";


export function showMessage(message){
    notification.info({
        message:"提示",
        description:message
        
    })
}
export function showError(error){
    notification.error({
        message:"错误",
        description:error,
        duration:8
    })
}

export function amountFormat(num){
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
    return (((sign)?'':'-') + num + '.' + cents);
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

export function paginationOptions(total,pageSize=20,size="small",showQuickJumper=true,showSizeChanger=true){
    return {total,pageSize,showQuickJumper,showTotal:(total)=>`共搜索到${total}条结果`,showSizeChanger,size}
}


/**
 *  helper  浮点数精确计算
 * @param arg1
 * @param arg2
 * @returns {number}
 */

function getFloatLen(num){
    var f = (num+"").split(".")[1];
    return f?f.length:0;
}
export function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    var _s1 =s1.split(".")[1];
    
    if(_s1){
        m+=_s1.length;
    }
    _s1=s2.split('.')[1];
    if(_s1){
        m+=_s1.length;
    }
    
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}

export function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    t1=getFloatLen(arg1);
    t2=getFloatLen(arg2);
    
    
    r1=Number(arg1.toString().replace(".",""))
    r2=Number(arg2.toString().replace(".",""))
    return accMul(r1/r2,Math.pow(10,t2-t1));
    
}

export function accSub(arg1,arg2){
    return accAdd(arg1,-arg2);
}
export function accAdd(arg1,arg2){
    var r1,r2,m;
    r1=getFloatLen(arg1);
    r2=getFloatLen(arg2)
    
    m=Math.pow(10,Math.max(r1,r2))
    return (arg1*m+arg2*m)/m
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
export function isEmptyObject(e) {
    for (var t in e)
        return !1;
    return !0
}
