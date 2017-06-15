/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Form, Select, Input, Button, Row, Col,DatePicker} from "antd";
import {Table} from "../../../../components/Table";
import "./index.scss";
import ComboxInput from "../../../../components/Combox";
const FormItem=Form.Item;
export default class Component extends React.Component {
    render() {
        return (<div>
            <SearchForm/>
            <Table extraBar={<span><Button className={"margin-left"}>全部导出</Button></span>}
                   url="abc/def" rowKey="a" columns={[{
                title: "服务商", dataIndex: "en"
            }, {
                title: "门店名称", dataIndex: "sn"
            }, {
                title: "Mcode", dataIndex: "en"
            }, {
                title: "交易笔数", dataIndex: "en"
            }, {
                title: "交易总金额", dataIndex: "en"
            }, {
                title: "操作", dataIndex: "en"
            }]}/>
        </div>)
    }
}
const SearchForm=Form.create()(React.createClass({
    render(){
        let {getFieldDecorator} =this.props.form;
        let layout              ={
            labelCol: {span: 6}, wrapperCol: {span: 18}
        }
        return (
            <Form >
                <Row className={"service-merchant"}>

                    <Col lg={6} md={8} sm={12}>
                        <ComboxInput selects={
                            <FormItem>
                                {
                                    getFieldDecorator("abc",{
                                        initialValue:"1"
                                    })(<Select >
                                        <Select.Option value="1">mcode</Select.Option>
                                        <Select.Option value="2">服务商</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        } input={
                            <FormItem  >
                                {
                                    getFieldDecorator("agent")(<Input placeholder="请输入服务商名称"/>)
                                }
                            </FormItem>
                        }/>

                    </Col>
                    <Col lg={6} md={8} sm={12}>
                        <FormItem {...layout} label={"交易时间"}>
                            {
                                getFieldDecorator("df")(<DatePicker.MonthPicker format="YYYY-MM"/>)
                            }
                        </FormItem>
                    </Col>

                    <Col lg={6} md={8} sm={12}>
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