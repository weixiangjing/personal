import React from 'react';
import axios from 'axios';
import { Form, Row, Col, Card, Icon, Button,DatePicker, Popconfirm ,Spin,Modal,notification} from 'antd';
import './style.scss';
import {Link} from "react-router";
import {getDate,getFwS,getList} from './reducer';
import moment from 'moment';
import {toThousands} from '../../../../util/helper';
import {Table} from '../../../../common/Table';
import user from '../../../../model/User'
const { MonthPicker, RangePicker } = DatePicker;
const ReactQRCode =require("qrcode.react");
let creatTable;

export default React.createClass({

  getInitialState() {
    return {
      showH5:false,
      id:user.account_no,
      paramsFw:{
        account_no:user.account_no,
        book_trade_time_begin:moment(Date.now()).format('YYYY-MM-01 00:00:00'),
        book_trade_time_end:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      },
    };
  },
  componentWillMount(){
    const {id,paramsFw}=this.state;
    getFwS({account_no:id,trade_time_begin:paramsFw.book_trade_time_begin,trade_time_end:paramsFw.book_trade_time_end});
    getList({account_no:id});
  },
  onDateChange(date, dateString){
    const start=date.format('YYYY-MM-01 00:00:00');
    const end=getDate(dateString);
    const params={
      account_no:this.state.id,
      book_trade_time_begin:start,
      book_trade_time_end:end
    }
    getFwS({account_no:this.state.id,trade_time_begin:start,trade_time_end:end});
    if(creatTable)creatTable.update(params);
    this.setState({paramsFw:params})
  },
  disabledDate(current){return current&&current.valueOf()>Date.now();},
  onloading(e){if(e)this.setState({showH5:true})},
  render(porps,state){
    const columns=[
      {
        title: '流水号',
        dataIndex: 'book_no',
      },
      {
        title: '发生时间',
        dataIndex: 'book_trade_time',
      },
      {
        title: '发生金额（元）',
        render:(text, record, index)=>(<span className={record.book_type==2?"d-amount":"d-price"}>{record.book_occur_amount?record.book_type==1?"-"+toThousands("元",record.book_occur_amount):toThousands("元",record.book_occur_amount):"0"}</span>)
      },
      {
        title: '本期余额（元）',
        render:(text, record, index)=>(<span>{record.book_account_current_balance?toThousands("元",record.book_account_current_balance):"0"}</span>)
      },
      {
        title: '操作类型',
        dataIndex: 'book_subject_name',
      },
      {
        title: '外部订单号',
        dataIndex: 'outer_sys_no',
      },
    ];
    const accountData=state.get('account').toJS()[0];
    const fwq_statistics=state.get('fwq_statistics').toJS()[0];
    const {paramsFw,showH5}=this.state;
    return(
      <Spin spinning={state.get('loading')}>
        {!state.get('loading')?
          <div className="details_querya" id="account_details">
            <Card className="basic_card">
              <Row>
                <Col span="10">
                  <ul>
                    <li><span>账户名称：</span>{accountData.account_name}</li>
                    <li><span>客户类型：</span>{accountData.bind_customer_type?accountData.bind_customer_type==1?"商户":"渠道商":"--"}</li>
                    <li><span>账户状态：</span>{accountData.status?accountData.status==1?"可用":"停用":"--"}</li>
                    <li><span>开户时间：</span>{accountData.create_time}</li>
                  </ul>
                </Col>
                <Col span="10" style={{borderRight:"1px solid #ddd"}}>
                  <ul>
                    <li><span>账户号：</span>{accountData.account_no}</li>
                    <li><span>客户号：</span>{accountData.bind_customer_no}</li>
                    <li><span>账户余额：</span><b style={{fontWeight:"bold"}}>{accountData.account_balance?toThousands('元',accountData.account_balance):"0"}</b>元</li>
                    <li><span>支付密码：</span>{accountData.account_password&&accountData.account_password!="null"?"已设支付密码":"未设支付密码"}

                      <Link  to="service/account/home/setpassword" style={{marginLeft:25}}>{accountData.account_password&&accountData.account_password!="null"?"重设支付密码":"设置支付密码"}</Link>

                    </li>
                  </ul>
                </Col>
                <Col span="4">
                  <div className="pay-qr">
                    <ReactQRCode size={112} value={`http://h5.market.chinafintech.com.cn/recharge/index.html?account=${accountData.account_no}`}/>
                    <div className="text-center">微信扫描二维码，立即充值</div>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card title={ <div className="data-item">
                    <div className="data-icon">
                      <i className="fa fa-calendar"/>
                    </div>
                    <div className="data-text">

                      <MonthPicker placeholder=""
                                   defaultValue={moment(new Date(),'YYYY-MM')}
                                   allowClear={false}
                                   onChange={this.onDateChange}
                                   disabledDate={this.disabledDate}
                      />
                    </div>

                  </div>}>
              <Row>
                <Col span="6">
                  <div className="data-item icon32">
                      <i className="fa fa-download"/>

                    <div className="data-text">
                      <p className="d-title text">入账金额（元）</p>
                      <p className="d-number d-amount">{fwq_statistics.incomeSum?toThousands('元',fwq_statistics.incomeSum):"0"}</p>
                    </div>
                  </div>
                </Col>
                <Col span="6">
                  <div className="data-item icon32">

                      <i  className="fa fa-external-link"/>

                    <div className="data-text">
                      <p className="d-title text">支出金额（元）</p>
                      <p className="d-number d-price">{fwq_statistics.disburseSum?toThousands('元',fwq_statistics.disburseSum):"0"}</p>
                    </div>
                  </div>
                </Col>
                <Col span="6">
                  <div className="data-item icon32">

                      <i className="fa fa-inbox"/>

                    <div className="data-text">
                      <p className="d-title text">服务订单（笔）</p>
                      <p className="d-number d-price">{fwq_statistics.orderSum?fwq_statistics.orderSum:"0"}</p>
                    </div>
                  </div>
                </Col>
                <Col span="6">
                  <div className="data-item icon32">

                      <i style={{background:"#2DB7F5"}} className="fa fa-inbox"/>

                    <div className="data-text">
                      <p className="d-title text">充值订单（笔）</p>
                      <p className="d-number d-price">{fwq_statistics.chargeSum?fwq_statistics.chargeSum:"0"}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            {showH5&&<h5 style={{marginTop:24}}>账户流水</h5>}
            <Table
              columns={columns}
              url="openApi/serviceAccount/getFw"
              params={paramsFw}
              ref={t=>creatTable=t}
              onLoad={this.onloading}
              style={{marginTop:0}}
              rowKey={'book_no'}
            />
          </div>
          :''
        }
      </Spin>
    )
  }

})
