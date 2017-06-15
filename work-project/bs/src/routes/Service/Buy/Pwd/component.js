/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import {Form, Input, Button, Row, Col} from "antd";
import {handler} from "./reducer";
import "./index.scss";
export default class Component extends React.Component {
    render() {
        let store  =handler.$state();
        let current=store.get("step");
        return (<div className="service-buy-pwd">


            <PwdForm/>


        </div>)
    }
}
const PwdForm=Form.create()(React.createClass({
    render(){
        let {getFieldDecorator} =this.props.form;
        let layout              ={
            labelCol     : {
                span: 4
            }, wrapperCol: {
                span: 10
            }
        }
        return (
            <Form >

                <Form.Item label="短信验证码" {...layout} extra="本操作将向商户的注册手机（138****1234）发送一条短信">
                    <Row gutter={24}>
                        <Col span={18}>
                            {
                                getFieldDecorator("abc")(<Input/>)
                            }
                        </Col>
                        <Col span={6}>
                            <Button>获取验证码</Button>
                        </Col>
                    </Row>

                </Form.Item>
                <Form.Item label="新支付密码" {...layout} >

                    {
                        getFieldDecorator("def")(<Input placeholder="请输入6-10位数字"/>)
                    }

                </Form.Item>
                <Form.Item label="确认支付密码" {...layout} >

                    {
                        getFieldDecorator("dsv")(<Input placeholder="请输入6-10位数字"/>)
                    }

                </Form.Item>
                <Form.Item className="action-bar" label=" " {...layout} >

                    <Button type={"primary"}>确认</Button>
                    <Button className="margin-left">取消</Button>

                </Form.Item>


            </Form>
        )
    }
}))