"use strict";
import React from 'react';
import {Form,Input} from 'antd';
const FormItem = Form.Item;

class UpdateBillForm extends React.Component{
    propTyps = {
        bill:React.PropTypes.object
    };
    componentWillReceiveProps(nextProps){
        if(this.props.bill !== nextProps.bill){
            this.initFieldsValue()
        }
    }
    componentDidMount(){
        this.initFieldsValue();
    }
    initFieldsValue(){
        this.props.form.setFieldsValue({remark:this.props.bill.remark});
    }
    render(){
       const {getFieldDecorator} = this.props.form;
       return <Form>
           <FormItem label='备注内容'>
               {getFieldDecorator('remark', {
               })(
                   <Input type="textarea" rows={10}/>
               )}
           </FormItem>
       </Form>
    }
}

export default Form.create()(UpdateBillForm);