/**
 *  created by yaojun on 2017/6/6
 *
 */

import React from "react";
import {CascaderBase} from "./base";
import axios from "axios";
export default class Component extends CascaderBase {
    
    getOptions(){
        axios.get("basic/classify")
            .then(res=>{
                let options =[]
             
            this.convertOptions(res,options);
                this.setState({options})
        })
    }
    convertOptions(options,result){
        options.forEach((item)=>{
            let option={label:item.name,value:item.mccCode||item.id}
            if(item.childClassify && item.childClassify.length>0){
                    option.children=[];
                this.convertOptions(item.childClassify,option.children)
            }
            result.push(option);
        })
    }
}


