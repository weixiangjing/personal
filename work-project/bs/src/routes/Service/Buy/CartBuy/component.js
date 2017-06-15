/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import axios from "axios";
import {Row, Col, Input, Icon, Button, Popconfirm, message} from "antd";
import user from "../../../../model/User";
import {downloadUrl} from "../../../../config/api";
import {DeviceSelect, MCodeSelect} from "../../../../components/Select/ServiceType";
import CartUtil from "../../../../model/CartUtil";
import {amountFormat} from "../../../../util/helper";
import {hashHistory} from "react-router";
import "./index.scss";
const decimal=require("decimal.js");
export default class Component extends React.Component {
    myServiceList=null;
    renew=false;
    componentWillMount() {
        this.renew=this.props.location.query.renew;
        
        this.animationListener=this.animationListener.bind(this);
        let data=CartUtil.getCartData();
        data=data.map(item=>item.service_code).join(",")
        axios.post("openApi/purchasedService/getServiceList", {
            service_use_id: user.userId,
            service_codes: data,
            service_status:"2"
        }).then(res=>this.myServiceList=res.data);
    }
    
    animationListener() {
        let data=CartUtil.getCartData();
        let product=data[0].serviceProduct;
        let flag=false;
        
        if(product) {
            flag=true;
        } else {
            product=data;
        }
        product.forEach(item=>item._error=0);
        if(flag) {
            CartUtil.setCartData(data)
        } else {
            CartUtil.setCartData(product);
        }
        
        this.hint.removeEventListener('animationend', this.animationListener, false);
        this.change()
    }
    
    componentDidUpdate() {
        this.hint=document.querySelector(".unit-id-error");
        if(!this.hint) return;
        this.hint.addEventListener("animationend", this.animationListener, false);
        
    }
   
    search(serviceCode, unitId, groupName) {
        if(this.myServiceList.length==0) return false;
        
        if(!groupName){return }
        // 根据服务code 来筛选
        let group=this.myServiceList.filter(obj=>groupName==obj.product_group_name);
        let findItem;
        for (let i=0;i<group.length;i++){
            let groupItem =group[i];
                findItem = groupItem.unit_services.find(item=>item.unit_id==unitId);
           if(findItem){
              return findItem;
           }
        }
    }
    
    state={
        change: 0
    }
    
    change(total) {
        this.setState({change: this.state.change+1});
        if(typeof total!=="undefined") {
            window.__header.setState({num: total});
        }
        
    }
    
    add(index) {
        let data=CartUtil.getCartData();
        data[index].num+=1;
        CartUtil.setCartData(data);
        this.change(CartUtil.getTotal(data));
    }
    
    sub(index) {
        this.change(CartUtil.subFromCart(index))
    }
    
    remove(index) {
        this.change(CartUtil.removeFromCart(index))
    }
    
    clear() {
        CartUtil.setCartData([]);
        this.change(0);
    }
    
    totalAmount(data, isProduct, isDiff) {
        
        // 获取节省价格
        if(isDiff) {
            return amountFormat(Math.abs(getProductPrice()-getPackagePrice())/100)
        }
        
        
        if(isProduct) {
            return amountFormat(getProductPrice()/100);
        } else {
            return amountFormat(getPackagePrice()/100);
        }
        function getProductPrice() {
            let amount=0;
            for(let i=0; i<data.length; i++) {
                let item=data[i];
                amount=decimal(isProduct?item.num:item.product_quantity).mul(item.product_market_price).plus(amount).valueOf()
            }
            
            return amount;
        }
        
        function getPackagePrice() {
            data=CartUtil.getCartData();
            
            return data[0].product_market_price
        }
        
    }
    
    setUnitType(item, index, value, isProduct) {
     
        let unit=this.search(item.service_code, value, item.product_group_name);
        setUnit.call(this);
        function setUnit(check, flag) {
            let data=CartUtil.getCartData();
            let list=[]
            if(!isProduct) {//package
                list=data[0].serviceProduct;
            } else {
                list=data;
            }
            item.unit_id=value;
            item.unit_name="--";
            
            if(unit) {
                item.placeholder=unit.current_service_exp_date;
            } else {
                if(!value){
                    item.placeholder=""
                }else{
                    item.placeholder="订购后"
                }
                
            }
            
            list[index]=item;
            if(!isProduct) {
                data.serviceProduct=list;
            }
            CartUtil.setCartData(data);
            this.change();
        }
    }
    
