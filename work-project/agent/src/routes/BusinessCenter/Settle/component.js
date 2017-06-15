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
            <Table extraBar={<span><Button type={"primary"}>上传批量结算工单附件</Button><Button className={"margin-left"}>下载全部待结算工单</Button></span>}
                   url="abc/def" rowKey="a" columns={[{
                title: "结算工单号", dataIndex: "en"
            }, {
                title: "创建时间", dataIndex: "sn"
            }, {
                title: "服务商", dataIndex: "en"
            }, {
                title: "账单总金额", dataIndex: "en"
            }, {
                title: "开票总金额", dataIndex: "en"
            }, {
                title: "工单状态", dataIndex: "en"
            }, {
                title: "实付金额", dataIndex: "en"
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

                    <Col lg={6} md={8} sm={12}>
                        <FormItem {...layout}  label={"工单号"}>
                            {
                                getFieldDecorator("agent")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={6} md={8} sm={12}>
                        <FormItem {...layout} label={"工单状态"}>
                            {
                                getFieldDecorator("agent")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={6} md={8} sm={12}>
                        <FormItem {...layout} label={"服务商"}>
                            {
                                getFieldDecorator("agent")(<Input placeholder="请输入商户手机号"/>)
                            }
                        </FormItem>

                    </Col>
                    <Col lg={6} md={8} sm={12}  >
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