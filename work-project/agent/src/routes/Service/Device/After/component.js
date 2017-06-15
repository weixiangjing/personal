/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Button, Form, Input, Radio} from "antd";
import {SearchGroupBordered} from "../../../../components/SearchGroup";
import {Table} from "../../../../components/Table";
const RadioGroup=Radio.Group;
const RadioButton=Radio.Button;
const FormItem=Form.Item;
export default class Component extends React.Component {
    render() {
        let {children}=this.props;
        return (<div>
            {children}
            <div style={{display: children ? "none" : "block"}}>
                <SearchForm/>
                <Table
                    extra={<Button onClick={()=>this.props.router.push("service/device/after/apply")}>申请售后服务</Button>}
                    url="wo" rowKey="no" columns={[
                    {
                        title: "售后工单号",
                        dataIndex: "no"
                    }, {
                        title: "创建时间",
                        dataIndex: "createTime"
                    }, {
                        title: "售后类型",
                        dataIndex: "type"
                    }, {
                        title: "售后状态",
                        dataIndex: "status"
                    }, {
                        title: "设备数量",
                        dataIndex: "paper"
                    }, {
                        title: "归属服务商",
                        dataIndex: "agentName"
                    },
                ]}/>
            </div>
        </div>)
    }
}

const SearchForm=Form.create()(React.createClass({
    renderSearchContent(){
        let {getFieldDecorator}=this.props.form;
        return [
            {
                title: "售后类型",
                content: <FormItem>{
                    getFieldDecorator("type", {
                        initialValue: ""
                    })(<RadioGroup>
                        <RadioButton value="">（全部）</RadioButton>
                        <RadioButton value="1">维修</RadioButton>
                        <RadioButton value="2">退货</RadioButton>
                    </RadioGroup>)
                }
                </FormItem>
            }, {
                title: "工单状态",
                content: <FormItem>
                    {
                        getFieldDecorator("status", {
                            initialValue: ""
                        })(<RadioGroup >
                            <RadioButton value="">（全部）</RadioButton>
                            <RadioButton value="1">待处理</RadioButton>
                            <RadioButton value="2">已处理</RadioButton>
                        </RadioGroup>)
                    }
                </FormItem>
            }, {
                title: "售后工单号",
                content: <FormItem>
                    {
                        getFieldDecorator("provider")(<Input />)
                    }
                </FormItem>
                
            }
        ]
    },
    render(){
        return (
            <SearchGroupBordered group={this.renderSearchContent()}/>
        
        )
    }
}))