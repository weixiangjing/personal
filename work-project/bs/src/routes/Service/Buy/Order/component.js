"use strict";
import React from 'react';
import {Card, Row, Col, Form, Input, Select, Button, DatePicker, AutoComplete,Tag} from "antd";
import {Link} from 'react-router';
import './style.scss';
import {CardTable} from '../../../../common/Table';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";
import moment from 'moment';
import user from "../../../../model/User";
import {getApi} from "../../../../config/api"
import {amountFormat,downloadWithForm} from "../../../../util/helper";

import {in_array, unique, toThousands,cleanEmpty} from '../../../../util/helper';

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
      fieldsValue.time_type = "2";
      fieldsValue.create_time_begin = moment(Date.now()).add(-1, 'week').format('YYYY-MM-DD 00:00:00');
      fieldsValue.create_time_end = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    if(fieldsValue._date){
      if(fieldsValue._date.length){
        if(fieldsValue.time_type == "1"){
          delete fieldsValue.create_time_begin;
          delete fieldsValue.create_time_end;
          fieldsValue.pay_time_begin = fieldsValue._date[0].format('YYYY-MM-DD 00:00:00');
          fieldsValue.pay_time_end = fieldsValue._date[1].format('YYYY-MM-DD 23:59:59');
        };
        if(fieldsValue.time_type == "2"){
          delete fieldsValue.pay_time_begin;
          delete fieldsValue.pay_time_end;
          fieldsValue.create_time_begin = fieldsValue._date[0].format('YYYY-MM-DD 00:00:00');
          fieldsValue.create_time_end = fieldsValue._date[1].format('YYYY-MM-DD 23:59:59');
        };
      }else {
        delete fieldsValue.create_time_begin;
        delete fieldsValue.create_time_end;
        delete fieldsValue.pay_time_begin;
        delete fieldsValue.pay_time_end;
      }
    }
    fieldsValue.account_no=user.account_no;
    return fieldsValue;
  },
  getTime(item){
    const value=this.getFieldsValue();
    if(value.time_type==1){return item.pay_time;}
    if(value.time_type==2){return item.create_time;}
  },
  render(props, state){
    const children=this.props.children;

    return (<div style={{overflow:"hidden"}}>
            {children}
         <div style={{display:children?"none":"block"}}>
          <SearchForm getValue={()=>this.getFieldsValue()} ref={(form)=>this.form=form} onSubmit={()=>cardtable.reload(this.getFieldsValue())}/>
          <CardTable
              extra={ <Button onClick={()=>{

                  downloadWithForm("openApi/serviceBill/getList",this.getFieldsValue())
              }}>导出数据</Button>}
            params={this.getFieldsValue()}
            fixedParams={{service_use_id:user.userId}}
            url="openApi/serviceBill/getList"
            ref={(t)=>cardtable=t}
            renderContent={
          (data)=>data.map((item,index)=>{
            return(
              <Row  style={{marginBottom:10}} key={index}>
                <div className=" service-order-item">
                  <Col span={7}>

                      <Link  to={{pathname:"service/buy/order/detail",query:{order_no:item.order_no}}}>订单号：{item.outer_no}</Link>


                      <div style={{height:12}}/>
                    <div className="text-shade">

                      {item.create_time}
                    </div>
                  </Col>
                    <Col className="text-right" span={2}>
                        <div className="type text-shade ">{item.order_type==1?"标准":"续订"}</div>
                        <div style={{height:12}}/>
                        <Tag color={"#2db7f5"}>{item.product_type==1?"服务产品":"套餐"}</Tag>
                    </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="6">
                    <div>
                      <p className="text-shade">订购总金额（元）</p>
                      <h5>{amountFormat(item.order_pay_amount/100)}</h5>
                    </div>
                    <div>
                      <p className="text-shade">优惠金额（元）</p>
                      <h5>{amountFormat(item.order_discount_amount/100)}</h5>
                    </div>
                  </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="3">
                    <p className="text-shade">{
                       item.order_status==2?"实付总金额（元）":"应付总金额（元）"
                    }</p>
                    <h5>{amountFormat(item.order_real_amount/100)}</h5>
                  </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="2">
                    <div className={`margin-bottom ${item.order_status==1?"color_1":item.order_status==2?"color_2":"color_3"}`}>{item.order_status==1?"等待付款":item.order_status==2?"已付款":"已关闭"}</div>
                      {
                        item.order_status==1 && <Link  to={`service/buy/step?id=${item.order_no}`}>付款</Link>
                      }
                  </Col>
                </div>
              </Row>
             )
           })
          }
          />
         </div>
      </div>
    )
  }
})
const SearchForm = Form.create()(React.createClass({
  getInitialState: function () {
    return {
      pending: false,
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
    this.props.form.resetFields(["unit_type","order_status","unit_id","outer_no","time_type"]);
    AutoCompleteAsync.clear()
  },
  disabledDate(current){return current&&current.valueOf()>Date.now();},
  render() {

    const {getFieldDecorator,getFieldsValue,getFieldValue,setFieldsValue} = this.props.form;
    const {startValue, endValue, endOpen} = this.state;

    const prefixSelector = getFieldDecorator('unit_type')(
      <Select onChange={(value)=>{
          if(value==1){
            setFieldsValue({unit_id:user.userId});
          }else{
              setFieldsValue({unit_id:""});
          }
      }} placeholder="全部" allowClear>
        <Select.Option value="1">商户</Select.Option>
        <Select.Option value="2">门店</Select.Option>
        <Select.Option value="3">设备</Select.Option>
      </Select>
    );

    let bill_type= getFieldValue("unit_type");
    let bill_type_placeholder=['','','请输入门店mcode','请输入设备en号']

    return (
      <Form layout={'horizontal'} className="myform" onSubmit={this.handleSubmit}>

        <div className="formFields">
          <Row gutter={5}>

            <Col  xs={24} sm={24} md={12} lg={8} xl={8}>
              <Row>
                <div className="inline-input-group inline input-group-width-select ">
                  <Col span={8} className="ant-form-item-label"><label><span style={{color:"red"}}>* </span>时间段</label></Col>
                  <Col className="input-select-group" span={16}>
                    {
                      getFieldDecorator('time_type',{
                          initialValue:"2"
                      })(
                        <Select style={{width:55}}>
                          <Select.Option value="1">支付</Select.Option>
                          <Select.Option value="2">创建</Select.Option>
                        </Select>
                      )
                    }
                    <div id="_time">
                      {getFieldDecorator('_date', {
                        rules: [{required: true, message: '请选择时间段'}],
                          initialValue:[moment(Date.now()).add(-1, 'week'),
                              moment(Date.now())]
                      })(
                        <RangePicker disabledDate={this.disabledDate}/>
                      )}
                    </div>
                  </Col>
                </div>
              </Row>

            </Col>
            <Col   xs={24} sm={24} md={12} lg={8} xl={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="订单状态：">
                {getFieldDecorator('order_status')(
                  <Select placeholder="全部" allowClear>
                      <Select.Option value="">全部</Select.Option>
                    <Select.Option value="1">未支付</Select.Option>
                    <Select.Option value="2">已支付</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col   xs={24} sm={24} md={12} lg={8} xl={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="服务：">
                {getFieldDecorator('service_code')(
                  <AutoCompleteAsync
                    url="serviceProduct/get"
                    requestKey="keywords"
                    labelKey="service_name"
                    valueKey="service_code"
                    placeholder="请输入关键字匹配正确账户"
                  />
                )}
              </FormItem>
            </Col>
            <Col   xs={24} sm={24} md={12} lg={8} xl={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="外部订单号：">
                {getFieldDecorator('outer_no')(
                  <Input placeholder="输入准确的订单号"/>
                )}
              </FormItem>
            </Col>
            <Col  xs={24} sm={24} md={12} lg={8} xl={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="计费单元：">
                {getFieldDecorator('unit_id')(
                  <Input disabled={bill_type==1} addonBefore={prefixSelector} placeholder={bill_type_placeholder[bill_type]}/>
                )}
              </FormItem>
            </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}  className="action-bar">

                  <Button onClick={this.handleReset}>清除</Button>
                  <Button type="primary" htmlType="submit" loading={this.state.pending}>搜索</Button>



              </Col>
          </Row>
        </div>

      </Form>
    );
  },
}));
