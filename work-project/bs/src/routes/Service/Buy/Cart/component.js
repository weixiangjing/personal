/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import {Tabs, Button, Row, Col,Modal} from "antd";
import {hashHistory} from "react-router";
import {getProduct, getService} from "../../../../model/ServiceProduct";
import {amountFormat} from "../../../../util/helper";
import CartUtil from "../../../../model/CartUtil";
import "./index.scss";
const service_types =["--", "基础类", "增值类", "通讯服务类"];
const billing_types =["--", "按用量", "按周期", "一次性"];
const billing_units =["--", "商户", "门店", "设备", "应用内账号"];
const billing_cycles=["无", "天", "月", "年"];
export default class Component extends React.Component {
    state={
        obj: {}
    }
    targetCart=null;
    addBtn    =null;
    rect      ={}

    componentWillMount() {
        getProduct({product_code: this.props.location.query.id}).then(res=> {
            let obj       =res.data[0];
            this.state.obj=obj;
            return getService({service_code: obj.service_code});
        }).then(res=> {
            this.setState({obj: Object.assign({num: 1}, res.data[0], this.state.obj)});
        })
    }

    componentDidMount() {
        this.targetCart=document.querySelector(".service-shopping-cart-icon");
        this.addBtn    =document.querySelector(".service-shopping-cart-add");
    }

    animateAdd() {
        let ele           =this.addBtn.cloneNode();
        let tRect         =this.targetCart.getBoundingClientRect();
        let rect          =this.addBtn.getBoundingClientRect();
        let offset =document.body.scrollTop;
        ele.setAttribute("class", "animate-moving-product");
        ele.style.left=`${rect.left}px`;
        ele.style.top =`${rect.top+offset}px`
        ele.innerText=this.state.obj.product_name;

        document.body.appendChild(ele);
        setTimeout(()=> {
            ele.style.left=`${tRect.left}px`;
            ele.style.top =`${tRect.top}px`;
            setTimeout(()=>{
                ele.innerText='+1';
                ele.setAttribute("class","animate-complete-product");
                setTimeout(()=>{
                    ele.style.transform="scale(0.1,0.1)";
                    setTimeout(()=>document.body.removeChild(ele),300);
                },16);


            },300)
        })
    }
    
    addToCart(e,toCart){
        function setCart(){
            let num=CartUtil.addToCart(this.state.obj);
            window.__header.setState({num});
            this.animateAdd(e.target);
            if(toCart){
                this.props.router.push("service/buy/cart");
            }
        }
        if(CartUtil.hasPack()){
            Modal.confirm({
                title:"提示",
                content:"购物车不能同时添加产品和套餐，继续添加将清空购物车产品，确认继续？",
                onOk:()=>{
                    setCart.call(this);
                    
                }
            })
        }else{
            setCart.call(this)
        }
    }

    render() {
        let item  =this.state.obj;
        let status=item.service_status==1;
        return (<div className="service-cart-detail">


            <div className="goods-content">
                <img className="left-icon" src={decodeURIComponent(item.service_icon)}/>
                <Row className="right-content">
                    <Col className={"main-title"} span={24}>【{item.service_name}】{item.product_name}</Col>
                    <Col span={12}><label>服务类型:</label>{service_types[item.service_type||0]}</Col>
                    <Col span={12}><label>服务提供商:</label>{item.service_provider}</Col>
                    <Col span={12}><label>计费模式:</label>{billing_types[item.billing_mode]}</Col>
                    <Col span={12}><label>计费周期:</label>{billing_cycles[item.billing_cycle]}</Col>
                    <Col span={12}><label>计费单元:</label>{billing_units[item.unit_type]}</Col>
                    <Col span={12}><label>计量总量:</label>{item.billing_total||"--"}</Col>
                    <Col span={12}>
                        <label>服务价格:</label>
                        <font className="text-danger">{amountFormat(item.product_market_price/100)}</font>
                    </Col>
                </Row>
            </div>
            <div className="cart-bar text-center">
                <Button disabled={!status} onClick={(e)=>this.addToCart(e,1)} className={"immediate margin-right"}
                        type={"primary"}>立即订购</Button>
                <Button onClick={(e)=>  this.addToCart(e)} className={"add service-shopping-cart-add"} type={"primary"}>加入购物车</Button>
            </div>


            <Tabs className={"cart-tabs"}>
                <Tabs.TabPane tab="服务介绍" key="1">
                    <div className="item">
                        <div className="title text-desc">
                            产品介绍
                        </div>
                        <div className="desc text-desc">{item.product_desc}</div>
                    </div>
                    <div className="item">
                        <div className="title text-desc">
                            服务介绍
                        </div>
                        <div className="desc text-desc">{item.service_desc}</div>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="服务协议" key="2">
                    <div className="desc text-desc">
                        {(item.service_agreement||"").split(/[\r\n]/).map((item, index)=><p key={index}
                                                                                            dangerouslySetInnerHTML={{__html: item.replace(/\s/g, ()=>"&nbsp;")}}/>)}
                    </div>
                </Tabs.TabPane>
            </Tabs>


        </div>)
    }
}
