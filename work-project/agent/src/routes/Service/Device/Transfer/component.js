/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Form, Radio, Input, Button} from "antd";
import {Table} from "../../../../components/Table";
const RadioGroup =Radio.Group;
const RadioButton=Radio.Button;
const FormItem   =Form.Item;
export default class Component extends React.Component {
    render() {
        return (<div>
            <SearchForm/>
            <Table extraBar={<Button type={"primary"}>设备转售</Button>} url="wo" rowKey="no" columns={[{
                title: "转售时间", dataIndex: "en"
            }, {
                title: "转售服务商", dataIndex: "sn"
            }, {
                title: "设备数量", dataIndex: "en"
            }, {
                title: "", dataIndex: "en"
            }, {
                title: "设备数量", dataIndex: "en"
            }, {
                title: "归属服务商", dataIndex: "en"
            },]}/>
        </div>)
    }
}
const SearchForm=Form.create()(React.createClass({
    render(){
        let {getFieldDecorator} =this.props.form;
        return (
            <Form inline>
                <FormItem className={"normal-input"} label={"二级服务商"}>
                    {
                        getFieldDecorator("agent")(<Input/>)
                    }
                </FormItem>
            </Form>

        )
    }
}))