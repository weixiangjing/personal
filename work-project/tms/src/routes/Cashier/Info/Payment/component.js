/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {FoldawayRadioGroup} from "../../../../components/ReactSimpleComponent";
import {Form, Radio, Input,Button} from "antd";
import {Auth,AuthLink} from "../../../../components/ActionWithAuth";
import {cleanEmpty} from "../../../../util/helper";
import {SearchGroupBordered} from "../../../../components/SearchGroup";
import {Table} from "../../../../components/Table";
import {Link,hashHistory} from "react-router";
import {handler} from "./reducer";
import "./layout.scss";
let form;
let mTable;
const SearchForm=Form.create({
    onFieldsChange: (props, fields)=>{
     
        let value =cleanEmpty(form.getFieldsValue());
            if(value.keywords){
                value.keywords=value.keywords.trim();
            }
        mTable.reload(value);
    }
})(React.createClass({
    render(){
        let {getFieldDecorator} = this.props.form;
        let store               =this.props.store;
        let type                =store.get("types");
        let channels            =store.get("channels");
        let total               =store.get("total");
        let current             =store.get("current");
        let loading             =store.get("loading");
        let pageSize            =store.get("pageSize");
        form                    =this.props.form;
        return (<Form ref="forms" className="channel-list">
            <SearchGroupBordered group={[{
                title:"状态",
                content:<Form.Item>
                    {
                        getFieldDecorator("status", {
                            initialValue: ""
                        })(<Radio.Group size="small">
                            <Radio.Button value="">（全部）</Radio.Button>
                            <Radio.Button value="1">可用</Radio.Button>
                            <Radio.Button value="2">已停用</Radio.Button>
                        </Radio.Group>)
                    }
                </Form.Item>
            }, {
                title: "支付方式名称", content: <div>
                    <Form.Item>
                        {
                            getFieldDecorator("keywords")(<Input onPressEnter={()=> mTable.reload(cleanEmpty(form.getFieldsValue()))} style={{width: 200}}
                                                                              placeholder="请输入支付方式名称，按回车搜索"/>)
                        }
                    </Form.Item>

                  
                </div>
            }]}/>


           
           
        </Form>)
    }
}));
export function getPageColumns() {
    return [{
        title: '编号', dataIndex: 'pay_mode_id', width: 150,
    }, {
        title : '支付方式名称',
        render: (a, channel)=><Link
            to={`cashier/info/payment/detail?id=${channel.id}&bid=${channel.pay_mode_id}`}>{channel.pay_mode_name}</Link>
    }, {
        title: "描述", dataIndex:"description"
    }, {
        title:"序号",dataIndex:'sort_num'
    },{
        title    : '状态',
        width    : 100,
        className: "corner-mark",
        render   : (a, channel)=>channel.status==1 ? <span className="text-success"><font
                className="font-lg">.</font>可用</span> :
            <span className="text-danger"><font
                className="font-lg">.</font>停用</span>
    
    }];
}
export default class Component extends React.Component{
    componentWillUpdate(){
        if(handler._reload){
            Table.getTableInstance().reload();
            handler._reload=false;
        }
    }

    render(){
        let {children} =this.props;
        let state =this.storeState;

        return (
            <div>
                {children}
                <div style={{display:children?"none":"block"}}>
                    <SearchForm store={state} {...this.props}/>
                    <Table  extra={  <Auth to="cashier/info/payment/add"><Button onClick={()=>hashHistory.push("cashier/info/payment/detail")}>新增支付方式</Button></Auth>}   ref={(table)=>mTable=table} url="tmsPaymode/query" rowKey="pay_channel_id"
                            columns={getPageColumns()}/>
                </div>
            </div>
        )
    }
}

    

