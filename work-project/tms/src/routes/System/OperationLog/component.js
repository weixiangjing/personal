"use strict";
import React from "react";
import axios from "axios";
import {Button, Modal, Form, Row, Col, Input, Select, DatePicker, AutoComplete} from "antd";
import ModalBody from "./modalbody";
import "./style.scss";
import {Table} from "../../../components/Table";
import PayChannel from '../../../components/PaymentCascader/index';
import moment from "moment";
import AutoCompleteAsync from "../../../components/AutoCompleteAsync";

const FormItem   =Form.Item;
const Option     =Select.Option;
const RangePicker=DatePicker.RangePicker;
let creatTable;
const staetDate=new Date(Date.now()-3*24*60*60*1000)

export default React.createClass({
  getInitialState() {
    return {
      visible: false, gList: [],
    };
  }, handleOk(){
    this.setState({
      visible: false
    })
  }, handleCancel(){
    this.setState({
      visible: false
    })
  }, showModal(text){
    this.setState({
      visible: true, gList: text
    })
  }, getValue(){
    const value=this.form?this.form.getFieldsValue():{};
    if(value.start_date&&value.start_date.length) {
      value.create_time_begin=value.start_date[0].format('YYYY-MM-DD 00:00:00');
      value.create_time_end  =value.start_date[1].format('YYYY-MM-DD 23:59:59');
    }
    if(!value.start_date) {
      value.create_time_begin=moment(staetDate).format('YYYY-MM-DD 00:00:00');
      value.create_time_end  =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    if(value.channel_id) {
      value.pay_channel_id=value.channel_id[1]
    }
    for(let k in value){if(value[k]&&k!='start_date'&&typeof(value[k])!="number"){value[k]=value[k].trim();}}
    return value;
  }, render(props, state){
    const columns=[{
      title: '时间', dataIndex: 'create_time',
    }, {
      title: '操作类型', dataIndex: 'log_sub_type', render:log_sub_type =>log_sub_type==101 ? (<span>账号安全</span>) :log_sub_type==201 ? <span>收银配置</span>:log_sub_type==202&&<span>基础配置</span>
    }, {
      title: '操作者', dataIndex: 'userRealName',
    },
      {title: 'Mcode', dataIndex: 'mcode'},
      {
        title: '日志说明', dataIndex: 'description',
      }, {
        title : '操作',
        key   : 'action',
        render: (text, record, index)=>(<span><a onClick={()=>this.showModal(text)}>查看</a></span>)
      }];
    return (<div>
      <SearchForm ref={form=>this.form=form} onSubmit={()=>creatTable.update(this.getValue())}/>
      <Table
        bordered
        params={this.getValue()}
        className='data-table'
        columns={columns}
        url="tmsPaychannelLog/getLog"
        rowKey={'id'}
        ref={t=>creatTable=t}
      />
      <Modal title="操作日志详情" visible={this.state.visible}
             onOk={this.handleOk} onCancel={this.handleCancel}
             className="log-modal"
      >
        <ModalBody mBody={this.state.gList}/>
      </Modal>

    </div>)
  }
})
const SearchForm=Form.create()(React.createClass({
  getInitialState: function() {
    return {
      result:[]
    };
  }, handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue)=> {
      if(err)return;
      this.props.onSubmit();
    });
  },
  disabledDate(current){
    return current&&current.valueOf()>Date.now();
  },
  handleChange(value){
    let result=[];
    if (!value.trim()) {
      result = [];
      this.setState({ result });
    } else {
      axios.post('user/searchUser',{keywords:value.trim()}).then((res)=>{
        res.data.map((item)=>{
          result.push(item.real_name);
        })
        this.setState({ result});
      })
    }
  },
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form horizontal className={["ant-advanced-search-form", "myform"]} onSubmit={this.handleSubmit}>
        <div className="formFields">
          <Row gutter={5}>
            <Col xs={12} sm={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="操作时间：">
                {getFieldDecorator('start_date', {
                  rules: [{required: true, message: '请选择一段时期'}],
                  initialValue:[moment(staetDate), moment(Date.now())]
                })(<RangePicker disabledDate={this.disabledDate}/>)}
              </FormItem>
            </Col>
            <Col xs={12} sm={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="操作类型：">
                {getFieldDecorator('log_sub_type', {})(<Select placeholder="全部类型" allowClear>
                  <Option value="101">账号安全</Option>
                  <Option value="201">收银配置</Option>
                  <Option value="202">基础配置</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col xs={12} sm={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="操作者：">
                {getFieldDecorator('userId', {

                })(
                  <AutoCompleteAsync
                    url="user/searchUser"
                    requestKey="keywords"
                    labelKey="real_name"
                    valueKey="user_id"
                    placeholder="请输入关键字快速匹配"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col xs={12} sm={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="操作关键词：">
                {getFieldDecorator('keywords', {
                  //initialValue:this.state.keyWords
                })(
                  <AutoComplete
                    dataSource={["修改费率","开关支付方式","通道参数配置","通道参数批量配置","支付插件"]}
                    allowClear
                  />
                )}
              </FormItem>
            </Col>
            <Col xs={12} sm={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="门店MCODE：">
                {getFieldDecorator('mcodes', {
                })(
                  <Input maxLength="30"/>
                )}
              </FormItem>
            </Col>
            <Col xs={12} sm={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="相关通道：">
                {getFieldDecorator('channel_id', {
                })(
                  <PayChannel/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={5} className='form-action'>
            <Col span={4} className='text-right' style={{float:'right'}}>
              <Button type="primary" htmlType="submit">搜索</Button>
            </Col>
          </Row>
        </div>
      </Form>
    );
  },
}));
