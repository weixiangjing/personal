/**
 *  created by yaojun on 16/12/22
 *
 */
import React from "react";
import {Form, Button} from "antd";
import InspectorGenerator from "./inspector.generate"
import {updateControlWithKeys, deleteControlFromDisplay,
    updateInspectorOptionsAndDropControl} from "../reducer";
export default Form.create()(React.createClass({
    render(){
        let type = this.props.type;
        
        if (!type) return null;
        let {getFieldDecorator} =this.props.form;
        
        
        return (<Form className="controls-inspector">
            
            
            <InspectorGenerator control={this.props.control} getFieldDecorator={getFieldDecorator}/>
            
            <Button onClick={()=> {
                let {index,classify} = this.props;
                deleteControlFromDisplay(index,classify)
            }} type={"danger"} className={"margin-top"}>
                删除控件
            </Button>
        
        
        </Form> );
    }
}))