/**
 *  created by yaojun on 17/2/8
 *
 */

import React from "react";
import {Col, Form, Row, Tabs,Timeline} from "antd";

import "./index.scss";
import reducer from "./reducer";
import IconHeader from "../../../../components/IconHeader/index";
const FormItem=Form.Item;
const TimeLineItem =Timeline.Item;
const layout={labelCol: {span: 6}, wrapperCol: {span: 16}}
const TabPane=Tabs.TabPane;

class DetailTab1 extends React.Component {
    render() {
        let store=reducer.getState();
        let obj=store.get("detail").toJS();
        
        let settlement= obj.settlement||{};
        let license = obj.license||{};
        let protocol=obj.frameworkAgreement||{}
        
        return (
            
            <div>
                <div className="item">
                    
                    <div className="item-title">基本信息</div>
                    <Row>
                        <Col span={12}>
                            
                            <label>授权区域</label>{obj.authorZone}
                        
                        </Col>
                        <Col span={12}>
                            <label>最大库存数</label> {obj.maxStorage}
                        </Col>
                    </Row>
                </div>
                <div className="item">
                    
                    <div className="item-title">联系人</div>
                    <Row>
                        <Col span={12}>
                            
                            <label>姓名</label>{obj.name}
                        
                        </Col>
                        <Col span={12}>
                            <label>手机号码</label> {obj.contactPhone}
                        </Col>
                        <Col span={12}>
                            <label>通讯地址</label>{obj.contactAddress}
                        </Col>
                    
                    
                    </Row>
                    <div className="item">
                        
                        <div className="item-title">经营信息</div>
                        <Row>
                            <Col span={12}>
                                
                                <label>营业执照名称</label>{license.name}
                            
                            </Col>
                            <Col span={12}>
                                <label>营业执照编号</label> {license.no}
                            </Col>
                        
                        
                        </Row>
                    </div>
                    <div className="item">
                        
                        <div className="item-title">结算账号</div>
                        <Row>
                            <Col span={12}>
                                
                                <label>开户行</label>{settlement.depositBank}
                            
                            </Col>
                            <Col span={12}>
                                <label>户名</label> {settlement.name}
                            </Col>
                        
                        
                        </Row>
                    </div>
                    <div className="item">
                        
                        <div className="item-title">框架协议</div>
                        <Row>
                            <Col span={12}>
                                
                                <label>协议名称</label>{protocol.name}
                            
                            </Col>
                            <Col span={12}>
                                <label>生效时间</label> {protocol.createTime}
                            </Col>
                        
                        </Row>
                    </div>
                    
                    <div className="item">
                        <div className="item-title">登录账号</div>
                        <Row>
                            <Col span={12}>
                                <label>登录账号</label> {obj.userName}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
class DetailTab2 extends React.Component{
    render(){
        return (
            
            <div className="item">
        
                <div className="item-title">基本信息</div>
                <Row>
                    <Col span={12}><label>协议名称</label></Col>
                    <Col span={12}><label>协议类型</label> 10</Col>
                    <Col span={12}><label>签约状态</label> 10</Col>
                    <Col span={12}><label>创建时间</label> 10</Col>
                    <Col span={12}><label>生效时间</label> 10</Col>
                    <Col span={12}><label>失效时间</label> 10</Col>
                    <Col span={12}><label>签约主体</label> 10</Col>
                    <Col span={12}><label>签约服务商</label> 10</Col>
                    <Col span={12}><label>服务商类型</label> 10</Col>
                    <Col span={12}><label>服务商级别</label> 10</Col>
                    <Col span={12}><label>分润规则描述</label> 10</Col>
                </Row>
            </div>
        )
    }
}
class DetailTab3 extends React.Component{
    render(){
        return (
            <Timeline>
                <TimeLineItem>dsfdsf</TimeLineItem>
                <TimeLineItem color="red">
                    dfasdf
                    <p>hello word</p>
                </TimeLineItem>
                <TimeLineItem>fsdafsd</TimeLineItem>

            </Timeline>
        )
    }
}

export default class Component extends React.Component {
    componentWillMount() {
        reducer.query(this.props.location.query.id);
    }
    render() {
        return (
            <div className="service-agent-query">
                <IconHeader/>
                <Tabs >
                    <TabPane key="1" tab="基础信息"><DetailTab1/></TabPane>
                    <TabPane key="2" tab="协议"><DetailTab2/></TabPane>
                    <TabPane key="3" tab="操作日志"><DetailTab3/></TabPane>
                </Tabs>
            </div>
        )
    }
}