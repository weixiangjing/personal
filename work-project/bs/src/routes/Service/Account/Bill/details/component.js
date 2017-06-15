import React from 'react';
import axios from 'axios';
import { Row, Col, Card, Spin, Button,DatePicker, notification ,Icon} from 'antd';
import {Link} from 'react-router';
import './style.scss';
import '../style.scss';
import {getServieList,getList,getDetail} from './reducer';
import {Table} from '../../../../../common/Table';
import {in_array,unique,toThousands} from '../../../../../util/helper';

export default React.createClass({
  getInitialState() {
    return {
      id:this.props.location.query.id,
      params:'',
      _status:this.props.location.query.status
    };
  },
  componentWillMount(){
    const id=this.props.location.query.id;
    const time_type=this.props.location.query.type;
    const time=this.props.location.query.time;
    const params=new Object();
    params.pay_time_begin=time;params.pay_time_end=time;
    params.order_no=id;
    getServieList(id);
    getList(params);
    this.setState({id,params})
  },
  render(props,state){
    const {id,_status}=this.state;
    const objItem=state.get('list').toJS()[0]?state.get('list').toJS()[0]:{};
    const product=state.get('product').toJS();
    const combo=state.get('combo').toJS();
    const columns =[
      {
        title: '明细ID',
        dataIndex: 'bill_detail_id',
      },
      {
        title: '订购服务及产品',
        render:(text, record, index)=>{
          return(
            <span>【{record.service_name||record.combo_name}】{record.product_name}</span>
          )}
      },
      {
        title: '计费单元',
        render:(text, record, index)=>(<span><i className={`fa font-md ${record.unit_type==1?"fa-user":record.unit_type==2?"fa-home":record.unit_type==3?"fa-mobile":"fa-odnoklassniki-square"}`}></i>{record.unit_id}</span>)
      },
      {
        title: '市场价（元）',
        render:(text, record, index)=>(<span>{record.product_market_price?toThousands("元",record.product_market_price):"0"}</span>)
      },
      {
        title: '订购数量',
        dataIndex: 'buy_count',
      },
      {
        title: '优惠金额（元）',
        render:(text, record, index)=>(<span>{record.discount_adjust_amount?toThousands("元",record.discount_adjust_amount):"0"}</span>)
      },
      /*{
        title: '优惠数量',
        dataIndex: 'discount_adjust_buy_count',
      },*/
      {
        title: '订购金额（元）',
        render:(text, record, index)=>(<span>{
          record.product_market_price&&record.buy_count?toThousands("元",record.discount_adjust_amount?(record.product_market_price*record.buy_count-record.discount_adjust_amount):record.product_market_price*record.buy_count): "0"
        }</span>)
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      }
    ]
    return(
      <div className="details_bill">
        <Spin spinning={state.get('loading')}/>
        {!state.get('loading')?(
          <div>
            <Card title={<span><b className="title_span">账单号：{id}</b><span className={`${_status==1?"color_1":_status==2?"color_2":"color_3"}`}>{_status==1?"待付款":_status==2?"已付款":"已关闭"}</span></span>} className="card_1"
                  extra={<span>完成支付时间：{objItem.pay_time}</span>}
            >
              <Row>
                <Col span={16}>
                  <div className="data-item icon32">
                    <div>
                      <i className="fa fa-database"/>
                      <div className="data-text">
                        <p className="d-title text">订购总金额（元）</p>
                        <p className="d-number d-price">{objItem.order_pay_amount?toThousands("元",objItem.order_pay_amount):"0"}</p>
                      </div>
                    </div>
                    <div>
                      <i className="fa fa-database"/>
                      <div className="data-text">
                        <p className="d-title text">优惠总金额（元）</p>
                        <p className="d-number d-amount">{objItem.order_discount_amount?toThousands("元",objItem.order_discount_amount):"0"}</p>
                      </div>
                    </div>
                    <div>
                      <i className="fa fa-database"/>
                      <div className="data-text">
                        <p className="d-title text">账单总金额（元）</p>
                        <p className="d-number d-price">{objItem.order_real_amount?toThousands("元",objItem.order_real_amount):"0"}</p>
                      </div>
                    </div>
                  </div>
                </Col>
                {objItem.manual_adjust_amount? <Col span={8}>
                  <div className="data-item">
                    <div className="data-text">
                      <p className="d-title text">批量调整金额（元）</p>
                      <p className="d-number d-amount">{
                        objItem.manual_adjust_amount?toThousands("元",objItem.manual_adjust_amount):"0"}
                      </p>
                    </div>
                    <div className="data-text">
                      <p className="d-title text">批量调整说明</p>
                      <p className="d-text">{objItem.manual_adjust_note}</p>
                    </div>
                  </div>
                </Col>:''}
              </Row>
            </Card>
            <Card title={<b>基本属性</b>}>
              <Row>
                <Col span={12}>
                  <div className="data-item">
                    <ul>
                      <li><span>来源系统：</span>{objItem.order_buy_sys_src==1?"商户平台":objItem.order_buy_sys_src==2?"服务商平台":"其他"}</li>
                      <li><span>服务订购方：</span>{objItem.service_buyer_name}</li>
                      <li><span>创建时间：</span>{objItem.create_time}</li>
                    </ul>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="data-item">
                    <ul>
                      <li><span>外部订单号：</span>{objItem.outer_no}</li>
                      <li><span>服务使用方：</span>{objItem.service_use_name}</li>
                      <li><span>订单类型：</span>{objItem.product_type==1?"服务产品":"服务套餐"}-{objItem.order_type==1?"标准":"续订"}</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        ):""}
        {product.length?
          <Card title={<b>服务产品</b>}>
            {product.map((item,index)=>{
              return(
                <div key={index}>
                  {index>0?<hr className="hr-divider"/>:''}
                  <Row>
                    <Col span={7}>
                      <div className="data-item">
                        <div className="data-text">
                          <p className="d-title text">{item.service_name}</p>
                          <p>
                            <span className="bill_cycle">{item.billing_cycle==1?"天":item.billing_cycle==2?"月":item.billing_cycle==3?"年":"永久"}</span>
                            {item.product_name}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col span={1}><span className="ant-divider"/></Col>
                    <Col span={7}>
                      <div className="data-item">
                        <div className="data-text">
                          <p className="d-title text">订购单价（元）</p>
                          <p className="d-number">{item.product_market_price?toThousands("元",item.product_market_price):"0"}</p>
                        </div>
                        <div className="data-text">
                          <p className="d-title text">订购数量</p>
                          <p className="d-number">{item.buy_count}</p>
                        </div>
                        <div className="data-text">
                          <p className="d-title text">计费单元</p>
                          <p className="d-number"><span><i className={`fa ${item.unit_type==1?"fa-user":item.unit_type==2?"fa-home":item.unit_type==3?"fa-mobile":"fa-odnoklassniki-square"}`} style={{marginRight:10}}></i>{item.billing_unit_count}</span></p>
                        </div>
                      </div>
                    </Col>
                    <Col span={1}><span className="ant-divider"/></Col>
                    <Col span={7}>
                      <div className="data-item">
                        <div className="data-text">
                          <p className="d-title text">总金额（元）</p>
                          <p className="d-number d-price">{
                            item.product_market_price&&item.buy_count?
                              toThousands("元",item.product_market_price*item.buy_count*item.billing_unit_count):"0"
                          }</p>
                        </div>
                        <div className="data-text">
                          <p className="d-title text">优惠总金额（元）</p>
                          <p className="d-number d-amount">{
                            item.discount_adjust_amount?toThousands('元',item.discount_adjust_amount):"0"
                          }</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
            })}
          </Card>
          :''}
        {combo.length?
          combo.map((item,index)=>{
            return(
              <Card title={<b>服务套餐</b>} key={index}>
                <Row>
                  <Col span={16}>
                    <div className="data-item">
                      <div className="data-text">
                        <p className="d-title text">{item.combo_name}</p>
                        {item.productArr.map((text,i)=>{
                          return (<p key={i}>
                              <span className="bill_cycle">{text.billing_cycle==1?"天":text.billing_cycle==2?"月":text.billing_cycle==3?"年":"永久"}</span>
                              【{text.service_name}】{text.product_name}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  </Col>
                  <Col span={1}><span className="ant-divider"/></Col>
                  <Col span={7}>
                    <div className="data-item">
                      <div className="data-text">
                        <p className="d-title text">套餐总金额（元）</p>
                        <p className="d-number d-price">{
                          item.combo_discount_price?
                            toThousands("元",item.combo_discount_price):"0"
                        }</p>
                      </div>
                      <div className="data-text">
                        <p className="d-title text">套餐节省金额（元）</p>
                        <p className="d-number d-amount">{
                          item.sum?
                            toThousands('元',item.sum-item.combo_discount_price):"0"                        }</p>
                      </div>
                    </div>
                  </Col>
                </Row>
                {
                  item.discount_name?
                    <Row>
                      <Col span={7} offset={16}>
                        <p className="manual_note"><span>惠</span>{item.discount_name}</p>
                      </Col>
                    </Row>:""
                }
              </Card>)})
          :''}
        <Table
          columns={columns}
          params={{order_no:id}}
          url="openApi/serviceBill/getDetail"
          rowKey={'bill_detail_id'}
        />
      </div>
    )
  }

})
