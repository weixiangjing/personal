/**
 *  created by yaojun on 2017/5/17
 *
 */
import React from "react";
import {Form, Button, Icon, Radio, Input,Popover} from "antd";
import {getPayments} from "./reducer";
import {SearchGroupBordered} from "../../../../components/SearchGroup";
import {Table} from "../../../../components/Table";
import {cleanEmpty} from "../../../../util/helper"
import SchemeModalForm from "./modal"
import {Link} from "react-router";
import {CASHIER_PRINTER_TEMPLATE_CUSTOM_SCHEME_ADD} from "../../../../config/auth_func";
import {Auth} from "../../../../components/ActionWithAuth";
const FormItem=Form.Item;
class SearchGroupForm extends React.Component {
    
    handleSearch(){
        setTimeout(()=>{
            let value =this.props.form.getFieldsValue();
            Table.getTableInstance().reload(cleanEmpty(value));
        });
        
    }
    render() {
        let {getFieldDecorator} =this.props.form;
        let initialValue={initialValue: ""}
        return (<Form>
            <SearchGroupBordered group={[
                {
                    title: "适用范围",
                    content: <FormItem>
                        {
                            getFieldDecorator("scope", initialValue)(
                                <Radio.Group onChange={()=>this.handleSearch()} size="small">
                                    <Radio.Button value="">（全部）</Radio.Button>
                                    <Radio.Button value="2">支付通道</Radio.Button>
                                    <Radio.Button value="3">门店</Radio.Button>
                                </Radio.Group>)
                        }
                    </FormItem>
                    
                }, {
                    title: "方案名称",
                    content: <FormItem>
                        {
                            getFieldDecorator("name")(<Input onPressEnter={()=>this.handleSearch()}/>)
                        }
                    </FormItem>
                }
            
            ]}>
            
            </SearchGroupBordered>
        </Form>)
    }
}
const BindSearchForm=Form.create()(SearchGroupForm);
export default class Component extends React.Component {
 
    render() {
        let {children} =this.props;
        return (
            <div>
                {children}
                <div style={{display:children?"none":"block"}}>
                    <BindSearchForm/>
                    <Table extra={
                        <Auth to={CASHIER_PRINTER_TEMPLATE_CUSTOM_SCHEME_ADD}>
                        <Button onClick={()=>SchemeModalForm.getModal().open({print_plan_id:""})} type={"primary"}><Icon  type="plus-circle-o"/>新建打印模板</Button>
                        </Auth>} url="tprintPlan/query" rowKey="" columns={[
                        {title: "方案名称", dataIndex: "name",render:(a,col)=><a onClick={()=>SchemeModalForm.getModal().open(col)}>{col.name}</a>},
                        {title: "适用范围", dataIndex: "scope",render:(a,col)=>col.scope==2?"支付通道":"门店"},
                        {title: "最近更新时间", dataIndex: "update_time"},
                        {title: "状态",className:"corner-mark", dataIndex: "status",render:(a,col)=><span className={col.status==1?"text-success":"text-danger"}><span className="font-lg">.</span>{col.status==1?"可用":"停用"}</span>},
                        {title: "操作", render: (a,col)=><div>
                        
                        
                            {
                                col.scope==2?<Link to={`cashier/print/scheme/range?type=1&id=${col.print_plan_id}&name=${encodeURIComponent(col.name)}`}>适用于通道</Link>
                                    :<Link to={`cashier/print/scheme/range?id=${col.print_plan_id}&name=${encodeURIComponent(col.name)}`}>适用于门店</Link>
                            }
                                <Link className="margin-left-lg" to={`cashier/print/scheme/custom?id=${col.print_plan_id}`}>自定义模板</Link></div>}
                    
                    ]}/>
                   
                </div>
                {
                    !children &&  <SchemeModalForm title="打印方案"/>
                }
            </div>)
    }
}
