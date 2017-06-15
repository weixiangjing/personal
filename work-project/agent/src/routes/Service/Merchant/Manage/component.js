/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Button, Col, Form, Input, Popconfirm, Radio, Row} from "antd";
import {Table} from "../../../../components/Table";
import {cleanEmpty} from "../../../../util/helper";
import "./index.scss";
import reducer from "./reducer";
const RadioGroup=Radio.Group;
const RadioButton=Radio.Button;
const FormItem=Form.Item;
export default class Component extends React.Component {
    render() {
        let children=this.props.children;
        return (<div>
            {children}
            <div style={{display: children ? "none" : "block"}}>
                <SearchForm/>
                <Table extra={<span><Button onClick={()=>this.props.router.push("service/merchant/manage/detail")}
                                            type={"primary"}>创建门店</Button><Button
                    className={"margin-left"}>全部导出</Button></span>}
                       url="merchant" rowKey="_id" columns={[{
                    title: "门店名称", dataIndex: "name"
                }, {
                    title: "Mcode", dataIndex: "mcode"
                }, {
                    title: "行业", render: (a, col)=> {
                        let classify=col.bizClassify||{};
                        let name=classify.name;
                        if(classify.childClassify) {
                            name+="-"+classify.childClassify.name;
                        }
                        return name||"--";
                    }
                }, {
                    title: "商户手机号", dataIndex: "merMobile"
                }, {
                    title: "绑定设备", dataIndex: "deviceCount"
                }, {
                    title: "归属服务商", render: (a, col)=> {
                        let parent=col.creator||{}
                        return parent.name||"--";
                    }
                }, {
                    title: "操作", render: (a, col)=> {
                        return (
                            <span>
                            <a>工单</a>
                            <a onClick={()=>reducer.resetPassWord(col.storeId)} className="margin-left">重置密码</a>
                            <Popconfirm title="确认要删除该门店吗？" onConfirm={()=>reducer.deleteMerchant(col.storeId)}>
                                <a className="margin-left">删除</a>
                            </Popconfirm>
                        </span>
                        )
                    }
                }]}/>
            </div>
        </div>)
    }
}
const SearchForm=Form.create()(React.createClass({
    handleSubmit(e){
        e.preventDefault();
        Table.getTableInstance().reload(cleanEmpty(this.props.form.getFieldsValue()))
    },
    render(){
        let {getFieldDecorator}=this.props.form;
        let layout={
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        }
        
        return (
            <Form onSubmit={(e)=>this.handleSubmit(e)}>
                <Row className={"service-merchant"}>
                    
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"门店名"}>
                            {
                                getFieldDecorator("name")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"MCODE"}>
                            {
                                getFieldDecorator("mcode")(<Input/>)
                            }
                        </FormItem>
                    </Col>
                    
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"手机号"}>
                            {
                                getFieldDecorator("merMobile")(<Input placeholder="请输入商户手机号"/>)
                            }
                        </FormItem>
                    
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <FormItem {...layout} label={"服务商"}>
                            {
                                getFieldDecorator("belong")(<Input placeholder="请输入归属服务商"/>)
                            }
                        </FormItem>
                    
                    </Col>
                    
                    <Col lg={8} md={8} sm={12}>
                        <FormItem wrapperCol={{offset: 6}}>
                            <Button htmlType={"submit"} type={"primary"}>搜索</Button>
                            <Button onClick={()=>this.props.form.resetFields()} className={"margin-left"}>清除</Button>
                        
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        
        )
    }
}))