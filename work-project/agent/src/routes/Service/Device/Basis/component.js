/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Radio,Form,Input,Button} from "antd";
import {Table} from "../../../../components/Table";
import moment from "moment";
import {SearchGroupBordered} from "../../../../components/SearchGroup";
import {cleanEmpty} from "../../../../util/helper"
const RadioGroup=Radio.Group;
const RadioButton =Radio.Button;
const FormItem =Form.Item;
const deviceType=['MINI','旺POS3','旺POS2'];
const deviceStatus=['正常','维修','退货'];
let mForm ;
export default class Component extends React.Component {

    render() {
        return (<div>

            <SearchForm/>
            <Table extra={<Button>全部导出</Button>} url="device" rowKey="sn" columns={[
                {
                    title:"EN",
                    dataIndex:"en"
                },{
                    title:"SN",
                    dataIndex:"sn"
                },{
                    title:"类型",
                    render:(a,col)=>deviceType[col.deviceType]
                },{
                    title:"入库时间"
                    ,render:(a,col)=>moment(col.createTime).format("YYYY-MM-DD HH:mm:ss")
                },{
                    title:"状态",
                    render:(a,col)=>col.isBind?"已售":"未售"
                },{
                    title:"归属服务商",
                    dataIndex:"agentName"
                },
            ]}/>

        </div>)
    }
}

const SearchForm =Form.create({
    onFieldsChange(props,fields){
        if(fields.deviceType||fields.isBind){
            let value = cleanEmpty(mForm.getFieldsValue());
                Table.getTableInstance().reload(value);
        }
    }
})(React.createClass({
    renderSearchContent(){
        let {getFieldDecorator} =this.props.form;
        return [
            {
                title:"设备类型",
                content:<FormItem>{
                 getFieldDecorator("deviceType",{
                     initialValue:""
                 })(<RadioGroup size="small">
                     <RadioButton value="">（全部）</RadioButton>
                     <RadioButton value="1">MINI</RadioButton>
                     <RadioButton value="2">旺POS2</RadioButton>
                     <RadioButton value="3">旺POS3</RadioButton>
                     
                 </RadioGroup>)
                }
                </FormItem>
            },{
                title:"设备状态",
                content:<FormItem>
                    {
                        getFieldDecorator("isBind",{
                            initialValue:true
                        })(<RadioGroup  size="small">
                            <RadioButton value="">(全部)</RadioButton>
                            <RadioButton value={true}>已售</RadioButton>
                            <RadioButton value={false}>未售</RadioButton>
                        </RadioGroup>)
                    }
                </FormItem>
            },{
                title:"设备归属服务商",
                content:
                <div>
                    <FormItem>
                        {
                            getFieldDecorator("ba",{
                                initialValue:"a"
                            })(<RadioGroup size="small">
                                <RadioButton value="a">我的</RadioButton>
                                <RadioButton value="b">二级服务商</RadioButton>
                            </RadioGroup>)
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator("agentName")(
                                <Input
                                    onPressEnter={()=>{
                                        Table.getTableInstance().reload(cleanEmpty(mForm.getFieldsValue()))
                                    }}
                                    placeholder="输入（二级）服务商名称"/>)
                        }
                    </FormItem>
                </div>
                
            },{
                title:"EN或SN",
                content:<div>
                    <FormItem>
                        {
                            getFieldDecorator("code")(
                                <Input
                                    onPressEnter={(e)=>{
                                        
                                        Table.getTableInstance().reload(cleanEmpty(mForm.getFieldsValue()));
                                    }}
                                    placeholder="输入设备EN号或SN号"/>)
                        }
                    </FormItem>
                </div>
            }
        ]
    },
    render(){
        mForm=this.props.form;
      return (
          <SearchGroupBordered group={this.renderSearchContent()}/>

      )
    }
}))