    createOrder(productOnly) {
        let data=CartUtil.getCartData();
        let send={}
        send.product_type=productOnly ? "1" : "2";//服务产品;
        send.outer_sys_no=new Date().getTime()+Math.random().toString().slice(2,9);
        //send.service_buyer_id=send.service_user_id=user.userId;
        //send.service_buyer_name=send.service_user_name=user.userName;
        //send.service_buyer_type="1"// 商户平台
        let products=productOnly ? data : data[0].serviceProduct;
        if(!productOnly) {
            send.combo_code=data[0].combo_code;
        }
        let isUnitError=false;
        send.product_unit=products.map(item=> {
            let obj={};
            obj.unit_type=item.unit_type;
            obj.unit_id=item.unit_type==1 ? user.userId : item.unit_id;
            obj.unit_name=item.unit_name||"--";
            obj.billing_mode=item.billing_mode;
            item._error=0
            
            if(!obj.unit_id) {
                isUnitError=item
                item.placeholder="";
                item._error=1;
            }
            obj.product_code=item.product_code;
            
            obj.buy_count=item.num;
            return obj;
        });
        if(isUnitError) {
            let data=CartUtil.getCartData();
            if(productOnly) {
                CartUtil.setCartData(products);
            } else {
                data[0].serviceProduct=products;
                CartUtil.setCartData(data);
            }
            this.change();
            return;
        }
        
        this.getAccountInfo(send);
        
    }
    
    addItemWithUnit(item, index) {
        let data=CartUtil.getCartData();
        item.id=Math.random().toString().slice(2)
        data.splice(index+1, 0, item);
        CartUtil.setCartData(data);
        this.change(data.length);
    }
    
    getAccountInfo(send) {
        axios.post("openApi/serviceAccount/get", {
            bind_customer_no: user.userId
        }).then(res=> {
            let account=res.data[0];
            axios.post("openApi/serviceBill/create", send).then(res=> {
                let order_no=res.data[0].order_no;
                if(account) {
                    message.success("订单创建成功");
                    CartUtil.clear();
                    this.props.router.push(`service/buy/step?id=${res.data[0].order_no}`);
                } else {
                    this.props.router.push({
                        pathname: "service/account/home/setpassword",
                        search: `?to=service/buy/step&id=${order_no}&phone=${user.phone}`,
                    });
                }
            })
        })
    }
    
