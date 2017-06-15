"use strict";
import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Form, Input, Select, Button, DatePicker, AutoComplete,Tag} from "antd";
import {Link} from 'react-router';
import './style.scss';
import {CardTable} from '../../../../common/Table';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";
import moment from 'moment';
import {in_array, unique, toThousands,downloadWithForm} from '../../../../util/helper';
import user from '../../../../model/User';
let cardtable;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
export default React.createClass({

  getInitialState() {
    return {
      visible: false,
    };
  },

  getFieldsValue(){
    const fieldsValue = this.form?this.form.getFieldsValue():{};
    if(!fieldsValue._date){
      fieldsValue.pay_time_begin = moment(Date.now()).add(-1, 'week').format('YYYY-MM-DD 00:00:00');
      fieldsValue.pay_time_end = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    if(fieldsValue._date){
      if(fieldsValue._date.length){
        fieldsValue.pay_time_begin = fieldsValue._date[0].format('YYYY-MM-DD 00:00:00');
        fieldsValue.pay_time_end = fieldsValue._date[1].format('YYYY-MM-DD 23:59:59');
      }else {
        delete fieldsValue.pay_time_begin;
        delete fieldsValue.pay_time_end;
      }
    }
    fieldsValue.account_no=user.account_no;
    for(let k in fieldsValue){if(fieldsValue[k]&&k!='_date'&&typeof(fieldsValue[k])!="number"){fieldsValue[k]=fieldsValue[k].trim();}}
    return fieldsValue;
  },
  getTime(item){
    return item.pay_time;
  },
  render(props, state){
    const children=this.props.children;
    if(children) return children;
    return (<div style={{overflow:"hidden"}}>
        <SearchForm getValue={()=>this.getFieldsValue()} ref={(form)=>this.form=form} onSubmit={()=>cardtable.reload(this.getFieldsValue())}/>
        <CardTable
          params={this.getFieldsValue()}
          url="openApi/serviceBill/getList"
          ref={(t)=>cardtable=t}
          renderContent={
          (data)=>data.map((item,index)=>{
            return(
              <Row style={{marginBottom:10}} key={index}>
                <Card className="card_list">
                  <Col span="10">
                    <div style={{marginBottom:5}}>
                      <h5>账单号：<Link to={{pathname:"/service/account/bill/details",query:{id:item.order_no,time:item.pay_time,status:item.order_status}}}>{item.order_no}</Link></h5>
                      <Tag color={`${item.product_type=='2'?"#2db7f5":"#f50"}`}>{item.product_type==1?"服务产品":"服务套餐"}</Tag><span className="type">{item.order_type==1?"标准":"续订"}</span>
                    </div>
                    <div>
                      <p style={{float:"left"}}>订单号：{item.outer_no}</p>
                      <p style={{float:"right"}}>{this.getTime(item)}</p>
                    </div>
                  </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="7">
                    <div>
                      <p>订购总金额（元）</p>
                      <h5>{item.order_pay_amount?toThousands("元",item.order_pay_amount):"0"}</h5>
                    </div>
                    <div>
                      <p>优惠金额（元）</p>
                      <h5>{item.order_discount_amount?toThousands("元",item.order_discount_amount):"0"}</h5>
                    </div>
                  </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="5">
                    <p>账单总金额（元）</p>
                    <h5>{item.order_real_amount?toThousands("元",item.order_real_amount):"0"}</h5>
                  </Col>
                </Card>
              </Row>
             )
           })
          }
        />
      </div>
    )
  }
})
const SearchForm = Form.create()(React.createClass({
  getInitialState: function () {
    return {
      placeholder:'',
      disabled:false
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err)return;
      this.props.onSubmit();
    });
  },
  handleReset(){
    this.props.form.resetFields(["unit_type","unit_id"]);
    AutoCompleteAsync.clear()
  },
  disabledDate(current){return current&&current.valueOf()>Date.now();},
  onChangeUnitType(e){
    if(e==1){
      this.props.form.setFieldsValue({unit_id: user.userId,});
      this.setState({disabled:true})
    }else {
      this.props.form.setFieldsValue({unit_id:"",});
      this.setState({disabled:false})
    }
    if(e==2){this.setState({placeholder:'请输入门店Mcode'})}
    if(e==3){this.setState({placeholder:'请输入设备EN'})}
    if(!e){this.setState({placeholder:''})}
  },
  render() {
    const {getFieldDecorator,getFieldsValue} = this.props.form;
    const {disabled,placeholder}=this.state;
    const prefixSelector = getFieldDecorator('unit_type')(
      <Select placeholder="全部" allowClear
        onChange={this.onChangeUnitType}
      >
        <Select.Option value="1">商户</Select.Option>
        <Select.Option value="2">门店</Select.Option>
        <Select.Option value="3">设备</Select.Option>
        {/*<Select.Option value="4">应用内账号</Select.Option>*/}
      </Select>
    );
    return (
      <Form layout={'horizontal'} className="myform" onSubmit={this.handleSubmit}>
        <div className="formFields">
          <Row gutter={5}>
            <Col xs={12} sm={12} md={8} lg={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="服务：">
                {getFieldDecorator('service_code')(
                  <AutoCompleteAsync
                    url="openApi/service/get"
                    requestKey="keywords"
                    labelKey="service_name"
                    valueKey="service_code"
                    placeholder="请输入关键字匹配正确账户"
                  />
                )}
              </FormItem>
            </Col>
            <Col  xs={12} sm={12} md={8} lg={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="计费单元：">
                {getFieldDecorator('unit_id')(
                  <Input addonBefore={prefixSelector}
                         placeholder={placeholder}
                         disabled={disabled}
                  />
                )}
              </FormItem>
            </Col>
            <Col  xs={12} sm={12} md={8} lg={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="付款时间：">
                {getFieldDecorator('_date', {
                  rules: [{required: true, message: '请选择时间段'}],
                  initialValue:[moment(Date.now()).add(-1, 'week'),
                    moment(Date.now())]
                })(
                  <RangePicker disabledDate={this.disabledDate}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row className={"margin-top-lg"} type={"flex"} justify={'end'}>
          <Col >
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button onClick={this.handleReset} className={"margin-left"}>清除</Button>
          </Col>
        </Row>
      </Form>
    );
  },
}));
