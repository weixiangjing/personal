/**
 *  created by yaojun on 16/12/26
 *
 */
import React from "react";
import {setInspectorWithActiveControl,
    showAddControlBorder} from "../reducer";
import classNames from "classnames";
import {Upload, Button, Input, Icon, Alert, Checkbox, DatePicker, Radio, Select,Card} from "antd";
const Options       = Select.Option;
const RadioGroup    = Radio.Group;
const CheckboxGroup = Checkbox.Group;
export class DropControl extends React.Component {
    static disableTitle = {
        "button": 1,
        "notice": 1
    }
    static disableLabel={
        "button":1,
        "notice":1
       
    }
    
    onCreate(item) {
        return (  <Input readOnly="readonly" placeholder={item.get("placeholder")} className="ant-input" type="text"/>)
    }
    
    render() {
        let {item} = this.props;
        
        let dator= item.get("validator")
        let isRequired;
        if(dator){
            isRequired= dator.some(item=>item.get("rule")=="required");
            
        }
        return (  <div className="inline-input-group input-size-de ">
         
            {
                !DropControl.disableLabel[item.get("type")]
                    && <label className={item.get("classify")=="terminalControls"?"terminal-control":""} >{isRequired  && <span className="text-danger">*</span>}{!DropControl.disableTitle[item.get("type")] && item.get('title')}</label>
            }
            {this.onCreate(item)}
            <div  className="drop-control-desc">
                {!SortableControl.HideDesc[item.get('type')] && item.get("description")}
            </div>
            <div style={{zIndex:10,position:"absolute",width:"100%",height:"100%",background:"none",top:0}}></div>
        </div>)
    }
}
export class TextAreaControl extends DropControl {
    onCreate(item) {
        return (<Input disabled={true} type="textarea"/>);
    }
}
export class FileControl extends DropControl {
    onCreate(item) {
        return <Upload className="margin-left">
           
            <Button>
                <Icon type="upload"/>
                浏览文件
            </Button>
        </Upload>
    }
}
export class ButtonControl extends DropControl {
    onCreate(item) {
        return (<Button>{item.get('title')}</Button>)
    }
}
export class SelectControl extends DropControl {
    onCreate(item) {
        return (<Select>
            {
                item.get('options').map((item, index)=> {
                    return (<Options key={item.get("id")} value={item.get("value")}>{item.get("label")}</Options>)
                })
            }
        </Select>)
    }
}
export class NoticeControl extends DropControl {
    onCreate(item) {
        return (<Alert  description={item.get("description")} type={item.get('showAs')}/>)
    }
}
export class CheckboxControl extends DropControl {
    onCreate(item) {
        return (<Checkbox/>)
    }
}
export class CheckboxGroupControl extends DropControl {
    onCreate(item) {
        return (<CheckboxGroup options={item.get("options").toJS()}/>)
    }
}
export class DateTimeControl extends DropControl {
    onCreate(item) {
        return (<DatePicker />)
    }
}
export class RadioControl extends DropControl {
    onCreate(item) {
        return (
            <RadioGroup>
                {
                    item.get("options").map((item, index)=> {
                        return (<Radio value={item.get("value")}>{item.get("label")}</Radio>);
                    })
                }
            </RadioGroup>
        )
    }
}
export class EmptyControl extends DropControl {
    onCreate(item) {
        return (<div style={{color: "red"}}>暂不支持的预制组件:{item.get('type')}</div>)
    }
}
export class SortableControl extends React.Component {
    static ControlTypes = {
        text    : DropControl,
        textarea: TextAreaControl,
        radio   : RadioControl,
        checkbox: CheckboxGroupControl,
        select  : SelectControl,
        button  : ButtonControl,
        file    : FileControl,
        datetime: DateTimeControl,
        notice  : NoticeControl
    }
    static HideDesc     = {
        'notice': 1
    }
    
   
    createControl(type, item) {
        let Control = SortableControl.ControlTypes[type] || EmptyControl;
        return <Control item={item}/>
    }
    

    render() {
        let {item, onIndex, type} =this.props;
        return (
            <li  id={`drop-control-item-${onIndex}`}  className={classNames(["padding","drop-control-clone",{"drop-control-item-active":item.get("active")}])}>
                
                {this.createControl(item.get('type'), item)}
                
               <div className="arrow-left"></div>
               
            </li>
        )
    }
}
