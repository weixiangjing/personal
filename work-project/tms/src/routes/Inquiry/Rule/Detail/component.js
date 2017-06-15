/**
 *  created by yaojun on 16/12/19
 *
 */
import React from "react";
import {Tabs, Icon, Row, Col, Popover, Timeline,Modal,Button} from "antd";
import {amountFormat} from "../../../../util/helper";
import {Link} from "react-router";
import ajax from "axios";
import "./detail.scss";

import {Icon32} from "../../../../components/HomeIcon";
import {Auth} from "../../../../components/ActionWithAuth";
const AuthConf =require( "../../../../config/auth_func");


import {getTradeType, getTradeStatus,getCardType} from "../../util";
import BMap from "../../../../components/map";
import RefundForm from "./refundForm";
import {pay_dielectric,groupBy} from "../../util"
const TabPane = Tabs.TabPane;

export default class TradeDetail extends React.Component {
    state = {
        echo : {},
        notes: [],
        visible:false,
        refundVisible:false,
        card:null,
        seller_account_card:null
    }
    
  loadAMap(cb) {
   cb();
  }
  
  getCardDetail(){
        if(this.state.card) return ;
        ajax.post("trade/queryDetail",{trade_id:this.props.location.query.id}).then(res=>{
            
            let card =res.data[0].buyer_account||""
            let seller_account =res.data[0].seller_account||"";
           
            let scards=groupBy(seller_account,4)
            let cards=groupBy(card,4);
            
                this.setState({card:cards?cards:"暂无信息",seller_account_card:scards?scards:"暂无信息"});
            }
        ).catch(res=>this.setState({card:"暂无信息",seller_account_card:"暂无信息"}))
  }
    componentWillMount() {
        let trade_id = this.props.location.query.id;
        if (!trade_id)return;
        ajax.post("trade/queryDetail", {trade_id,is_hide:true}).then(res => {
            this.setState({echo: res.data[0]});
            let trade_sdk_no = res.data[0]['trade_sdk_no'];
            if (!trade_sdk_no)return null;
            return ajax.post("tradeLog/queryList", {trade_sdk_no})
        }).then(res => {
            if (!res) return;
            this.setState({notes: res.data});
        })
    }
    
    showBMap(visible){
        // if(visible){
        //     if(!this.state.echo.longitude) return ;
        // }
        
        this.loadAMap(()=>{
            this.setState({visible})
        })
    }

