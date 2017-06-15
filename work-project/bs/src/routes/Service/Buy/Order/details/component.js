
import React from "react";
import {Row,Col,Button} from "antd";
import axios from "axios";
import {Table} from "../../../../../common/Table";
import {amountFormat} from "../../../../../util/helper";
import {hashHistory} from "react-router";
import "./style.scss"
const decimal =require("decimal.js");
export default class Component extends React.Component{
    state={
        item:{}
    }
  getOrderDetail(id) {

        axios.post("openApi/serviceBill/getDetail",{
            order_no:id
        }).then(res=>{
            axios.post("openApi/serviceBill/getList",{
                order_no:id
            }).then(resp=>{
                let info =resp.data[0];
                let detail =res.data[0];
                let item =Object.assign({},info,detail);
                this.setState({item});
            })

        });
    }

    componentWillMount(){
           let id= this.props.location.query.order_no;
           this.getOrderDetail(id);
    }
    render(){
        let item =this.state.item;
        return (

            <div className="service-buy-order-detail">
                <Row className="content" gutter={24}>
                    <Col span={12}><label>订单号：</label>{item.outer_no}</Col>
                    <Col span={12}><label>订单时间：</label>{item.create_time}</Col>
                    <Col span={12}><label>订购内容：</label>{item.product_type==1?"服务产品":item.combo_name}</Col>
                    <Col span={12}><label>订购类型：</label>{item.order_type==1?"标准订购":"续订"}</Col>
                    <Col span={12}><label>计费账户：</label>{user.userName}</Col>
                    <Col span={12}><label>使用者：</label>{user.userName}</Col>
                    <Col span={12}><label>订购状态：</label>{item.order_status==1?<span className="text-danger ">等待付款<Button onClick={()=>hashHistory.push("service/buy/step?id="+item.order_no)} className="margin-left-lg" type="primary">去付款</Button></span>:item.order_status==2?"已付款":"已关闭"}</Col>
                    <Col span={12}><label>付款时间：</label>{item.pay_time||"--"}</Col>
                    <Col span={12}><label>订单金额：</label>{amountFormat(item.order_pay_amount/100)}元</Col>
                    <Col span={12}><label>优惠总金额：</label>{amountFormat(item.order_discount_amount/100)}元</Col>
                    <Col span={12}><label>应付金额：</label>{amountFormat(item.order_real_amount/100)}元</Col>
                    <Col span={12}><label>其他说明：</label>{item.manual_adjust_note||"--"}</Col>
                </Row>

                <Table showPage={false} className="margin-v-lg" fixedParams={this.props.location.query} url="openApi/serviceBill/getDetail" rowKey="product_code" columns={[
                    {
                        title:"订购服务及产品",
                        render:(a,col)=><span>【{col.service_name}】{col.product_name}</span>
                    },{
                        title:"计费单元",
                        dataIndex:"unit_id"
                    },{
                        title:"单价（元）",
                        render:(a,col)=><span>{amountFormat(col.product_market_price/100)}元</span>
                    },{
                        title:"订购数量",
                        dataIndex:"buy_count"
                    },{
                        title:"小计（元）",
                        render:(a,col)=><span>{amountFormat(decimal(col.buy_count).mul(col.product_market_price).div(100))}元</span>
                    },{
                        title:"优惠金额（元）",
                        render:(a,col)=><span>{amountFormat(col.discount_adjust_amount/100)}元</span>
                    }
                ]}/>
            </div>
        )
    }
}