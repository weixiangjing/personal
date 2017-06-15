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
            <Table extraBar={
                <span>
                    <Button type={"primary"} className={"margin-right"}>新签约</Button>
                    <Button>全部导出</Button>
                </span>
                } url="abc/def" rowKey="a" columns={[
                {
                    title:"签约服务商",
                    dataIndex:"en"
                },{
                    title:"协议名称|协议订单号",
                    dataIndex:"sn"
                },{
                    title:"协议类型",
                    dataIndex:"en"
                },{
                    title:"生效时间",
                    dataIndex:"en"
                },{
                    title:"失效时间",
                    dataIndex:"en"
                },{
                    title:"状态",
                    dataIndex:"en"
                },{
                    title:"操作",
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
                title:"协议类型",
                content:<FormItem>{
                 getFieldDecorator("type",{
                     initialValue:"a"
                 })(<RadioGroup size="small">
                     <RadioButton value="a">（全部）</RadioButton>
                     <RadioButton value="b">交易分润</RadioButton>
                     <RadioButton value="c">销售奖励</RadioButton>
                 </RadioGroup>)
                }
                </FormItem>
            },{
                title:"签约状态",
                content:<FormItem>
                    {
                        getFieldDecorator("status",{
                            initialValue:"a"
                        })(<RadioGroup  size="small">
                            <RadioButton value="a">(全部)</RadioButton>
                            <RadioButton value="b">未签约</RadioButton>
                            <RadioButton value="c">已生效</RadioButton>
                            <RadioButton value="d">已失效</RadioButton>
                            <RadioButton value="f">已作废</RadioButton>

                        </RadioGroup>)
                    }
                </FormItem>
            },{
                title:"服务商",
                content:<div>
                    <FormItem>
                        {
                            getFieldDecorator("en")(<Input />)
                        }
                    </FormItem>

                </div>
            }
        ]
    },
    render(){
      return (
          <SearchGroupBordered group={this.renderSearchContent()}/>

      )
    }
}))