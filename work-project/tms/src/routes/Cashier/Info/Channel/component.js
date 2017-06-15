/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {FoldawayRadioGroup} from "../../../../components/ReactSimpleComponent";
import {Button, Form, Input, Radio} from "antd";
import {Auth, AuthLink} from "../../../../components/ActionWithAuth";
import {getChannelType} from "../../../../model/PayChannel";
import {cleanEmpty} from "../../../../util/helper";
import {SearchGroupBordered} from "../../../../components/SearchGroup";
import {Table} from "../../../../components/Table";
import {hashHistory, Link} from "react-router";
import {cropTypes, handler, initialPage} from "./reducer";
import "./layout.scss";
let form;
let mTable;
const colorStyles=['', '#2EBA07', '#999999', '#FF9966', '#FF9966'];
const labelEnums=['', '已商用', '已关闭', '研发中', '待商用'];
const SearchForm=Form.create({
    onFieldsChange: (props, fields)=>{
        let value =form.getFieldsValue();
        if(value.pay_channel_name_like){
            value.pay_channel_name_like=value.pay_channel_name_like.trim();
        }
        mTable.reload(cleanEmpty(value));
    }
})(React.createClass({
    componentWillMount(){
        initialPage();
    }, render(){
        let {getFieldDecorator}=this.props.form;
        let store=this.props.store;
        let type=store.get("types");
        let channels=store.get("channels");
        let total=store.get("total");
        let current=store.get("current");
        let loading=store.get("loading");
        let pageSize=store.get("pageSize");
        form=this.props.form;
        return (
            <Form ref="forms" className="channel-list">
                <SearchGroupBordered group={[{
                    title: "支付方式", content: <SearchGroupBordered.Accordion onExpand={cropTypes}>
                        <Form.Item>
                            {
                                getFieldDecorator("pay_mode_id", {
                                    initialValue: ""
                                })(<Radio.Group size="small">
                                    {
                                        [{pay_mode_name: "（全部）", pay_mode_id: ""}].concat(type).map(item=><Radio.Button
                                            key={item.pay_mode_id}
                                            value={item.pay_mode_id}>{item.pay_mode_name}</Radio.Button>)
                                    }
                                </Radio.Group>)
                            }
                        
                        </Form.Item>
                    </SearchGroupBordered.Accordion>
                }, {
                    title: "运营类型", content: <Form.Item>
                        {
                            getFieldDecorator("operation_mode", {
                                initialValue: ""
                            })(<Radio.Group size="small">
                                <Radio.Button value="">（全部）</Radio.Button>
                                <Radio.Button value="1">自营</Radio.Button>
                                <Radio.Button value="2">非自营</Radio.Button>
                                <Radio.Button value="3">混合</Radio.Button>
                            
                            </Radio.Group>)
                        }
                    </Form.Item>
                }, {
                    title: "状态",
                    content: <Form.Item>
                        {
                            getFieldDecorator("status", {
                                initialValue: ""
                            })(<Radio.Group size="small">
                                <Radio.Button value="">（全部）</Radio.Button>
                                <Radio.Button value="1">已商用</Radio.Button>
                                <Radio.Button value="2">已关闭</Radio.Button>
                                <Radio.Button value="3">研发中</Radio.Button>
                                <Radio.Button value="4">待商用</Radio.Button>
                            
                            </Radio.Group>)
                        }
                    </Form.Item>
                }, {
                    title: "通道名称", content: <div>
                        <Form.Item>
                            {
                                getFieldDecorator("pay_channel_name_like")(<Input style={{width: 200}}
                                                                                  placeholder="请输入通道名称，按回车搜索"/>)
                            }
                        </Form.Item>
                        
                        <label className="vertical-middle"> 插件包名或服务地址：</label>
                        <Form.Item >
                            {
                                getFieldDecorator("keywords")(<Input placeholder="插件包名或云端插件服务地址关键字"
                                                                     style={{width: 200}}/>)
                            }
                        
                        </Form.Item>
                    </div>
                }]}/>
                
                
                <Table extra={  <Auth to="cashier/info/channel/add"><Button
                    onClick={()=>hashHistory.push("cashier/info/channel/add")}>新建通道</Button></Auth>}
                       fixedParams={{ascOrDesc: 1}} ref={(table)=>mTable=table} url="tmsPaychannel/getPayChannel"
                       rowKey="pay_channel_id"
                       columns={getPageColumns()}/>
            </Form>)
    }
}));
export function getPageColumns() {
    return [{
        title: '通道号', dataIndex: 'pay_channel_id', width: 150,
    }, {
        title: '通道名称',
        render: (a, channel)=><Link
            to={`cashier/info/channel/query?id=${channel.pay_channel_id}`}>{channel.pay_channel_name}</Link>
    }, {
        title: "运营类型", render: (a, channel)=>getChannelType(channel.operation_mode)
    }, {
        title: '状态',
        width: 100,
        className: "corner-mark",
        render: (a, channel)=>(
            <span style={{color: colorStyles[channel.status]}}>
                <font className="font-lg">.</font>{labelEnums[channel.status]}
                </span>)
    }, {
        title: '支付服务提供商', dataIndex: 'pay_sp_name'
    }, {
        title: '状态更新时间', dataIndex: 'update_time',
    }, {
        title: '操作', render(a, channel, index){
            return (<span className="channel-action">
                    <AuthLink
                        to={`cashier/info/channel/plugin?name=${channel.pay_channel_name}&id=${channel.pay_channel_id}`}/>
                </span>)
        }
    },];
}
export default class Component extends React.Component {
    componentWillUpdate() {
        if(handler._reload) {
            Table.getTableInstance().reload();
            handler._reload=false;
        } else {
            Table.getTableInstance().update();
        }
    }
    
    render() {
        let {children}=this.props;
        let state=this.storeState;
        
        return (
            <div>
                {children}
                <div style={{display: children ? "none" : "block"}}>
                    <SearchForm store={state} {...this.props}/>
                </div>
            </div>
        )
    }
}

    

