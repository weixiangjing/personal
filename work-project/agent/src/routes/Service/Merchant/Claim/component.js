/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Radio,Form,Input,Button} from "antd";
import {Table} from "../../../../components/Table";
import {SearchGroupBordered} from "../../../../components/SearchGroup";
const RadioGroup=Radio.Group;
const RadioButton =Radio.Button;
const FormItem =Form.Item;

export default class Component extends React.Component {

    render() {
        return (<div>

            <SearchForm/>
            <Table extraBar={<Button type={"primary"}>门店认领</Button>} url="abc/def" rowKey="a" columns={[
                {
                    title:"工单号",
                    dataIndex:"en"
                },{
                    title:"创建时间",
                    dataIndex:"sn"
                },{
                    title:"门店名",
                    dataIndex:"en"
                },{
                    title:"Mcode",
                    dataIndex:"en"
                },{
                    title:"状态",
                    dataIndex:"en"
                }
            ]}/>

        </div>)
    }
}

const SearchForm =Form.create()(React.createClass({
    renderSearchContent(){
        let {getFieldDecorator} =this.props.form;
        return [
            {
                title:"状态",
                content:<FormItem>{
                    getFieldDecorator("type",{
                        initialValue:"a"
                    })(<RadioGroup>
                        <RadioButton value="a">（全部）</RadioButton>
                        <RadioButton value="b">处理中</RadioButton>
                        <RadioButton value="c">已处理</RadioButton>
                    </RadioGroup>)
                }
                </FormItem>
            },{
                title:"Mcode",
                content:<FormItem>
                    {
                        getFieldDecorator("mcode")(<Input placeholder="门店mcode"/>)
                    }
                </FormItem>
            },{
                title:"售后工单号",
                content:<FormItem>
                    {
                        getFieldDecorator("provider")(<Input placeholder="输入售后工单号"/>)
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