/**
 *  created by yaojun on 16/12/13
 *
 */
  


import React from "react";
import {Card,Row,Col,Icon} from "antd";
import {Icon60} from "../../../components/HomeIcon";
import {numberFormat} from "../../../util/helper"
import classNames from "classnames"
import moment from "moment";
import {
    getChannelCount,
    getChannelCountWithPayMode,
    getClosedChannelCount,
    getDeviceCount,
    getLatelyStore,
    getRankingOfEmployee,
    getStoreCount
} from "./model";

import "./home.scss";
    

export default class HomeIndex extends React.Component{
    state={
        channelCount:0,
        deviceCount:0,
        storeCount:0,
        closeChannelCount:0,
        todayStores:0,
        storesCount:[],
        ranks:[],
        stores:[],
        responseDate:new Date()
    }
    componentWillMount(){
        let today =moment(new Date).format("YYYY-MM-DD")+" 00:00:00";
        let now =moment(new Date).format("YYYY-MM-DD")+" 23:59:59"
        let range={create_time_begin:today,create_time_end:now};
        getChannelCount().then(count=>this.setState({channelCount:count}));
        getClosedChannelCount().then(count=>this.setState({closeChannelCount:count}));
        getDeviceCount().then(count=>this.setState({deviceCount:count}));
        getStoreCount().then(count=>this.setState({storeCount:count}));
        getLatelyStore({pageSize:10}).then(res=>this.setState({stores:res.data,responseDate:res.date}));
        getStoreCount(range).then(res=>this.setState({todayStores:res}))
        getRankingOfEmployee({pageSize:10,create_time:today}).then(res=>this.setState({ranks:res.data}));
        getChannelCountWithPayMode(range).then(res=>this.setState({storesCount:res.data}));
    }
    render(){
        let icon = {background:"url(img/icon_60.png)"}
        let {channelCount,deviceCount,storeCount,closeChannelCount,storesCount,ranks,stores,todayStores,responseDate} =this.state;
       return (<div className="cashier-home">
           <Card title="累计配置数据" >
              <Row>
                  <Col sm={12} md={6}>
                      <div className="data-item">
                          <Icon60 type={"home"} className="data-icon"/>
                          <div className="data-text">
                              <p className="d-title text">已配置门店总数(个)</p>
                              <p className="d-number">{numberFormat(storeCount)}</p>
                          </div>
                      </div>
                  </Col>
                  <Col sm={12} md={6}>
                      <div className="data-item">
                          <Icon60 type={"device"} className={"data-icon"}/>
                          <div className="data-text">
                              <p className="d-title">已配置设备总数(台)</p>
                              <p className="d-number">{numberFormat(deviceCount)}</p>
                          </div>
                      </div>
                  </Col>
                  <Col  sm={12} md={6}>
                      <div className="data-item">
                         <Icon60 type={"stat"} className={"data-icon"}/>
                          <div className="data-text">
                              <p className="d-title">可用通道(个)</p>
                              <p className="d-number">{numberFormat(channelCount)}</p>
                          </div>
                      </div>
                  </Col>
                  <Col sm={12}  md={6}>
                      <div className="data-item">
                          <Icon60 type={"stat-warn"} className={"data-icon"}/>
                          <div className="data-text">
                              <p className="d-title">已关闭通道(个)</p>
                              <p className="d-number">{numberFormat(closeChannelCount)}</p>
                          </div>
                      </div>
                  </Col>
              </Row>
           </Card>
           <Card  title="今日配置数据">
               <Row>
                   <Col className={"today-data"} md={6}>
                       <div className="data-item">
                           <Icon60 type={"home"} className={"data-icon"}/>
                           <div className="data-text">
                               <p className="d-title">已配置门店总数(个)</p>
                               <p className="d-number">{numberFormat(todayStores)}</p>
                           </div>
                       </div>
                   </Col>
                   <Col md={18}>
                       <Row>
                           {
                               storesCount.slice(0,5).map(item=>(
                                   <Col key={item.pay_mode_id} span={4}>
                                       <div className="data-text">
                                           <p className="d-title">{item.pay_mode_name}(个)</p>
                                           <p className="d-number">{numberFormat(item.configStoreCount)}</p>
                                       </div>
                                   </Col>
                               ))
                           }
                       </Row>
                   </Col>
               </Row>
           </Card>
           <Row gutter={15}>
               <Col sm={24} md={16}>
                   <Card title="最近配置过的门店">
                       <ul>
                           {
                               stores.map((item,index)=>{

                                   let create_time =moment(item.create_time);
                                   let hours= Math.abs(create_time.diff(responseDate)/1000/3600);
                                   let className=hours<12?"bg-orange":"bg-light";


                                   return (
                                       <li className="margin-bottom-lg" key={index}>
                                           <Row>
                                               <Col span={1}><i className={classNames([`radius-small`,className])}> </i></Col>
                                               <Col className="text-ellipsis text-grey" span={10}>
                                                   <span className="circle"> </span> [{item.mcode}]  {item.store_name}
                                               </Col>
                                               <Col className="text-ellipsis text-grey" span={5}>
                                                   {item.pay_channel_name}
                                               </Col>
                                               <Col className="text-ellipsis text-light" span={3}>
                                                   {item.userRealName}
                                               </Col>
                                               <Col  className={"text-right text-ellipsis text-light"} span={5}>
                                                   {create_time.from(responseDate)}
                                               </Col>
                                           </Row>
                                       </li>
                                   )
                               })
                           }
                       </ul>
                   </Card>
               </Col>
               <Col sm={24} md={8}>
                   <Card title="今日最积极员工">
                       <ul>
                           {
                               ranks.map((item,index)=>(
                                   <li key={index} className="margin-bottom-lg">
                                       <Row>
                                           <Col span={2}>{index+1}</Col>
                                           <Col className="text-grey" span={16}>{item.userRealName}</Col>
                                           <Col className={"text-right text-success"} span={6}>{item.configCount}次</Col>
                                       </Row>
                                   </li>
                               ))
                           }
                       </ul>
                   </Card>
               </Col>
           </Row>
       </div>)
    }
}
