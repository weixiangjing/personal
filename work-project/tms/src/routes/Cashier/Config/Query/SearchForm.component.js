"use strict";
import React from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker, Icon, notification,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
import PaymentCascader from '../../../../components/PaymentCascader';
import {cleanEmpty,showTaskModal} from '../../../../util/helper';
import {ChannelStatusValues} from '../../../../model/PayChannel';
const moment = require('moment');
const reducer = require('./reducer');

export default Form.create()(React.createClass({
    getInitialState:function() {
        return {expand: false};
    },
    handleSubmit(e) {
        if(e)e.preventDefault();
        this.submit();
    },
    exportFile(){
        this.submit({export:1});
    },
    componentDidMount(){
        this.props.form.setFieldsValue(reducer.state.formData);
    },
    submit(params){
        if(!params)params = {};
        this.props.form.validateFields((err, fieldsValue) => {
            if(err)return;
            reducer.cacheFormData(fieldsValue);
            if(_checkCountValues(fieldsValue,['channel'])<1)return notification.warn({
                icon: <Icon type="frown" style={{ color: '#fa0' }} />,
                message: '超负荷了',
                description: <span>哎呀！信息量太大啦，系统很累的，再增加一些条件可以加快检索速度哦<Icon type="heart" className="text-danger gutter-left"/></span>
            });
            this.setState({pending:true});
            let data = Object.assign(this.transferForm(fieldsValue),params);
            reducer.search(data).then(()=>{
                if(params.export === 1){
                   showTaskModal();
                }
            },err=>{
                notification.error({
                    message: '操作失败',
                    description: err.message
                })
            }).finally(()=>{
                this.setState({pending:false});
            });
        });

        function _checkCountValues(fields,ignore) {
            const keys = Object.keys(fields);
            let count = 0;
            for(let i =0;i<keys.length;i++){
                let key = keys[i],item = fields[key];
                if(ignore&&ignore.indexOf(key)!=-1)continue;
                if ('' != item && null != item) count++;
            }
            return count;
        }
    },
    transferForm(originParams){
        const params = originParams?JSON.parse(JSON.stringify(originParams)):{};
        let channel = params.channel;
        if(channel && channel.length>=2){
            params.pay_mode_id = channel[0];
            params.pay_channel_id = channel[1];
        }
        let last_update = params.last_update;
        if(last_update && last_update.length>=2){
            params.update_time_begin = moment(last_update[0]).format('YYYY-MM-DD 00:00:00');
            params.update_time_end = moment(last_update[1]).format('YYYY-MM-DD 23:59:59');
        }
        delete (params.channel);
        delete (params.last_update);
        return cleanEmpty(params);
    },
    handleReset(){
        reducer.reset(true);
        this.props.form.resetFields();
    },
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {labelCol: {span: 8},wrapperCol: {span: 16}};
        const gridSpan = {span:8};
        const formRows = [
            <Row gutter={5} key="1">
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="支付通道">
                        {getFieldDecorator('channel', {
                            rules:[{required:true,message:'必须选择支付通道'}]
                        })(
                            <PaymentCascader placeholder="请选择" params={{status:1}}/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="通道状态">
                        {getFieldDecorator('status', {
                            initialValue:''
                        })(
                            <Select placeholder="请选择">
                                <Option value=''>所有</Option>
                                {ChannelStatusValues.map(item=>{
                                    return <Option key={item.value} value={String(item.value)}>{item.label}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="最后更新时间">
                        {getFieldDecorator('last_update', {
                        })(
                            <RangePicker/>
                        )}
                    </FormItem>
                </Col>
            </Row>,
            <Row gutter={5} key="2">
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="设备EN号">
                        {getFieldDecorator('device_en', {
                        })(
                            <Input maxLength="10"/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="(通道)商户号">
                        {getFieldDecorator('merchantNo', {
                        })(
                            <Input maxLength="30"/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="(通道)终端号">
                        {getFieldDecorator('terminalNo', {
                        })(
                            <Input maxLength="50"/>
                        )}
                    </FormItem>
                </Col>
            </Row>,
            <Row gutter={5} key="3">
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="应用ID">
                        {getFieldDecorator('appId', {
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="(通道)子商户号">
                        {getFieldDecorator('subMerchantNo', {
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="服务商标识">
                        {getFieldDecorator('agentId', {
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Col>
            </Row>,
            <Row gutter={5} key="4">
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="外部门店ID">
                        {getFieldDecorator('shopId', {
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="应用授权令牌">
                        {getFieldDecorator('appAuthToken', {
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="(终端)授权码/验证码">
                        {getFieldDecorator('otherTerminalNo', {
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Col>
            </Row>
        ];
        const shownRows = this.state.expand ? formRows.length : 2;
        const pending = reducer.state.get('pending');
        return (
            <Form horizontal id="search-form" className="ant-advanced-search-form form" onSubmit={this.handleSubmit}>
                <div className="formFields">
                    {formRows.slice(0, shownRows)}
                </div>
                <Row gutter={5} className='form-action'>
                    <Col {...gridSpan}>
                        <Row>
                            <Col span={formItemLayout.labelCol.span}/>
                            <Col span={formItemLayout.wrapperCol.span}>
                                <Button type="primary" id="submit-btn" htmlType="submit" loading={pending}>搜索</Button>
                                <Button onClick={this.handleReset} className="gutter-left">清除</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...gridSpan}>
                    </Col>
                    <Col {...gridSpan} className='text-right'>
                        <a onClick={this.toggle}>{this.state.expand ? '收起搜索' : '更多搜索'} <Icon type={this.state.expand ? 'up' : 'down'} /></a>
                    </Col>
                </Row>
                <div className="text-right">
                    <Button type="default" onClick={this.exportFile}><i className="fa fa-cloud-download gutter-right"/>导出数据</Button>
                </div>
            </Form>
        );
    },
    toggle(){
        this.setState({'expand':!this.state.expand});
    }
}));