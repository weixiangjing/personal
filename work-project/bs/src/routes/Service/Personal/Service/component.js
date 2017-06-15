"use strict";
import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Form, Input, Select, Button, Table, Modal,Tag,Switch,Icon,Radio} from "antd";
import {Link} from 'react-router';
import './style.scss';
import {CardTable} from '../../../../common/Table';
import {SearchGroupBordered} from '../../../../components/SearchGroup';
import user from "../../../../model/User";
import CartUtil from '../../../../model/CartUtil'
import {setDateTime,toThousands} from '../../../../util/helper';
let cardTable;
const FormItem = Form.Item;

export default React.createClass({
  getInitialState() {
    return {
      total: 0,
      date:'',
    };
  },
  onLoading(e){if(e)this.setState({total:e.total,date:e.date})},
  setHandlerValue(){
    const unit_type=this.props.location.query.unit_type;
    const unit_id=this.props.location.query.unit_id;
    let values={};
    values.service_status="1";
    if(this.form){
      values=this.form.getFieldsValue()
    }else if(unit_type&&unit_id){
      values.unit_id=unit_id;
      values.unit_type=unit_type;
      values.service_status="1";
    }
    values.service_use_id=user.userId;
    for(let k in values){if(values[k]&&typeof(values[k])!="number"){values[k]=values[k].trim();}}
    return values;
  },
  onSwitch(checked,id){
    let params={
      unitServiceId:id,
      is_renew:checked?'1':"2"
    };
    axios.post('openApi/purchasedService/updatePurchasedService',params).then(()=>{
      cardTable.update(this.setHandlerValue())
    })
  },
  toLink(item,record){
    const obj={...item,...record,num:1};
    delete obj.unit_services;
    if(CartUtil.hasPack()){
      Modal.confirm({
        title: '提示',
        content: "购物车不能同时添加产品和套餐，继续添加将清空购物车产品，确认继续？",
        okText: '确认',
        cancelText: '取消',
        onok() {
          CartUtil.setCartData([obj]);
          this.props.router.push('service/buy/cart?renew=1')
        }
      })
    }else {
      CartUtil.addToCart(obj);
      this.props.router.push('service/buy/cart?renew=1')
    }
  },
  retrueColumns(item){
    const {total,date}=this.state;
    const columns=[
      {
        title: '计费单元',
        width:100,
        className:'table_center',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":''}`}><i className={`text-shade font-md margin-right fa ${record.unit_type==1?"fa-user":record.unit_type==2?"fa-home":record.unit_type==3?"fa-mobile":"fa-odnoklassniki-square"}`}></i>{record.unit_id}</span>)
      },
      {
        title: '服务生效时间',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":''}`}>{record.current_service_eff_date}</span>)
      },
      {
        title: '服务到期时间',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":""}`}>{record.current_service_exp_date}</span>)
      },
      {
        title: '可用天数',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":parseInt((new Date(record.current_service_exp_date)-new Date(date))/(1000*60*60*24))<5 ||setDateTime(date,record.current_service_exp_date)=="即将结束"?"color_1":"color_2"}`}>{item.billing_cycle==0||item.billing_mode==3?"永久":setDateTime(date,record.current_service_exp_date)}</span>)
      },
      {
        title: '自动续订',
        render:(text, record, index)=>((item.product_is_support_auto_renew!=1&&setDateTime(date,record.current_service_exp_date)!="已到期"&&item.billing_cycle!=0&&item.billing_mode!=3&&item.product_status!=2)&&<Switch onChange={(e)=>this.onSwitch(e,record.unitServiceId)} checked={record.is_renew==1?true:false}/>)
      },
      {
        title: '操作',
        render:(text, record, index)=>(setDateTime(date,record.current_service_exp_date)!="已到期"&&item.billing_mode!=3&&item.billing_cycle!=0&&item.product_status!=2&&<a onClick={()=>this.toLink(item,record)}>订购</a>)
      }
    ];
    return columns;
  },
  render(props,state){
    const {total,date}=this.state;
    const _unit_type=this.props.location.query.unit_type;
    const _unit_id=this.props.location.query.unit_id;
    return (
      <div>
        <AntForm ref={(form)=>this.form=form}
                 onSubmit={()=>cardTable.reload(this.setHandlerValue())}
                 _unit_type={_unit_type} _unit_id={_unit_id}
        />
        <CardTable

          url="openApi/purchasedService/getServiceList"
          ref={(t)=>cardTable=t}
          onLoad={this.onLoading}
          params={this.setHandlerValue()}
          pageSize={10}
          className="hide-page"
          renderContent={(list)=>{
            return list.map((item,index)=>{
              return (
                  <Card key={index} style={{marginBottom:15}}>
                    <Row gutter={5}>
                      <Col span={8}>
                        <h4>{item.service_name}{item.product_status==2&&<Tag color="#999" className="margin-h">{item.product_status==2&&"已下架"}</Tag>}  </h4>
                        {item.product_code&&<Link to={`service/buy/product/add?id=${item.product_code}`}><h6>{item.product_name}</h6></Link>}
                        <h6><span className="d-price">{item.product_market_price?toThousands("元",item.product_market_price):"0"}</span>{item.billing_cycle==1?"元/天":item.billing_cycle==2?"元/月":item.billing_cycle==3?"元/年":'元'}</h6>
                        {item.billing_mode==1&&<h6>用量：{item.billing_total}{item.billing_unit}{item.billing_cycle==1?"/天":item.billing_cycle==2?"/月":item.billing_cycle==3?"/年":''}</h6>}
                      </Col>
                      <Col span={16}>
                        <Table dataSource={item.unit_services||[]} columns={this.retrueColumns(item)} size="small"
                         rowKey={'unit_id'} pagination={false}/>
                      </Col>
                    </Row>
                  </Card>
              )
            })
          }}
        />
      </div>
    )
  }
})
let _form ;
const AntForm=Form.create({
  onFieldsChange:(a,fields)=>{
    if(fields.service_status){
      let values=_form.getFieldsValue();
      for(let k in values){if(values[k]&&typeof(values[k])!="number"){values[k]=values[k].trim();}}
      cardTable.update({...values,service_use_id:user.userId});
    }
  }}
)(React.createClass({
  getInitialState: function () {
    return {
      disabled:false,
      placeholder:''
    };
  },
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
  render(){
    const {getFieldDecorator}=this.props.form;
    const {_unit_type,_unit_id}=this.props;
    _form=this.props.form;
    const prefixSelector = getFieldDecorator('unit_type',{
      initialValue:_unit_type
    })(
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
      <Form onSubmit={(e) => {
                e.preventDefault()
                this.props.form.validateFields((err, fieldsValue) => {
                  if (err)return;
                  this.props.onSubmit();
                });
            }} className="myform">
        <SearchGroupBordered group={[{
            title:"服务期限",
            content:<FormItem>
                {
                    getFieldDecorator("service_status",{
                      initialValue:"1"
                    })(
                        <Radio.Group>
                            <Radio.Button value="1">不限</Radio.Button>
                            <Radio.Button value="2">生效中</Radio.Button>
                            <Radio.Button value="3">已过期</Radio.Button>
                        </Radio.Group>
                    )
                }
            </FormItem>
        },
        {
            title:"计费单元",
            content:<div>
                <FormItem className="unitid"  >
                    {getFieldDecorator('unit_id',{
                      initialValue:_unit_id
                    })(
                        <Input addonBefore={prefixSelector} placeholder={this.state.placeholder} disabled={this.state.disabled}/>
                    )}
                </FormItem>
                <FormItem><Button type="primary" htmlType="submit">查询</Button></FormItem>
            </div>
        }
        ]}/>
      </Form>
    )
  }
}));
