/**
 *  created by yaojun on 17/2/8
 *
 */

import React from "react";
import {Button, Col, DatePicker, Form, Input, Radio, Row, Steps} from "antd";
import {ImageUpload} from "../../../../components/ImageUpload";
import AddressSelect from "../../../../components/Select/address";

import "./index.scss";
import reducer from "./reducer";
import IconHeader from "../../../../components/IconHeader/index";
const FormItem=Form.Item;

const layout={labelCol: {span: 6}, wrapperCol: {span: 16}}
class Forms extends React.Component {
    componentWillMount(){
        reducer.getProtocol();
    }
    render() {
        let {getFieldDecorator}=this.props.form;
        let store = reducer.getState();
        let protocol=store.get("protocol");
        let step =store.get("step");
        return (
            <Form onSubmit={(e)=>{e.preventDefault();reducer.submit(this.props.form)}}>
                <div style={{display:step===0?"block":"none"}}>
                    <div  className="item">
                        <div className="item-title">基本信息</div>
                        
                        <Row>
                            <Col span={10}>
                                <FormItem {...layout} label={"服务商名称"}>
                                    {
                                        getFieldDecorator("name")(<Input/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"服务商类型"}>
                                    {
                                        getFieldDecorator("type")(
                                            <Radio.Group>
                                                <Radio value="1">代理商</Radio>
                                                <Radio value="2">合作伙伴</Radio>
                                                <Radio value="3">直销人员</Radio>
                                            </Radio.Group>)
                                    }
                                </FormItem>
                            </Col>
                            
                            <Col span={10}>
                                <FormItem {...layout} label={"服务商级别"}>
                                    {
                                        getFieldDecorator("levelName")(
                                            <Radio.Group>
                                                <Radio value="核心代理">核心代理</Radio>
                                                <Radio value="普通代理">普通代理</Radio>
                                            </Radio.Group>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"代理权"}>
                                    {
                                        getFieldDecorator("hasDealership")(
                                            <Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)
                                    }
                                </FormItem>
                            </Col>
                            
                            <Col span={10}>
                                <FormItem  {...layout} label={"授权区域"}>
                                    {
                                        getFieldDecorator("authorZone")(
                                          <AddressSelect/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"最大库存数"}>
                                    {
                                        getFieldDecorator("maxStorage")(<Input type={"number"}/>)
                                    }
                                </FormItem>
                            </Col>
                        
                        </Row>
                    
                    </div>
                    
                    <div className="item">
                        <div className="item-title">联系人</div>
                        
                        <Row>
                            <Col span={10}>
                                <FormItem {...layout} label={"联系人姓名"}>
                                    {
                                        getFieldDecorator("contactName")(<Input/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"联系人手机号码"}>
                                    {
                                        getFieldDecorator("contactPhone")(<Input />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"通讯地址"}>
                                    {
                                        getFieldDecorator("contactAddress")(<Input />)
                                    }
                                </FormItem>
                            </Col>
                        
                        </Row>
                    </div>
                    <div className="item">
                        <div className="item-title">经营信息</div>
                        
                        <Row>
                            <Col span={10}>
                                <FormItem {...layout} label={"营业执照名称"}>
                                    {
                                        getFieldDecorator("license.title")(<Input/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"营业执照号"}>
                                    {
                                        getFieldDecorator("license.no")(<Input type={"number"}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"经营地址"}>
                                    {
                                        getFieldDecorator("license.address")(<Input type={"number"}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"经营执照附件"}>
                                    {
                                        getFieldDecorator("license.photo")(<ImageUpload/>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    
                    <div className="item">
                        <div className="item-title">结算账号</div>
                        
                        <Row>
                            <Col span={10}>
                                <FormItem {...layout} label={"开户行"}>
                                    {
                                        getFieldDecorator("settlement.depositBank")(<Input/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"户名"}>
                                    {
                                        getFieldDecorator("settlement.name")(<Input />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"开户账号"}>
                                    {
                                        getFieldDecorator("settlement.backCard")(<Input />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"开户申请附件"}>
                                    {
                                        getFieldDecorator("settlement.applyFile")(<ImageUpload/>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    
                    
                    <div className="item">
                        <div className="item-title">框架协议</div>
                        
                        <Row>
                            <Col span={10}>
                                <FormItem {...layout} label={"框架协议附件"}>
                                    {
                                        getFieldDecorator("frameworkAgreement.attachment")(<ImageUpload/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"生效时间"}>
                                    {
                                        getFieldDecorator("frameworkAgreement.effectiveTime")(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...layout} label={"失效时间"}>
                                    {
                                        getFieldDecorator("frameworkAgreement.expirationTime")(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime/>)
                                    }
                                </FormItem>
                            </Col>
                        
                        </Row>
                    </div>
                    <div className="item">
                        <div className="item-title">登录账号</div>
                        
                        <Row>
                            <Col span={10}>
                                <FormItem {...layout} label={"登录账号"}>
                                    {
                                        getFieldDecorator("username")(<Input/>)
                                    }
                                </FormItem>
                            </Col>
                        
                        
                        </Row>
                    </div>
                </div>
                <div style={{display:step===1?"block":"none"}}>
                    <FormItem>
                        {getFieldDecorator("protocol")(
                            <Radio.Group>
                                {
                                    protocol.map(item=>(
                                        <Radio value="1">
                                            <div className="protocol-item">
                                                <div>
                                                    <div>{item.get("title")}</div>
                                                    <div className="before-circle orange">{item.get("type")==1?"交易分润":"销售奖励"}</div>
                                                    <a>查看分润规则</a>
                                                </div>
                                                {/*<div>*/}
                                                    {/*<div> 生效时间：2012-01-01 00：00：00</div>*/}
                                                    {/*<div> 失效时间：2012-01-01 00：00：00</div>*/}
                                                    {/*<div> 自动续签：</div>*/}
                                                {/*</div>*/}
                                            </div>
                                        </Radio>
                                    )).toArray()
                                }
                                
                            </Radio.Group>
                        )}
                    </FormItem>
                </div>
                <Row>
                    <Col span={10}>
                        <FormItem wrapperCol={{offset: 6}}>
                            {
                                step===0
                                ?<Button onClick={()=>reducer.changeStep(1)} type={"primary"}>下一步</Button>
                                :<span>
                                    <Button htmlType={"submit"} type={"primary"}>完成</Button>
                                    <Button onClick={()=>reducer.changeStep(0)} className={"margin-left"}>上一步</Button>
                                </span>
                            }
                            
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const BindForm=Form.create()(Forms);
export default class Component extends React.Component {
 
    render() {
        return (
            <div className="service-agent-detail">
               <IconHeader/>
                <Steps current={reducer.getValue("step")}>
                    <Steps.Step title="录入服务商资料"/>
                    <Steps.Step title="选择业务协议"/>
                </Steps>
                
                <BindForm/>
            </div>
        )
    }
}