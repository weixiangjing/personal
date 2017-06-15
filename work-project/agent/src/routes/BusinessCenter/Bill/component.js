/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Form, DatePicker, Input, Button, Row, Col} from "antd";
import {Table} from "../../../components/Table";
import "./index.scss";
const FormItem   =Form.Item;
export default class Component extends React.Component {
    render() {
        return (<div>
            <SearchForm/>
            <Table extraBar={<span><Button type={"primary"}>全部发布</Button><Button className={"margin-left"} type={"primary"}>创建账单</Button><Button className={"margin-left"}>数据导出</Button></span>}
                   url="abc/def" rowKey="a" columns={[{
                title: "账单号|账单类型", dataIndex: "en"
            }, {
                title: "服务商", dataIndex: "sn"
            }, {
                title: "账单金额", dataIndex: "en"
            }, {
                title: "业务周期", dataIndex: "en"
            }, {
                title: "出账日期", dataIndex: "en"
            }, {
                title: "发布|结算状态", dataIndex: "en"
            }, {
                title: "操作",dataIndex: "en"
            }]}/>
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
            <Form >
                <Row className={"service-merchant"}>

                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout}  label={"账单类型"}>
                            {
                                getFieldDecorator("agent")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"发布状态"}>
                            {
                                getFieldDecorator("agent")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"结算状态"}>
                            {
                                getFieldDecorator("agent")(<Input placeholder="请输入商户手机号"/>)
                            }
                        </FormItem>

                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"业务周期"}>
                            {
                                getFieldDecorator("agent")(<DatePicker.RangePicker/>)
                            }
                        </FormItem>

                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"出账日期"}>
                            {
                                getFieldDecorator("agent")(<DatePicker/>)
                            }
                        </FormItem>

                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"服务商"}>
                            {
                                getFieldDecorator("agent")(<Input placeholder="请输入归属服务商"/>)
                            }
                        </FormItem>

                    </Col>

                    <Col lg={8} md={8} sm={12}  >
                        <FormItem {...layout} className={'search-bar'}>
                            <Button type={"primary"}>搜索</Button>
                            <Button className={"margin-left"}>清除</Button>

                        </FormItem>
                    </Col>
                </Row>
            </Form>

        )
    }
}))