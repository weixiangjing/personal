/**
 *  created by yaojun on 2017/3/8
 *
 */



import axios from "axios";
import {cleanEmpty} from "../util/helper"

export const getService=(param={})=>{
    if(!param.pageSize){
        param.pageSize=2
    }
    
    return axios.post("openApi/service/get",cleanEmpty(param))
}


export const getProduct=(body)=>{
    return axios.post("openApi/serviceProduct/get",cleanEmpty(body))
}

