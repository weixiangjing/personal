/**
 *  created by yaojun on 2017/4/20
 *
 */
import React from "react";
import {Row,Col} from "antd";
import {amountFormat} from "../../util/helper";
import "./index.scss"
export default class Component extends React.Component {
    static propTypes={
        items:React.PropTypes.array.isRequired
    }
    render() {
        let {items=[]} =this.props
        return ( <Row gutter={24} className="com-service-product-items">
            {
                items.map(item=>  <Col key={item.product_code} lg={8} md={8} sm={12} xs={24}>

                    <div className="item">
                        <img src={item.service_icon}/>
                        <div className="right-content">
                            <div className="title text-ellipsis">【{item.service_name}】{item.product_name}</div>
                            <div className="desc">{item.product_desc||"--"}</div>
                            <div
                                className="danger">{amountFormat(item.product_market_price/100)}元{item.billing_unit ? "/"+item.billing_unit : ""}</div>
                        </div>
                    </div>
                </Col>)


            }
        </Row>)
    }
}