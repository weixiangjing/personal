/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import {Form,Input,Row,Col,Button} from "antd";
import {Link} from "react-router";
import {CardTable} from "../../../../common/Table";
import {amountFormat} from "../../../../util/helper"

import "./index.scss"

export default class Component extends React.Component {
    render() {
        let {children} =this.props;
        return (<div className="service-buy-product">
            {children}
            <div style={{display:children?"none":"block"}}>
            <SearchForm/>
            <CardTable  className={"margin-top-lg"} url="openApi/serviceCombo/get" renderContent={(data, tableInstance)=>{
                return <Row  gutter={24} className="package-items">{data.map(item=> {
                    return <Col key={item.combo_code} xl={8} lg={12} md={12} sm={24} xs={24}>


                        <div onClick={()=>this.props.router.push(`/service/buy/package/add?id=${item.combo_code}`)} className="item common-simple-card hover-pointer">

                                <div className="title text-ellipsis ">

                                    {
                                      item._date>new Date(item.combo_exp_date)&&<label className="label label-default margin-right">已失效</label>
                                    }

                                    {item.combo_name}<font className="pull-right danger">{amountFormat(item.combo_discount_price/100)}</font></div>
                                <ul className="margin-top ">
                                    {
                                        item.serviceProduct.map(item=><li className="text-shade combo-item text-ellipsis" key={item.service_code+item.product_code}>
                                            <font className="corner bg-orange"/>
                                            【{item.service_name}】{item.product_name}
                                        <font className="count">x{item.product_quantity}</font>
                                        </li>)
                                    }

                                </ul>

                        </div>

                    </Col>
                })}</Row>
            }}/>
            </div>
        </div>)
    }
}

const SearchForm =Form.create()(React.createClass({
    render(){
        let {getFieldDecorator,getFieldsValue} =this.props.form;
        return <Form layout="inline" onSubmit={(e)=>{
        e.preventDefault();

        let value =getFieldsValue();
        CardTable.getTableInstance().reload(value);
        }
        }>
            <Form.Item >
                {
                    getFieldDecorator("keywords")(<Input style={{width:200}} placeholder="请输入套餐或服务名称的关键字"/>)
                }
            </Form.Item>
            <Form.Item >
                <Button htmlType={"submit"} className={"margin-left-lg"} type={"primary"}>搜索</Button>
            </Form.Item>

        </Form>
    }
}))