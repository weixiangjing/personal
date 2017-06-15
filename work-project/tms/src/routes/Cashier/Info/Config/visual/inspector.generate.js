/**
 *  created by yaojun on 16/12/23
 *
 */
import {ControlMap,Lang} from "./inspector.control.config";
import React from "react";
export default ({control, getFieldDecorator})=> {
   
    let controls = Object.keys(control.toObject()).sort().map((key)=> {
        let Control = ControlMap[key];
        
        if (Control)
            return <div>
                <Control  control={control} name={key} label={Lang[key]}/>
                </div>
        return null;
    }).filter(item=>item);
    return (<div>{controls}</div>);
}