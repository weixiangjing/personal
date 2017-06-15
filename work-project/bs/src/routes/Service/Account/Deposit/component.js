"use strict";
import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Icon, Form, Input, Select, Button,DatePicker, notification ,AutoComplete} from "antd";
import {Link} from 'react-router';
import {Table} from '../../../../common/Table';
import {in_array,unique,toThousands,downloadWithForm} from '../../../../util/helper';
import moment from 'moment';
import user from '../../../../model/User';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let setTable;






export default React.createClass({

  retrueAmount(sum,type){
    if(sum){
      if(type==1){
        let amount='-'+toThousands('元',sum);
        return amount;
      }
      return toThousands('元',sum);
    }else {
      return '0'
    }
  },
  getValue(){
    const fieldsValue=this.form?this.form.getFieldsValue():{};
    if(fieldsValue.custom_date){
      if(fieldsValue.custom_date.length){
        fieldsValue.book_trade_time_begin=fieldsValue.custom_date[0].format('YYYY-MM-DD 00:00:00');
        fieldsValue.book_trade_time_end=fieldsValue.custom_date[1].format('YYYY-MM-DD 23:59:59');
      }else {
        delete fieldsValue.book_trade_time_begin;
        delete fieldsValue.book_trade_time_end;
      }
    }
    if(!fieldsValue.custom_date){
      fieldsValue.book_trade_time_begin=moment(Date.now()).add(-1, 'week').format('YYYY-MM-DD 00:00:00');
      fieldsValue.book_trade_time_end=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    fieldsValue.account_no=user.account_no;
    for(let k in fieldsValue){if(fieldsValue[k]&&k!='custom_date'&&typeof(fieldsValue[k])!="number"){fieldsValue[k]=fieldsValue[k].trim();}}
    return fieldsValue;
  },
  render(){
    const columns=[
      {
        title: '充值订单号',
        dataIndex: 'charge_order_no',
        render:(text, record, index)=>(<Link to={`/service/account/deposit/details?order_no=${record.charge_order_no}`}>{record.charge_order_no}</Link>)
      },
      {
        title: '订单时间',
        dataIndex: 'create_time',
      },
      {
        title: '充值账户',
        dataIndex: 'account_name',
      },
      {
        title: '订单状态',
        render:(text, record, index)=>(<span className={`${record.order_status==1?"color_1":record.order_status==2?"color_2":"color_3"}`}>{record.order_status==1?'待付款':record.order_status==2?'已支付':'已关闭'}</span>)
      },
      {
        title: '订单金额（元）',
        render:(text, record, index)=>(<span>{record.charge_amount?toThousands("元",record.charge_amount):'0'}</span>)
      },
      {
        title: '实付金额（元）',
        render:(text, record, index)=>(<span>{record.order_real_amount?toThousands("元",record.order_real_amount):"0"}</span>)
      },
      {
        title: '流水号',
        render:(text, record, index)=>(<span>{record.pay_sys_no?record.pay_sys_no:"--"}</span>)
      }
    ];
    const children=this.props.children;
    if(children)return children;
    return (
      <div>
        <SearchForm getValue={()=>this.getValue()} ref={form=>this.form=form} onSubmit={()=>setTable.reload(this.getValue())}/>
        <hr/>
        <Table
          columns={columns}
          url="openApi/serviceAccount/getOrders"
          rowKey={'charge_order_no'}
          ref={(t)=>setTable=t}
          params={this.getValue()}
        />
      </div>
    )
  }
})
const SearchForm=Form.create()(React.createClass({
  getInitialState:function() {
    return {
      pending:false,
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if(err)return;
      this.props.onSubmit();
    });
  },
  handleReset(){this.props.form.resetFields();},
  disabledDate(current){return current&&current.valueOf()>Date.now();},
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout={'inline'} className="myform" onSubmit={this.handleSubmit}>
       
         
              <FormItem label="订单时间：">
                {getFieldDecorator('custom_date', {
                  initialValue:[moment(Date.now()).add(-1, 'week'),moment(Date.now())]
                })(
                  <RangePicker disabledDate={this.disabledDate}/>
                )}
              </FormItem>
           
              <Button type="primary" htmlType="submit" >搜索</Button>
          
         
       
      </Form>
    );
  },
}));
