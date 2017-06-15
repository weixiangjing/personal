/**
 *  created by yaojun on 16/12/14
 *
 */
  


import React from "react";
import {Form,Input} from "antd";

const FormItem = Form.Item;
export default class InputControl extends  React.Component{
    render(){
        
        let {extra,rows,style,className,before,after,label,layout,getFieldDecorator,name,initialValue,rules,placeholder,type,onChange} = this.props;
        
        var opts ={};
        
        if(rules){
            opts.rules=rules;
        }
        if(initialValue){
            opts.initialValue=initialValue;
        }
        
        var props = {};
        
        if(placeholder){
            props.placeholder=placeholder;
        }
        if(onChange){
            props.onChange=onChange;
        }
        if(style){
            props.style=style;
        }
        if(type){
            props.type=type;
        }
       if(rows){
            props.rows=rows;
       }
        var itemProps ={};
        if(extra){
            itemProps.extra=extra
        }
        if(layout){
            itemProps=layout;
        }
        if(label){
            itemProps.label=label;
        }
        if(className){
            itemProps.className=className;
        }
       
        return (<FormItem  {...itemProps} >
            {before}
            {
                getFieldDecorator(name,opts)(
                    <Input {...props} />
                )
            }
            {after}
        </FormItem>);
    }
}