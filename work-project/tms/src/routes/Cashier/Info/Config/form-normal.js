/**
 *  created by yaojun on 16/12/15
 *
 */
import React from "react";
import {Form, Input, Select, Radio, Row,Col,DatePicker} from "antd";
import {submit, saveForm,handler} from "./reducer";
import ProviderSelect from "../../../../components/Select/provider";
import PaymentSelect from "../../../../components/Select/payment";

const FormItem=Form.Item;
const ChannelForm=Form.create({
    onFieldsChange:()=>{
        handler.$update("isDirty",true);
    }
    
})(React.createClass({
    componentWillMount(){
        saveForm("normal", this.props.form);
    },
    render(){
        let {getFieldDecorator, getFieldsValue, validateFields,getFieldValue} =this.props.form;
        const formItemLayout={
            labelCol: {span: 2},
            wrapperCol: {span: 8},
        };
        let {info, types, providers, id, loading, payModeId} =this.props;
        return (
            <Form>
                
                <FormItem {...formItemLayout} label={"通道编号"}>
                    {
                        getFieldDecorator('pay_channel_id', {
                            initialValue: String(info.get('pay_channel_id')||''),
                            rules: [{
                                required: true, message: "输入通道唯一编号,4位数字",
                            }, {
                                pattern: /^[1-9]\d{3}$/, message: "必须是4位数字"
                            }]
                        })(<Input disabled={!!id} type="text" placeholder="输入通道唯一编号,4位数字"/>)
                    }
                </FormItem>
                
                <FormItem {...formItemLayout} label={"通道名称"}>
                    {
                        getFieldDecorator('pay_channel_name', {
                            initialValue: info.get('pay_channel_name'),
                            rules: [{
                                required: true, message: "输入通道名称",
                            }]
                        })(<Input type="text" placeholder="请输入通道名称"/>)
                    }
                </FormItem>
                
                <FormItem {...formItemLayout} label={"支付方式"}>
                    {
                        getFieldDecorator('pay_mode_id', {
                            initialValue: payModeId||String(info.get("pay_mode_id")||""),
                            rules: [{
                                required: true, message: "请选择支付方式",
                            }]
                        })(<PaymentSelect />)
                    }
                </FormItem>
                
                
                <FormItem {...formItemLayout} label={"通道提供方"}>
                    {
                        getFieldDecorator('pay_sp_id', {
                            initialValue: String(info.get("pay_sp_id")||''),
                            rules: [{
                                required: true, message: "输入通道提供方",
                            }]
                        })(<ProviderSelect/>)
                    }
                </FormItem>
                
                
                <div className="channel-status-group">
                    <FormItem  label={"通道状态"}>
                        {
                            getFieldDecorator('status', {
                                initialValue: info.get("status")||1,
                                rules: [{required: true, message: "请选择通道状态"}]
                            })(<Radio.Group >
                                <Radio value={2}>已关闭</Radio>
                                <Radio value={3}>研发中</Radio>
                                <Radio value={4}>待商用</Radio>
                                <Radio value={1}>已商用</Radio>
                            </Radio.Group>)
                        }
                    </FormItem>
                  
                    {
                        getFieldValue("status")==1 &&<FormItem>
                            {
                                getFieldDecorator("used_time")(<DatePicker/>)
                            }
                        </FormItem>
                    }
                        
                   
                </div>
                <FormItem  {...formItemLayout} label={"通道运营类型"}>
                    {
                        getFieldDecorator('operation_mode', {
                            initialValue: info.get("operation_mode"),
                            rules: [{required: true, message: "请选择通道运营类型"}]
                        })(<Radio.Group >
                            <Radio value={1}>自营</Radio>
                            <Radio value={2}>非自营</Radio>
                            <Radio value={3}>混合型</Radio>
                        
                        </Radio.Group>)
                    }
                </FormItem>
                <FormItem {...formItemLayout} label={"通道交易查询网址"}>
                    {
                        getFieldDecorator('trade_query_url', {
                            initialValue: info.get("trade_query_url"),
                        })(<Input type="text" placeholder="如通道提供了交易查询的专用地址，请填写"/>)
                    }
                </FormItem>
                
                <div className="margin-top-lg new-form-group">
                    <FormItem  {...formItemLayout} label={"通道连接方式"}>
                        {
                            getFieldDecorator('link_type', {
                                initialValue: info.get("link_type"),
                                rules: [{required: true, message: "请选择通道连接方式"}]
                            })(<Radio.Group >
                                <Radio value={1}>直联</Radio>
                                <Radio value={2}>间联</Radio>
                                
                            </Radio.Group>)
                        }
                    </FormItem>
                    <FormItem labelCol={{span:2}} wrapperCol={{span:20}} label={"密钥灌装方式"}>
                        {
                            getFieldDecorator('key_fill_method', {
                                initialValue: info.get("key_fill_method"),
                                rules: [{required: true, message: "请选择密钥灌装方式"}]
                            })(<Radio.Group >
                                <Radio value={1}>无密钥</Radio>
                                <Radio value={2}>远程拉取</Radio>
                                <Radio value={3}>远程推送</Radio>
                                <Radio value={4}>串口线灌装</Radio>
                                <Radio value={5}>IC卡灌装</Radio>
                            </Radio.Group>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label={"商务负责人"}>
                        {
                            getFieldDecorator('business_manager', {
                                initialValue: info.get('business_manager')
                            })(<Input type="text" placeholder="请输入通道名称"/>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label={"技术负责部门"}>
                        {
                            getFieldDecorator('technical_department', {
                                initialValue: info.get('technical_department')
                            })(<Input type="text"/>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label={"开发负责人"}>
                        {
                            getFieldDecorator('develop_manager', {
                                initialValue: info.get('develop_manager')
                            })(<Input type="text"/>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label={"通道用途"}>
                        {
                            getFieldDecorator('description', {
                                initialValue: info.get('description')
                            })(<Input type="textarea" rows={10} />)
                        }
                    </FormItem>


                </div>
            
            
            </Form>)
    }
}))
export default (props)=> {
    return (<ChannelForm {...props}/>)
}