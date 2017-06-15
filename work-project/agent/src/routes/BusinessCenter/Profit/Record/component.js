/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Form, Input,Row,Col, Button} from "antd";
import "./index.scss";
const FormItem   =Form.Item;
export default class Component extends React.Component {
    render() {
        return (<div className="business-center-record">
            <SearchForm/>

            <div className="item">
                <div className="title">交易基本信息</div>
                <Row>
                    <Col span={8}><label>交易流水号：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>交易创建时间：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>交易完成时间：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>支付方式：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>支付通道：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>交易类型：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>交易金额：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>分润金额：</label>{1231222222222222222}</Col>
                </Row>
            </div>
            <div className="item">
                <div className="title">门店/终端</div>
                <Row>
                    <Col span={8}><label>MCODE：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>门店名称：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>终端EN号：</label>{1231222222222222222}</Col>
                    <Col span={8}><label>终端交易位置：</label>{1231222222222222222}</Col>

                </Row>
            </div>
        </div>)
    }
}
const SearchForm=Form.create()(React.createClass({
    render(){
        let {getFieldDecorator} =this.props.form;
        let layout ={
            labelCol:{span:6},
            wrapperCol:{span:18}
        }
        return (
            <Form inline >

                        <FormItem   label={"流水号"}>
                            {
                                getFieldDecorator("agent")(<Input/>)
                            }
                        </FormItem>

                        <FormItem >
                            <Button type={"primary"}>搜索</Button>
                            <Button className={"margin-left"}>清除</Button>

                        </FormItem>

            </Form>

        )
    }
}))