    render() {
        let echo  = this.state.echo;
        let notes = this.state.notes;
        let visible =this.state.visible;
        
        let address =[echo.province,echo.city,echo.area].filter(item=>item).join("-");
          
        const trade_sub_types=['','小额免密']
        return ( <Tabs className={"inquiry-rule-detail"} type="card">
            <TabPane key={1} tab="交易信息">
                <div className="over-hide">
                    <span className="pull-left text-shade">
                         交易流水号:{echo.trade_sdk_no}
                    </span>
                    <Auth to={AuthConf.INQUIRY_ADVANCED_QUERY_DETAIL_REFUND}>
                    <Button type={"danger"} className={"pull-right"} onClick={()=>this.setState({refundVisible:true})}>手工退款</Button>
                    </Auth>
                </div>
                <Row className=" detail-title margin-top-lg">
                    <Col span={4}>
                        <Icon32 type="amount" />
                        
                        <div className="inline-block margin-left">
                            <div className="text-shade">订单金额（元）</div>
                            <div className="font-lg">{amountFormat(echo.order_amount / 100)}</div>
                        </div>
                       
                    
                    </Col>
                    <Col span={4}>
                        <div className="text-shade">交易金额（元）</div>
                        <div className="font-lg">{amountFormat(echo.trade_amount / 100)}</div>
                    
                    </Col>
                    <Col span={4}>
                        <div className="text-shade">优惠总金额（元）</div>
                        <Popover  content={
                            <div  style={{winWith:360}}>
                                <span style={{borderRight:"1px solid #ececec"}} className="inline-block margin-right">
                                    <div className="text-shade">渠道优惠（元）</div>
                                    <div className="text-success font-lg">{amountFormat((echo.pay_channel_discount+echo.pay_platform_discount)/100)}</div>
                                </span>
                                <span style={{borderRight:"1px solid #ececec"}} className="inline-block margin-right">
                                    <div className="text-shade"> 商户优惠（元）</div>
                                   <div  className="text-success font-lg ">
                                        {amountFormat(echo.merchant_discount/100)}
                                   </div>
                                </span>
                                <span  className="inline-block">
                                    <div className="text-shade"> 旺POS平台优惠（元）</div>
                                   <div  className="text-success font-lg ">
                                        {amountFormat(echo.wangpos_discount/100)}
                                   </div>
                                </span>
                            
                            </div>
                        } placement="bottom">
                        <div className="font-lg text-success">
                            {amountFormat((echo.merchant_discount+echo.wangpos_discount+echo.pay_channel_discount+echo.pay_platform_discount )/ 100)}</div>
                        </Popover>
                    </Col>
                    <Col span={4}>
                        <div className="text-shade">手续费（元）</div>
                        <div className="font-lg ">{amountFormat(echo.actual_fee / 100)}</div>
                    </Col>
                    
                  
                    
                    <Col span={4} >
                        <div className="text-shade">商户到账金额（元）</div>
                        <div className="font-lg">{amountFormat(echo.receipt_amount / 100)}</div>
                    </Col>
                </Row>
                
                <div className="detail-item">
                    <div className="item-title">基本属性</div>
                    <Row gutter={15}>
                        <Col span={8}><span className="title"> 交易类型:</span>{getTradeType(echo.trade_type||0)}</Col>
                        <Col span={8}><span className="title"> 交易状态:</span>{getTradeStatus(echo.trade_status||0)}</Col>
                        <Col span={8}><span className="title">交易创建时间:</span>{echo.trade_start_time}</Col>
                        <Col span={8}><span className="title">交易完成时间:</span>{echo.trade_end_time}</Col>
                        <Col span={8}><span className="title">支付方式:</span>{echo.pay_mode_name}</Col>
                        <Col span={8}><span className="title">支付通道:</span>{echo.pay_channel_name}</Col>
                        {/**/}
                        <Col span={8}><span className="title">介质使用方式:</span>{pay_dielectric[echo.pay_dielectric]}</Col>
                        <Col span={8}><span className="title">交易描述:</span>{trade_sub_types[echo.trade_sub_type]||"--"}</Col>

                    </Row>
                </div>
                
                <div className="detail-item">
                    <div className="item-title">订单/交易跟踪 {
                        echo.trade_query_url&&<a href={echo.trade_query_url} target={"_blank"}> [ 通道方交易查询工具 ]</a>
                    }</div>
                    <Row gutter={15}>
                        <Col span={8}><span className="title"> 支付通道流水号:</span>{echo.pay_channel_trade_no||"--"}</Col>
                        <Col span={8}><span className="title"> 支付平台流水号:</span>{echo.pay_platform_trade_no||"--"}</Col>
                        <Col span={8}><span className="title">原交易流水号:</span>{echo.orig_trade_sdk_no||"--"}</Col>
                        <Col span={8}><span className="title">交易参考号:</span>{echo.ref_no||"--"}</Col>
                        <Col span={8}><span className="title">交易凭证号:</span>{echo.vouch_no||"--"}</Col>
                        <Col span={8}><span className="title">交易批次号:</span>{echo.batch_no||"--"}</Col>
                        
                        <Col span={8}><span className="title">授权码:</span>{echo.auth_code||"--"}</Col>
                        <Col span={8}><span className="title">订单号:</span>{echo.order_trade_no||"--"}</Col>
                        <Col span={8}><span className="title">交易调用者:</span>{echo.trade_invoker||"--"}</Col>
                        <Col span={24}><span className="title">订单备注:</span>{echo.description||"--"}</Col>
                    </Row>
                </div>
                
                
               
                {/* map */}
                <Modal visible={visible}
                       title={address||"位置信息"}
                       width={840}
                       onCancel={()=>this.showBMap(false)}
                       onOk={()=>this.showBMap(false)}>
                    <BMap longitude={echo.longitude} latitude={echo.latitude} style={{height: 600,width:800}}/>
                </Modal>
                
           
               
                <RefundForm parent={this}/>
                <div className="detail-item">
                    <div className="item-title">门店/终端</div>
                    <Row gutter={15}>
                        <Col span={8}><span className="title"> MCODE:</span>{echo.mcode||"--"}</Col>
                        <Col span={8}><span className="title"> 门店名称:</span>{echo.store_name||"--"}</Col>
                        <Col span={8}><span  className="title">终端交易位置:</span>
                            {
                               <a className="link-color" onClick={() => {
                                    this.showBMap(true);
                                }}><Icon type="environment"/>{address}</a>
                            }
                          
                        </Col>
                        <Col span={8}><span className="title">终端EN号:</span>{echo.device_en||"--"}</Col>
                        <Col span={8}><span className="title">通道商户号:</span>{echo.merchant_no||"--"}</Col>
                        <Col span={8}><span className="title">通道终端号:</span>{echo.terminal_no||"--"}</Col>
                    </Row>
                </div>
                <div className="detail-item">
                    <div className="item-title">账户信息</div>
                    <Row gutter={15}>
                        <Col span={8}><span className="title"> 收款方账号:</span> <Popover content={<p>无</p>} trigger="click">
                            {echo.seller_account}
                        </Popover>
                        </Col>
                        {
                            echo.pay_mode_id==1006 && <Col span={8}>
                                <span  className="title"> 付款账号:</span>
                                <span>{echo.buyer_account}</span>
                                <Popover trigger="click" title={<div>卡号：{this.state.card?<span className="text-danger">{this.state.card}</span>:<Icon type="loading"/>}</div>} content={
                                    <div>
                                        <p>{echo.bank_name}</p>
                                        <p>{echo.card_name}</p>
                                    </div>
                                } >
                                    <span> [ <a onClick={()=>this.getCardDetail()}>完整信息</a> ]</span>
                                </Popover>
                            </Col>
                        }
                       
                        <Col span={8}><span className="title">卡类型:</span>{getCardType(echo.card_type)||"--"}</Col>
                        <Col span={8}><span className="title">卡组织:</span>{echo.card_org||"--"}</Col>
                        <Col span={8}><span className="title">发卡机构编号:</span>{echo.card_org_code||"--"}</Col>

                    </Row>
                </div>
                <div className="detail-item">
                    <div className="item-title">其它信息</div>
                    <Row gutter={15}>
                        <Col span={8}><span className="title"> 批结算时间:</span>{echo.batch_settle_time||"--"}</Col>
                        <Col span={8}><span
                            className="title"> 批结算状态:</span>{echo.batch_settle_status == 1 ? "未结算" : "已结算"}</Col>
                        <Col span={8}><span className="title">清算时间:</span>{echo.settle_date}</Col>
                        <Col span={8}><span className="title">服务商标识:</span>{echo.service_provider||"--"}</Col>
                        <Col span={8}><span className="title">收银员:</span>{echo.cashier_name}</Col>
                    </Row>
                </div>
            </TabPane>
            
            <TabPane key={2} tab="交易日志">
                <Timeline className="trade-detail-line" >
                    {
                        notes.map((item, index) => {
                            let text =item.log_action?'['+item.log_action+"]"+item.log_data:item.log_data;
                            let array  = text.split(/\s/);
                            return (
                                <Timeline.Item key={index} color={item.log_action_status == 1 ? "blue" : "red"}>
                                    <div className={item.log_action_status == 1 ? "text-info" : "text-danger"}>{item.create_time}</div>
                                    <div className="text">
                                        {array.map((item,i)=>{
                                            return <p key={item+i}>{item}</p>
                                        })}
                                        </div>
                                </Timeline.Item>
                            )
                        })
                    }
                </Timeline>
            </TabPane>
        </Tabs>   )
    }
}
  

    

