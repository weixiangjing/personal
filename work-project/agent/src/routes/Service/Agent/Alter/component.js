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
            <Table  url="abc/def" rowKey="a" columns={[
                {
                    title:"工单号",
                    dataIndex:"en"
                },{
                    title:"申请时间",
                    dataIndex:"sn"
                },{
                    title:"服务商",
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
                title:"工单状态",
                content:<FormItem>{
                    getFieldDecorator("type",{
                        initialValue:"a"
                    })(<RadioGroup>
                        <RadioButton value="a">（全部）</RadioButton>
                        <RadioButton value="b">待审核</RadioButton>
                        <RadioButton value="c">审核通过</RadioButton>
                        <RadioButton value="d">审核不通过</RadioButton>

                    </RadioGroup>)
                }
                </FormItem>
            },{
                title:"服务商",
                content:<FormItem>
                    {
                        getFieldDecorator("provider")(<Input />)
                    }
                </FormItem>
            },{
                title:"工单号",
                content:<FormItem>
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