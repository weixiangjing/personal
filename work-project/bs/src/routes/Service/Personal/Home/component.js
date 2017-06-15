import React from "react";
import {Card, Row, Col,Icon} from "antd";
import {Link} from 'react-router';
import moment from 'moment';
import "./index.scss";
import {setDateTime} from '../../../../util/helper';
import {getOrderedService,getOrderingService,getService,getUnit,getDueTo} from './reducer';
import user from '../../../../model/User';
export default class Component extends React.Component {
  componentWillMount(){
    const params={
      service_use_id:user.userId,
      //service_user_name:user.userName
    }
    getOrderedService(params);
    getOrderingService(params);
    getService(params);
    getUnit(params);
    getDueTo(params);
  }
  returnDate(start,end){
    const ms=new Date(end)-new Date(start);
    const hours=ms/(1000*60*60);
    if(hours<24){return "今天"};
    if(24<hours<24*30){
      const date=parseInt(hours/24)+"天前";
      return date;
    }
    if(hours>24*30){
      const month=parseInt(hours/(24*30))+"月前";
      return month;
    }
  }
    render(props,state) {
      const expiring=state.get('expiring').toJS();
      const latelypay=state.get('latelypay').toJS();
      const invalid_order_num=state.get('invalid_order_num');
      const product_num=state.get('product_num');
      const unitEn=state.get('unitEn');
      const unitMcode=state.get('unitMcode');
      const due_to_num=state.get('due_to_num');
      const date=state.get('res_date');
      return (<div className="service-stat">

            <Card title="我的服务">

                <Row>
                    <Col lg={7}>
                        <div className="stat-item">
                            <i className="fa fa-file-text"/>
                            <div className="item">
                                <div className="name">待付款订单（笔）</div>
                                <div className="lg-num">{invalid_order_num}</div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="stat-item">
                            <i style={{background:"#2db7f5"}} className="fa fa-folder"/>
                            <div className="item">
                                <div className="name">服务产品</div>
                                <div className="lg-num">{product_num}</div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={3}>
                        <div className="stat-item">
                          <div className="item">
                            <div className="name">其中：</div>
                            <div className="line-d"></div>
                          </div>
                          <div className="item">
                                <div className="name">使用中</div>
                                <div className="lg-num">{product_num}</div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={3}>
                        <div className="stat-item">
                            <div className="item">
                                <div className="name">即将到期</div>
                                <div className="lg-num">{due_to_num}</div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="stat-item">
                          <i className="fa fa-mobile-phone"/>
                            <div className="item _unit">
                                <div className="name">计费单元（个）</div>
                                <div className="lg-num sub-icon">
                                    <span>
                                       <i className="fa fa-mobile small"/>{unitEn}</span>
                                    <span>
                                      <i className="fa fa-home small"/> {unitMcode}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
          <Row>
            <Col span="11">
              <Card title="最近订购产品">
                <ul className="data-item">
                  {latelypay.map((item,index)=>{
                    return(
                      <li key={index}>
                        <b style={{backgroundColor:`${index<4?"#f90":"#999"}`}}></b>
                        <span className="data-text">【{item.service_name}】{item.product_name}</span>
                        <span className="data-date">{this.returnDate(item.update_time,date)}</span>
                      </li>
                    )
                  })}
                  {latelypay.length==0&&<li className="null_data">无数据</li>}
                </ul>
              </Card>
            </Col>
            <Col span="11" className="right_col">
              <Card title="即将到期的">
                <ul className="data-item">
                  {expiring.map((item,index)=>{
                    return(
                      <li key={index}>
                        <Link to={`service/personal/buy?unit_type=${item.unit_type}&unit_id=${item.unit_id}`}>
                          <i className={`fa font-md ${item.unit_type==1?"fa-user":item.unit_type==2?"fa-home":item.unit_type==3?"fa-mobile":"fa-odnoklassniki-square"}`}></i>
                          <span>{item.unit_id}</span>
                        </Link>
                        <span>【{item.service_name}】{item.product_name}</span>
                        <span className={`data-date over-date ${setDateTime(date,item.current_service_exp_date)=="即将结束"?"data-danger":""}`}>{setDateTime(date,item.current_service_exp_date)}</span>
                      </li>
                    )
                  })}
                  {expiring.length==0&&<li className="null_data">无数据</li>}
                </ul>
              </Card>
            </Col>
          </Row>
        </div>)
    }
}
