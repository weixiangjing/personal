/**
 *  created by yaojun on 16/12/23
 *
 */
import React from "react";
import {Radio, Icon, Select, Card,Button} from "antd";
import className from "classnames";
import {updateInspectorOptionsAndDropControl, updateControlWithKeys} from "../reducer";
import Immutable from "immutable";
const RadioGroup = Radio.Group;
const onFieldsChange                 = (key, value, index) => {
    updateInspectorOptionsAndDropControl(index, value, key)
}
export const NormalControl           = ({control, label, name, getFieldDecorator}) => {
    return (
        <div className="inline-input-group input-size-de margin-bottom">
            
            <label>{label}</label>
            <input className="ant-input" value={control.get(name)} onChange={({target}) => {
                onFieldsChange(name, target.value, control.get("index"))
            }}/>
        </div>
    )
}
export const TextareaControl           = ({control, label, name, getFieldDecorator}) => {
    return (
        <div className="inline-input-group input-size-de margin-bottom">
            
            <label>{label}</label>
            <textarea  className="ant-input" value={control.get(name)} onChange={({target}) => {
                onFieldsChange(name, target.value, control.get("index"))
            }}/>
        </div>
    )
}
export const RadioControlWithYesOrNo = ({label, name, getFieldDecorator, control}) => {
    return (
        
        <div className="inline-input-group input-size-de margin-bottom">
            <label>{label}</label>
            
            <RadioGroup onChange={({target}) => {
                onFieldsChange(name, target.value, control.get("index"))
            }} value={control.get(name)}>
                <Radio key="1" value={1}>是</Radio>
                <Radio key="2" value={0}>否</Radio>
            </RadioGroup>
        </div>
    );
}
export const ArrayControl            = ({label, name, control}) => {
    let value = control.get(name);
    value     = value ? value.split(",") : '';
    return (
        <div className="inline-input-group input-size-de margin-bottom">
            <label>{label}</label>
            <input onChange={({target}) => {
                onFieldsChange(name, target.value, control.get("index"))
            }} value={value} placeholder="多个使用逗号分隔"/>
        </div>
    )
}
export class SelectControl extends React.Component {
    /**
     * @protected
     * @type {string}
     */
    onCreateOption(name, value, index) {
        return (
            <Select value={value} onChange={(value) => {
                onFieldsChange(name, value, index)
            }}>
                <Select.Option value={"success"}>tips</Select.Option>
                <Select.Option value={"info"}>info</Select.Option>
                <Select.Option value={"warning"}>warning</Select.Option>
            </Select>
        )
    }
    
    render() {
        let {label, name, getFieldDecorator, control} =this.props;
        return (
            <div className="inline-input-group input-size-de margin-bottom">
                <label>{label}</label>
                { this.onCreateOption(name, control.get(name), control.get('index'))}
            </div>
        )
    }
}
// RadioGroup CheckboxGroup SelectOptions
export class OptionsControl extends React.Component {
    key = "options";
    
    addOption(type) {
        let options = this.props.control.get(this.key);
        options     = options.push(Immutable.Map(this.getDefaultItem(type)))
        this.setOptions(options);
    }
    
    setOptions(options) {
        updateInspectorOptionsAndDropControl(this.props.control.get("index"), options, this.key);
    }
    
    deleteOption(index) {
        let options = this.props.control.get(this.key);
        options     = options.delete(index);
        this.setOptions(options);
    }
    
    updateIn(key, value) {
        let options = this.props.control.get(this.key);
        let state   = options.updateIn(key, prop => {
            return value
        });
        onFieldsChange(this.key, state, this.props.control.get("index"))
    }
    
    /**
     * @protected
     * @returns {{label: string, value: string, id: number}}
     */
    getDefaultItem() {
        return {label: "", value: "", id: Math.random()}
    }
    
    /**
     * @protected
     * @param item
     * @param index
     * @returns {XML}
     */
    onCreateRows(control, name) {
        return (
            
            <div>
                {
                    control.get(this.key).map((item, index) => {
                        return (<div
                            className={className(["margin-bottom", "options-group-cols", {"border-top": index > 0}])}
                            key={item.get('id')}>
                            
                            <div className="margin-bottom">
                                <label className="inline-block" style={{width: 30}}> 字段名称: </label><input
                                onChange={({target}) => {
                                    this.updateIn([index, "label"], target.value)
                                }} value={item.get("label")} style={{width: 200}} className={"ant-input  "}
                            />
                                {
                                  <Icon className="text-gray hover-scale delete-col-icon"
                                                       onClick={() => this.deleteOption(index)} type="close-circle"/>
                                    
                                }
                            </div>
                            
                            <div>
                                <label className="inline-block" style={{width: 30}}> 字段值: </label><input
                                onChange={({target}) => {
                                    this.updateIn([index, "value"], target.value)
                                }} value={item.get("value")} style={{width: 200}} className={" ant-input "}
                            />
                            </div>
                        
                        </div>)
                    })
                }
            
            </div>
        )
    }
    
    getExtraContent(){
        return ( <Icon className="hover-scale text-success" onClick={() => this.addOption()} type="plus"/>)
    }
    render() {
        let {label, name, getFieldDecorator, control} = this.props;
        return (
            <Card extra={ this.getExtraContent() }
                  title={label} className="inline-input-group  margin-bottom">
                
                
                {
                    this.onCreateRows(control, name)
                    
                }
            </Card>
        )
    }
}
export class OptionColsControl extends OptionsControl {
    key = "validator";
    
    getDefaultItem(rule="") {
        return {rule: rule, value: "", message: "", id: Math.random()}
    }
    

    getExtraContent(){
        return (<div>
            <Button onClick={()=>{this.addOption('required')}} size="small" >+ 必选</Button>
            <Button onClick={()=>{this.addOption('pattern')}} size="small" className="margin-left">+ 正则</Button>
        </div>)
    }
    static Lang={
        pattern:"正则",
        error:"错误提示",
        required:"是否必填"
        
    }
    onCreateRows(control, name) {
        return (
            <div>
                {
                    control.get(this.key).map((item, index) => {
                        return (<div key={index}
                                     className={className(['margin-bottom ', 'options-group-cols', {'border-top': index > 0}])}>
                           
                            <div className="margin-bottom inline-input-group input-size-de">
                                <label className="option-label"> {OptionColsControl.Lang[item.get("rule")]} </label>
                                
                                {
                                   item.get("rule")==="required"?
                                        <RadioGroup value={item.get("value")} onChange={({target})=>{
                                            console.log(target.value);
                                            this.updateIn([index,'value'],target.value);
                                        }}>
                                            <Radio value={true}>是</Radio>
                                            <Radio value={false}>否</Radio>
                                        </RadioGroup>
                                        :  <input onChange={({target}) => {
                                            this.updateIn([index, 'value'], target.value);
                                        }} value={item.get("value")} className={"ant-input inline margin-right "}
                                        />
                                }
                              
                                {
                                     <Icon className="text-gray hover-scale delete-col-icon"
                                                       onClick={() => this.deleteOption(index)} type="close-circle"/>
        
                                }
                            </div>
                            <p className="inline-input-group input-size-de">
                                <label className="option-label"> 错误提示 </label><textarea onChange={({target}) => {
                                this.updateIn([index, 'message'], target.value);
                            }} value={item.get("message")} className={"ant-input inline margin-right "}
                            
                            />
                            
                            </p>
                        
                        </div>);
                    })
                }
            
            </div>
        
        )
    }
}
