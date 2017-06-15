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
                    <Button type={"primary"} className={"margin-right"}>创建协议模板</Button>

                </span>
                } url="abc/def" rowKey="a" columns={[
                {
                    title:"协议名称",
                    dataIndex:"en"
                },{
                    title:"类型",
                    dataIndex:"sn"
                },{
                    title:"创建时间",
                    dataIndex:"en"
                },{
                    title:"签约主体",
                    dataIndex:"en"
                },{
                    title:"服务商",
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
                title:"服务商类型",
                content:<FormItem>
                    {
                        getFieldDecorator("status",{
                            initialValue:"a"
                        })(<RadioGroup  size="small">
                            <RadioButton value="a">(全部)</RadioButton>
                            <RadioButton value="b">代理商</RadioButton>
                            <RadioButton value="c">合作伙伴</RadioButton>
                            <RadioButton value="d">直销人员</RadioButton>
                        </RadioGroup>)
                    }
                </FormItem>
            },{
                title:"服务商级别",
                content:<div>
                    <FormItem>
                        {
                            getFieldDecorator("en")(<RadioGroup  size="small">
                                <RadioButton value="a">(全部)</RadioButton>
                                <RadioButton value="b">核心代理</RadioButton>
                                <RadioButton value="c">普通代理</RadioButton>
                            </RadioGroup>)
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