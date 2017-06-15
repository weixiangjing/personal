/**
 *  created by yaojun on 2017/5/19
 *
 */

import React from "react";
import {SelectBase} from "./base";
import {getPayMode} from "../../model/PayChannel";


export default class Component extends  SelectBase{
   getOptions(){
       let all =this.props.defaultAll;
       getPayMode({status:1}).then(data=>{
           let options =data.map(item=>({label:item.pay_mode_name,value:item.pay_mode_id}))
           this.setState({options:all?[{label:"不限",value:""}].concat(options):options});
       });
       return [];
   }
}