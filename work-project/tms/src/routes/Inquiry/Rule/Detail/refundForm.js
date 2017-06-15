/**
 *  created by yaojun on 17/1/10
 *
 */
  


   
import React from "react";
import {Form,Input,DatePicker,InputNumber,Modal} from "antd";
const FormItem =Form.Item;
export default Form.create()(React.createClass({
    tradeRefund(){
        
    },
    render(){
        let parent =this.props.parent;
        
        let {getFieldDecorator,validateFields} =this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return ( <Modal visible={parent.state.refundVisible}
                        title={"手工退款"}
                        onCancel={()=>parent.setState({refundVisible:false})}
        >
            <Form>
                <FormItem {...formItemLayout} label={"退款时间"}>
                    {
                        getFieldDecorator("a",{
                            rules:[{required:true,message:"退款时间必填"}]
                        })(<DatePicker/>)
                    }
                </FormItem>
                <FormItem {...formItemLayout}  label={"退款说明"}>
                    {
                        getFieldDecorator("b",{
                        rules:[{required:true,message:"退款说明必填"}]
                    })(<Input type="textarea"/>)
                    }
                </FormItem>
                <FormItem {...formItemLayout}  label={"退款金额"}>
                    {
                        getFieldDecorator("c",{
                        rules:[{required:true,message:"退款金额必填"}]
                    })(<InputNumber/>)
                    }
                </FormItem>

            </Form>
        </Modal>)
    }
}));