"use strict";
import React from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker, Icon, notification,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const moment = require('moment');
const reducer = require('./reducer');
import {Status} from '../../../model/Order';
import {removeEmptyProperty} from '../../../util/helper';
const StatusList = Object.keys(Status);

export default Form.create()(React.createClass({
    handleSubmit(e) {
        if(e)e.preventDefault();
        this.submit();
    },
    exportFile(){
        this.submit({export:1});
    },
    componentDidMount(){
        if(reducer.state.formData)this.props.form.setFieldsValue(reducer.state.formData);
    },
    submit(params){
        if(!params)params = {};
        this.props.form.validateFields((err, fieldsValue) => {
            if(err)return;
            reducer.cacheFormData(fieldsValue);
            let data = Object.assign(this.transferForm(fieldsValue),params);
            reducer.search(data).catch(err=>{
                notification.error({
                    message: '操作失败',
                    description: err.message
                })
            });
        });
    },
    transferForm(originParams){
        const params = originParams?JSON.parse(JSON.stringify(originParams)):{};
        let create_time = params.create_time;
        if(create_time && create_time.length>=2){
            params.create_time_begin = moment(create_time[0]).format('YYYY-MM-DD 00:00:00');
            params.create_time_end = moment(create_time[1]).format('YYYY-MM-DD 23:59:59');
        }
        delete (params.create_time);
        return removeEmptyProperty(params);
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
                    <FormItem {...formItemLayout} label="订单号">
                        {getFieldDecorator('agent_instalment_bill_id', {
                        })(
                            <Input placeholder="请输入订单号"/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="代理商">
                        {getFieldDecorator('agent_name', {
                        })(
                            <Input placeholder='请输入代理商名称'/>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="SN搜索">
                        {getFieldDecorator('sn', {
                        })(
                            <Input placeholder='请输入SN号'/>
                        )}
                    </FormItem>
                </Col>
            </Row>,
            <Row gutter={5} key="2">
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="订单状态">
                        {getFieldDecorator('status', {
                            initialValue:''
                        })(
                            <Select>
                                <Option value=''>全部</Option>
                                {StatusList.map(key=>
                                    <Option key={key} value={key}>{Status[key]}</Option>
                                )}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col {...gridSpan}>
                    <FormItem {...formItemLayout} label="账单周期">
                        {getFieldDecorator('create_time', {
                        })(
                            <RangePicker/>
                        )}
                    </FormItem>
                </Col>
            </Row>
        ];
        const pending = reducer.state.get('pending');
        return (
            <Form layout="horizontal" id="search-form" className="ant-advanced-search-form form" onSubmit={this.handleSubmit}>
                <div className="formFields">
                    {formRows}
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
                    <Col {...gridSpan}/>
                </Row>
                <div className="text-right gutter-v-lg">
                    <Button type="default" onClick={this.exportFile}><i className="fa fa-cloud-download gutter-right"/>导出数据</Button>
                </div>
            </Form>
        );
    }
}));