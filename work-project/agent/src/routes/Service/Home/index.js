/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import BorderedBox from "./box";
import {Row, Col} from "antd";
import {Icon60} from "../../../components/HomeIcon";
export default class Component extends React.Component {
    render() {
        return (<div>
            <BorderedBox title="设备统计" extra={
                <span>
                    <a>全部服务商</a>
                </span>
            }>
                <Row>
                    <Col lg={6} md={8} sm={12} className="stat-item">
                        <Icon60 className="item icon" type="stat"/>
                        <div className="item ">
                            <div className="name">总数</div>
                            <div className="lg-num">28,801</div>
                        </div>
                    </Col>
                    <Col lg={4} md={8} sm={12} className="stat-item">
                        <div className="item ">
                            <div className="name">已售</div>
                            <div className="lg-num">28,801</div>
                        </div>
                    </Col>
                    <Col lg={4} md={8} sm={12} className="stat-item">
                        <div className="item ">
                            <div className="name">未售</div>
                            <div className="lg-num">28,801</div>
                        </div>
                    </Col>
                    <Col lg={4} md={8} sm={12} className="stat-item">
                        <div className="item min-screen">
                            <div className="name">本月新增</div>
                            <div className="lg-num">28,801</div>
                        </div>
                    </Col>
                    <Col lg={3} md={8} sm={12} className="stat-item">
                        <div className="item ">
                            <div className="name">申请维修</div>
                            <div className="lg-num">111</div>
                        </div>
                    </Col>
                    <Col lg={3} md={8} sm={12} className="stat-item">
                        <div className="item ">
                            <div className="name">申请退货</div>
                            <div className="lg-num">123</div>
                        </div>
                    </Col>
                </Row>
            </BorderedBox>


            <Row className="margin-top-lg" gutter={24}>
                <Col lg={16} md={24} sm={24} className={"margin-top"}>
                    <BorderedBox title="门店统计">

                        <Row>
                        <Col span={8}  className="stat-item">
                            <Icon60 className="item icon" type="stat"/>
                            <div className="item ">
                                <div className="name">申请退货</div>
                                <div className="lg-num">123</div>
                            </div>
                        </Col>
                        <Col span={8}  className="stat-item">
                            <div className="item ">
                                <div className="name">本月新增</div>
                                <div className="lg-num">10</div>
                            </div>
                        </Col>
                        <Col span={8}  className="stat-item">

                            <div className="item ">
                                <div className="name">认领审核中</div>
                                <div className="lg-num">99</div>
                            </div>
                        </Col>
                        </Row>
                    </BorderedBox>
                </Col>
                <Col lg={8} md={24} sm={24} className={"margin-top"}>
                    <BorderedBox title="服务商统计">
                        <Row>
                            <Col span={12}  className="stat-item ">
                                <Icon60 className="item icon" type="stat"/>
                                <div className="item ">
                                    <div className="name">总数</div>
                                    <div className="lg-num">123</div>
                                </div>
                            </Col>
                            <Col span={12}  className="stat-item">
                                <div className="item ">
                                    <div className="name">本月新增</div>
                                    <div className="lg-num">10</div>
                                </div>
                            </Col>
                        </Row>
                    </BorderedBox>
                </Col>

            </Row>
        </div>)
    }
}

