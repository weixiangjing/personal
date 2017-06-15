/**
 *  created by yaojun on 16/12/19
 *
 */
import React from "react";
import {Form, Row, Col, Input, Button} from "antd";
import ListItem from "../SearchListItem";
import ajax from "axios";
import {cleanEmpty} from "../../../util/helper";
const FormItem = Form.Item;
export default  Form.create()(React.createClass({
    getInitialState(){
        return {list: {total: 0, data: []}}
    },
    handleSubmit(e){
        e.preventDefault();
        let send  = this.props.form.getFieldsValue();
        this.value = send;
        this.fetch(send);
    },
    fetch(send){
        ajax.post("trade/queryList", cleanEmpty(send)).then(res => {
            this.setState({list: res});
        });
    },
    render(){
        const formItemLayout                 = {
            labelCol  : {span: 8},
            wrapperCol: {span: 16},
        };
        let {getFieldDecorator, resetFields} = this.props.form;
        return (<Form className="rule-search-form" onSubmit={this.handleSubmit}>
            
            <Row gutter={15}>
                <Col className={"margin-bottom-lg "} sm={12} md={8} xs={24}>
                    <FormItem {...formItemLayout} label={"交易流水号"}>
                        {
                            getFieldDecorator("trade_sdk_no")(
                                <Input />
                            )
                        }
                    </FormItem>
                </Col>
                <Col className={" margin-bottom-lg "} sm={12} md={8} xs={24}>
                    <FormItem {...formItemLayout} label={"收银订单号"}>
                        {
                            getFieldDecorator("order_trade_no")(
                                <Input placeholder="内部或外部订单系统生成的流水号"/>
                            )
                        }
                    </FormItem>
                </Col>
                <Col className={"  margin-bottom-lg "} sm={12} md={8} xs={24}>
                    <FormItem {...formItemLayout} label={"第三方交易号"}>
                        {
                            getFieldDecorator("third_trade_no")(
                                <Input placeholder="由支付通道、支付平台生成的交易流水号，或参考号"/>
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col className={"text-right margin-bottom-lg "} span={24}>
                    <Button style={{marginLeft: 32}} type="primary" htmlType={"submit"}>搜索</Button>
                    <Button onClick={() => resetFields()} className={"margin-left"}>清除</Button>
                </Col>
            </Row>
            <ListItem onChange={(pa) => this.fetch({...this.value, ...pa})} list={this.state.list}/>
        </Form>)
    }
}))