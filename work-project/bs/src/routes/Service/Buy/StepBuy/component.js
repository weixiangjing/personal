/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import {Table,Row,Col,Input,Icon,Button,Steps,Modal} from "antd";
import {handler,getOrderDetail,pay,getAccountInfo} from "./reducer";
import {amountFormat} from "../../../../util/helper";
import {hashHistory} from "react-router";

import user from "../../../../model/User";
import "./index.scss"
const {RECHARGE_JUMP_URL} =require("../../../../config/url.config");

const billing_cycles=["无", "天", "月", "年"];
const ReactQRCode =require("qrcode.react");

   

export default class Component extends React.Component {

    getRechargeUrl(){
        return `${RECHARGE_JUMP_URL}?account=${user.account_no}`;
    }
    componentWillMount(){
        let id = this.props.location.query.id;
        getOrderDetail(id);
        getAccountInfo();
        let specilStep=this.props.location.query.step;
        if(specilStep){
            handler.$update('step',+specilStep);
        }
    }
    render() {
        let store =handler.$state();
        let item = store.get("item").toJS();
        let current = store.get("step");
        let list =store.get("list").toJS();
        let account= store.get("account").toJS()
        let password =store.get("password");
        let refresh=store.get("refresh");
        let order_no=this.props.location.query.id;
       
        return (<div className="service-buy-step">


            <Steps current={current}>
                <Steps.Step title="确认订单信息"/>
                <Steps.Step title="付款"/>
                <Steps.Step title="订购完成"/>
            </Steps>

            <div className="step" style={{display:current==0?"block":"none"}}>
                <Row className="buy-desc item">
                    <Col span={12}><label>订单号:</label>{item.outer_no}</Col>
                    <Col span={12}><label>订单时间:</label>{item.create_time}</Col>
                    <Col span={12}><label>订购内容:</label>{item.service_name}</Col>
                    <Col span={12}><label>订购类型:</label>标准订购</Col>
                    <Col span={12}><label>计费账户:</label>{account.account_name}</Col>
                    <Col span={12}><label>使用者:</label>{account.account_name}</Col>
                    <Col span={12}><label>订购状态:</label>{item.order_status==1?"待支付":item.order_status==2?"已付款":"已关闭"}</Col>
                    <Col span={12}><label>付款时间：</label>{item.pay_time||"--"}</Col>
                    <Col span={12}><label>订单金额：</label>{amountFormat(item.order_pay_amount/100)}元</Col>
                    <Col span={12}><label>优惠总金额：</label>{amountFormat(item.order_discount_amount/100)}元</Col>
                    <Col span={12}><label>应付金额：</label>{amountFormat(item.order_real_amount/100)}元</Col>
                    <Col span={12}><label>其他说明：</label>{item.manual_adjust_note||"--"}</Col>
                    <Col span={12}><label>订购明细:</label></Col>
                </Row>

                <Table  pagination={false} dataSource={list} className={"cart-items"} columns={[
                    {
                        title:"订购服务及产品",
                        render:(a,col)=><div>
                            <span className="main-title">【{col.service_name}】{col.product_name}</span>
                        </div>
                    },{
                        title:"计费单元",
                        render:(a,{unit_type,unit_id})=><div className="type-id">

                            <Icon  type={unit_type==1?"smile":unit_type==2?"home":unit_type==3?"mobile":"key"}/>
                            <span className="vertical-middle">{unit_id}</span>
                        </div>
                    },{
                        title:"单价",
                        render:(a,col)=><span>{amountFormat(col.product_market_price/100)}</span>
                    },{
                        title:"订购数量",
                        render:(a,col)=>col.buy_count
                    },{
                        title:"计费周期",
                        render:(a,col)=>billing_cycles[col.billing_cycle]
                    },{
                        title:"小计（元）",
                        render:(a,col)=>amountFormat(col.buy_count * col.product_market_price/100)
                    },{
                        title:"优惠金额（元）",
                        render:(a,col)=>col.product_type==2?"--":amountFormat(col.discount_adjust_amount/100)
                    }
                ]}  />
                <div className="over-hide text-center padding-v">
                    <Button onClick={()=>handler.$update("step",1)} size={"large"} type={"primary"} >下一步</Button>
                </div>
            </div>
            <div className="step step-2" style={{display:current===1?"block":"none"}}>
                <div className="step-2-left">
                <div><label>计费账户：</label>{account.account_name}</div>
                <div><label>账户余额：</label>{refresh?<Icon type="loading"/>:amountFormat(account.account_balance/100)}
                    <a onClick={()=>getAccountInfo()} className="margin-left-lg">[ 刷新 ]</a></div>
                <div><label>应付金额：</label><font className="text-danger">{amountFormat(item.order_real_amount/100)}</font></div>
                <div className="buy-action">
                    {
                        account.account_password ?<span>
                                 <label>支付密码：</label>
                    <Input  onChange={(e)=>handler.$update("password",e.target.value)} type="password" style={{width:150}}/>
                    <Button disabled={password.length<6} onClick={()=>{
                        if( account.account_balance<item.order_real_amount){
                            Modal.info({
                                title:"提示",
                                content:"您的账户余额不足以支付此订单，请充值后再支付。" +
                                "充值成功后点击刷新余额，查看是否充值成功。"
                            })
                        }else{
                            pay(order_no)
                        }
                        }} type={"primary"} size={"large"}>确认付款</Button>
                            </span>:<span>您尚未设置支付密码<Button onClick={()=>this.props.router.replace(`service/account/home/setpassword?to=service/buy/step&id=${order_no}`)} className={"margin-left"} type={"primary"}>设置支付密码</Button></span>
                    }
                   
                </div>
                </div>
                <div className="pay-qr">
                    <ReactQRCode size={152} value={this.getRechargeUrl()}/>
                    <div className="text-center">微信扫描二维码，立即充值</div>
                </div>
            </div>
            <div className="step step-3" style={{display:current===2?"block":"none"}}>
                <div className="success-icon">
                    <Icon type="check-circle-o" className="text-success v-middle"/>
                    <span className="text-success v-middle margin-left font-md"> 服务订购成功</span>
                </div>
                <div className="order-info">
                    <div><label>订单号：</label>{item.outer_no}</div>
                    <div><label>付款金额：</label>{amountFormat(item.order_real_amount/100)}元</div>
                    <div><label>计费账户：</label>{account.account_name}</div>
                    <div><label>账户余额：</label>{amountFormat(account.account_balance/100)}元</div>
                </div>
                <div className="text-center">
                    <Button onClick={()=>{
                        hashHistory.replace("service/buy/order")
                    }} size={"large"} type={"primary"}>完成</Button>
                </div>
            </div>
        </div>)
    }
}
