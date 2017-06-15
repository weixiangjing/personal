import React from "react";
export function unique(arr) {
    arr.sort(); //先排序
    let res = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== res[res.length - 1]) {
            res.push(arr[i]);
        }
    }
    return res;
}
export function cleanEmpty(send) {
  let result = {}
  for (let key in send) {
    if (send[key] !== undefined && send[key] !== "") {
      result[key] = send[key];
    }
  }
  return result;
}
export function paginationOptions(total, pageSize = 20, size = "small", showQuickJumper = true, showSizeChanger = true,pageSizeOptions,current) {
  let obj ={total, pageSize, showQuickJumper, showSizeChanger, size}
  if(pageSizeOptions){
    obj.pageSizeOptions=pageSizeOptions;
  }
  if(typeof current !=="undefined"){
    obj.current=current;
  }
  return obj;
}

export const clone = (obj)=>{
    if(typeof obj !== 'object')return obj;
    return JSON.parse(JSON.stringify(obj));
};

export const removeEmptyProperty = (obj) => {
    for(let key in obj){
        let val = obj[key];
        if(null==val || ''===val)delete obj[key];
    }
    return obj;
};