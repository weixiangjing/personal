/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import {Row, Col,Button,Modal} from "antd";
import ProductItems from "../../../../components/ProductItem";
import {downloadUrl} from "../../../../config/api";
import axios from "axios";
import {amountFormat} from "../../../../util/helper"
import "./index.scss";
import CartUtil from "../../../../model/CartUtil";
import {hashHistory,Link} from "react-router";
import moment from "moment";

import {Spin} from "antd";
export default class Component extends React.Component {
    state={
        item:{
            serviceProduct:[]
        },
        loading:true
    }
    responseDate=Date.now()
    componentWillMount() {
        let id=this.props.location.query.id
        if(!id)return;
        axios.post("openApi/serviceCombo/get", {combo_code: id}).then(res=>{
            this.setState({item:res.data[0],loading:false});
            this.responseDate= res.date;
        })
    }



    render() {
        let item =this.state.item;

        return (
            <Spin spinning={this.state.loading}>
            <div className="service-buy-package">

            <div className="title-bar">
                <div className="main-title">{item.combo_name}</div>
                <div className="amount-bar ">
                    <span className="text-shade">原价：<del>{amountFormat(item.combo_market_price/100)}</del></span>
                    <span className="text-shade">套餐价格：<span className="text-danger">{amountFormat(item.combo_discount_price/100)}</span></span>
                    <Button onClick={()=>{
                        item.num=1;
                        item.product_market_price=item.combo_discount_price;

                        item.serviceProduct.forEach((item=>{
                            item.num=1;
                            item.id=Math.random().toString().slice(2);
                            return item;
                        }))
                        if(CartUtil.hasProduct()){
                            
                            Modal.confirm({
                                title:"提示",
                                content:"购物车不能同时添加产品和套餐，继续添加将清空购物车产品，确认继续？",
                                onOk:()=>{
                                    CartUtil.setCartData([item]);
                                    window.__header.setState({num:1});
                                    hashHistory.push("service/buy/cart")
                                }
                            })
                           
                        }else{
                            CartUtil.setCartData([item]);
                            window.__header.setState({num:1});
                            hashHistory.push("service/buy/cart")
                        }
                    }} disabled={this.responseDate>moment(item.combo_exp_date)} type={"primary"} >立即订购</Button>
                </div>
            </div>
            <div className="left-border-title  margin-v">服务包含产品（{item.serviceProduct.length}）</div>

            <Row gutter={24}>
                {
                    item.serviceProduct.map(item=>  <Col key={item.product_code} lg={8} md={8} sm={12} xs={24}>

                        <div onClick={()=>this.props.router.push(`service/buy/product/add?id=${item.product_code}`)} className="item hover-pointer common-simple-card">
                            <img className="icon" src={decodeURIComponent(item.service_icon)}/>
                            <div className="right-content">
                                <div className="title text-ellipsis sec_title">【{item.service_name}】{item.product_name}
                                    <div
                                        className="danger text-danger">{amountFormat(item.product_market_price/100)}元{item.billing_unit ? "/"+item.billing_unit : ""}</div>
                                </div>
                                <div className="desc margin-top text-shade text-ellipsis">{item.product_desc||"--"}

                                <font className="num">x{item.product_quantity}</font>
                                </div>

                            </div>
                        </div>
                    </Col>)
                }
            </Row>
            <div className="left-border-title margin-top-lg">套餐说明</div>
            <div className="desc text-shade">{item.combo_desc}</div>

            </div></Spin>)
    }
}