    render() {
        let data=CartUtil.getCartData();
        
        let isEmpty=data.length==0;
        if(isEmpty) {
            return <EmptyCart/>
        }
        let combo_name=data[0].combo_name
        let isProductOnly=!!data[0][CartUtil.CART_PRODUCT_KEY];
        if(!isProductOnly) {
            data=data[0].serviceProduct;
        }
        
        return (<div className="service-cart-buy">
            <Row className="buy-desc item">
                
                <Col className={"text-ellipsis"}
                     span={12}><label>订购内容:</label>{isProductOnly ? "服务产品" : combo_name}</Col>
                <Col span={12}><label>订购类型:</label>标准订购</Col>
                <Col span={12}><label>计费账户:</label>{user.userName}</Col>
                <Col span={12}><label>使用者:</label>{user.userName}</Col>
            
            </Row>
            
            {/*Header*/}
            <Row className="service-cart-items-header" gutter={24}>
                <Col span={6}>服务产品及名称</Col>
                <Col span={7}>指定计费单元</Col>
                <Col span={3}>单价（元）</Col>
                <Col span={4}>订购数量</Col>
                <Col span={4}>小计（元）</Col>
            </Row>
            {
                data.map((col, index)=> {
                    
                    let unit=col.unit_type;
                    let placeholderMap={
                        2: "请输入门店Mcode", 3: "请输入设备en", 4: "请输入应用内账号"
                    }
                    let iconMap={
                        1: "smile", 2: "home", 3: "mobile", 4: "key"
                    }
                    let isSameProduct=index>0 ? data[index-1].product_code==col.product_code : false;
                    let isLastInGroup=index<data.length-1 ? data[index+1].product_code!=col.product_code : true;
                    return (
                        <Row
                            className={"service-cart-item "+(isSameProduct ? "service-cart-same-item " : "")+(isLastInGroup ? "service-cart-group-last-item" : "")}
                            key={col.id} gutter={24}>
                            <Col style={{visibility: isSameProduct ? "hidden" : "visible"}} span={6}>
                                <div className="title-icon">
                                    <img className="product-icon"
                                         src={ decodeURIComponent(col.service_icon)}/>
                                    <p title={col.service_name}
                                       className="main-title text-ellipsis">{col.service_name}</p>
                                    <p title={col.product_name}
                                       className="sec_title text-ellipsis">{col.product_name}</p>
                                </div>
                            </Col>
                            
                            <Col span={7}>
                                <div className="type-id">
                                    <Icon className="left-icon hover-pointer" type={iconMap[unit]}/>
                                    <div>
                                        
                                        {
                                            col.unit_type==2 ? <MCodeSelect
                                                    value={col.unit_id}
                                                    onChange={(e)=>this.setUnitType(col, index, e, isProductOnly)}
                                                    className="unit-id-select" inForm={false}/>
                                                : col.unit_type==3 ? <DeviceSelect
                                                        value={col.unit_id}
                                                        onChange={(e)=>this.setUnitType(col, index, e, isProductOnly)}
                                                        className="unit-id-select" inForm={false}/>
                                                    : col.unit_type==4 ? <Input style={{width: 200}}
                                                                                onChange={(e)=>this.setUnitType(col, index, e.target.value, isProductOnly)}
                                                                                placeholder={placeholderMap[unit]}/>
                                                        : user.userName
                                        }
                                        
                                            <div
                                                className={`${index} link-color  ${(!col.placeholder&&col._error==1) ? "animated shake unit-id-error" : ""}`}>{
                                                col.placeholder ? `自${col.placeholder} 起计费` : placeholderMap[col.unit_type]
                                            }</div>
                                        
                                        
                                    </div>
                                    {
                                        ((col.unit_type==2||col.unit_type==3)&&isProductOnly)&&
                                        <Icon onClick={()=>this.addItemWithUnit(col, index)}
                                              className="right-icon hover-pointer" type="plus-circle"/>
                                    }
                                
                                </div>
                            </Col>
                            <Col span={3}>{amountFormat(col.product_market_price/100)}</Col>
                            <Col span={4}><span className="action-bar">
                        {
                            isProductOnly&&
                            <Button size="small" onClick={()=>this.sub(index)}><Icon type="minus"/></Button>
                        }
                                <Button style={{width: 30}}
                                        size="small">{isProductOnly?col.num:col.product_quantity}</Button>
                                {
                                    isProductOnly&&
                                    <Button size="small" onClick={()=>this.add(index)}><Icon type="plus"/></Button>
                                }

                    </span></Col>
                            <Col span={4}><span className="remove">
                        <font className="text-danger font-md ">
                            {
    
    
                                amountFormat(decimal(isProductOnly?col.num:col.product_quantity).mul(col.product_market_price).div(100).valueOf())
    
                            }</font>
                                {
                                    isProductOnly&&<Popconfirm title="确定要移除该商品吗？" onConfirm={()=>this.remove(index)}>
                                        <Icon className="pull-right hover-pointer" type="minus-circle"/>
                                    </Popconfirm>
                                }

                    </span></Col>
                        </Row>)
                })
            }
            
            
            <div className="over-hide padding-v margin-top">
                <span className=" pull-right text-danger">
                    <span className="font-md">总计：</span><span
                    className="font-xlg">{this.totalAmount(data, isProductOnly)}</span><span
                    className="font-md"> 元</span></span>
                <span style={{marginRight: 100}} className="pull-right text-success margin-top-lg">
                    {
                        !isProductOnly&&
                        <span className="font-md">套餐已节省： {this.totalAmount(data, undefined, true)}元</span>
                    }
                </span>
            </div>
            
            <div className="over-hide padding-v service-cart-bar">
                <Button onClick={()=> {
                    this.createOrder(isProductOnly);
                }} size={"large"} type={"primary"} className={"pull-right"}>下订单</Button>
                
                <Popconfirm title="确认要清空购物车吗？" onConfirm={()=>this.clear()}>
                    <a className="pull-right margin-right-lg clear-cart">清空购物车</a>
                </Popconfirm>
            </div>
        
        </div>)
    }
}
class EmptyCart extends React.Component {
    render() {
        return (
            <div className="service-empty-cart">
                <img src={require("./assets/shopping_cart.png")}/>
                <div className="margin-top">购物车是空的</div>
                <div>
                    <Button onClick={()=>hashHistory.replace("service/buy/product")}>选购产品</Button>
                    <Button onClick={()=>hashHistory.replace("service/buy/package")}>选购套餐</Button>
                </div>
            </div>
        )
    }
}
