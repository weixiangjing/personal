/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Button, Col, Form, Input, Popconfirm, Radio, Row} from "antd";
import {Table} from "../../../../components/Table";
import {cleanEmpty} from "../../../../util/helper";
import reducer from "./reducer";
import "./index.scss";
import moment from "moment";
const FormItem=Form.Item;

export default class Component extends React.Component {
    render() {
        let {children}=this.props;
        return (<div>
            {children}
            <div style={{display: children ? "none" : "block"}}>
                <SearchForm/>
                <Table
                    extra={<span><Button onClick={()=>this.props.router.push("service/agent/detail")} type={"primary"}>创建服务商</Button><Button
                        className={"margin-left"}>全部导出</Button></span>}
                    url="agent" rowKey="_id" columns={[{
                    title: "服务商名称", dataIndex: "name"
                }, {
                    title: "类型 级别", render: (a, col)=>col.level==1 ? "一级代理商" : "二级代理商"
                }, {
                    title: "Mcode", dataIndex: "mcode"
                }, {
                    title: "联系人", dataIndex: "contactName"
                }, {
                    title: "手机号码", dataIndex: "contactPhone"
                }, {
                    title: "创建时间", render: (a, col)=>moment(col.createTime).format("YYYY-MM-DD HH:mm:ss")
                }, {
                    title: "认证状态", render: (a, col)=>col.hasDealership ? "是" : "否"
                }, {
                    title: "操作",
                    render: (a, col)=> {
                        let status=col.account ? col.account.status : "";
                        let label=status==1 ? "冻结" : "解冻";
                        return (
                            
                            <span>
                            <Popconfirm
                                title={`确认要${label}该服务商吗？`}
                                onConfirm={()=>reducer.toggleStatus(status==1 ? 0 : 1, col.account._id)}
                            >
                                <a >{label}</a>
                            </Popconfirm>
                            <a onClick={()=>this.props.router.push("service/agent/basis/detail?id="+col._id)}
                               className="margin-left">编辑</a>
                        </span>)
                    }
                }]}/>
            </div>
        </div>)
    }
}
const SearchForm=Form.create()(React.createClass({
    render(){
        let {getFieldDecorator}=this.props.form;
        let layout={
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        }
        return (
            <Form >
                <Row className={"service-merchant"}>
                    
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"服务商名称"}>
                            {
                                getFieldDecorator("name")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"Mcode"}>
                            {
                                getFieldDecorator("mcode")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"联系人"}>
                            {
                                getFieldDecorator("contactName")(<Input placeholder="请输入商户手机号"/>)
                            }
                        </FormItem>
                    
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"手机号码"}>
                            {
                                getFieldDecorator("contactPhone")(<Input placeholder="请输入归属服务商"/>)
                            }
                        </FormItem>
                    
                    </Col>
                    
                    <Col lg={8} md={8} sm={12}>
                        <FormItem wrapperCol={{offset: 6, span: 18}}>
                            <Button
                                onClick={()=>Table.getTableInstance().reload(
                                    cleanEmpty(this.props.form.getFieldsValue())
                                )} type={"primary"}>搜索</Button>
                            <Button onClick={()=>this.props.form.resetFields()} className={"margin-left"}>清除</Button>
                        
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        
        )
    }
}))