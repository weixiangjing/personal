"use strict";
import React from 'react';
import {Form,Row,Col,Button,Checkbox,Input,Modal} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
import PaymentCascader from '../../../../../components/PaymentCascader';
const reducer = require('../reducer');

export default Form.create()(React.createClass({
    getInitialState(){
        return {
            selectedChannel:null
        }
    },
    componentDidMount(){
        this.props.form.setFieldsValue(reducer.getFormData());
    },
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(err)return;
            values.mcodes = values.mcodes.split(/\n/).join(',');
            values.configItems = values.configItems.sort();
            values.payment[2] = this.state.selectedChannel;
            console.log(values)
            reducer.storeFormData(values);
            reducer.nextStep();
        })
    },
    onPaymentLoaded(){
        const lastDate = reducer.getFormData();
        if(!lastDate || !lastDate.payment)return;
        this.props.form.setFieldsValue({payment:lastDate.payment})
    },
    onPaymentChange(payment){
        const defaultConfigItems = reducer.initialState().get('configItems');
        this.props.form.setFieldsValue({configItems:defaultConfigItems.toJS()});
        this.props.form.resetFields(['configItems']);
        reducer.setConfigItems(defaultConfigItems);
        if(!payment || payment.length<2)return;
        reducer.setBusy(true);
        reducer.getChannel({//获取详情信息
            pay_mode_id:payment[0],
            pay_channel_id:payment[1],
            ascOrDesc:1
        }).then(channel=>{
            this.setState({selectedChannel:channel});
            const isMix = channel.operation_mode == 3;
            reducer.getBzAblity(channel.pay_channel_id).then(res=>{
                if(checkHasParams(channel))reducer.setConfigItemVisible(2,false);
                if(res.total<=0)reducer.setConfigItemVisible(3,false);
                if(!isMix)reducer.setConfigItemVisible(4,false);
            },err=>{
                Modal.error({
                    content:err.message
                });
            }).finally(()=>{
                reducer.setBusy(false);
            })
        },err=>{
            Modal.error({
                content:err.message
            });
            reducer.setBusy(false);
        });
        function checkHasParams(channel) {
            if(!channel || !channel.pay_channel_terminal_params)return false;
            let params = window.JSON.parse(channel.pay_channel_terminal_params);
            return !!(params && params.length);
        }
    },
    render(){
        let {getFieldDecorator} = this.props.form;
        let configCheckBoxOptions = reducer.state.get('configItems').toJS();
        configCheckBoxOptions = configCheckBoxOptions.filter(item=>item.visible!==false);
        return (<Form horizontal className="step step1" onSubmit={this.handleSubmit}>
            <Row>
                <Col span={9}>
                    <div className="ant-form-item-wrapper">
                        <FormItem labelCol={{span: 8}} wrapperCol={{ span: 14 }} label='选择支付通道'>
                            {getFieldDecorator('payment', {
                                rules:[{required:true,message:'请选择支付通道'}]
                            })(
                                <PaymentCascader onload={this.onPaymentLoaded} onChange={this.onPaymentChange} params={{status:1}} placeholder="选择支付通道"/>
                            )}
                        </FormItem>
                    </div>
                    <div className="ant-form-item-wrapper config-check">
                        <FormItem labelCol={{span: 8}} wrapperCol={{ span: 14 }} label='选择配置内容'>
                            {getFieldDecorator('configItems', {
                                rules:[{required:true,message:'请选择配置项'}]
                            })(
                                <CheckboxGroup options={configCheckBoxOptions}/>
                            )}
                        </FormItem>
                    </div>
                </Col>
                <Col span={15}>
                    <FormItem label='批量设置门店的MCODE'>
                        {getFieldDecorator('mcodes', {
                            rules:[{required:true,message:'请填写门店MCODE'}]
                        })(
                            <Input rows={12} placeholder='注意：每个MCODE单独占一行' style={{width:360}} type='textarea'/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <div className="footer text-center">
                <Button htmlType='submit' type='primary'>下一步</Button>
            </div>
        </Form>)
    }
}))