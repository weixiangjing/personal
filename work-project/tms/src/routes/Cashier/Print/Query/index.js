/**
 *  created by yaojun on 2017/5/17
 *
 */
import React from "react";
import {Form, Button, Icon} from "antd";
import {handler, getPayments} from "./reducer";
import {SearchItemWithRadio, SearchItemWithInput, SearchGroupBorder} from "../../../../components/SearchGroupBorder";
import {Table} from "../../../../components/Table";
import {cleanEmpty} from "../../../../util/helper"
import {CASHIER_PRINTER_TEMPLATE_PRESETS_ADD} from "../../../../config/auth_func";
import {Auth} from "../../../../components/ActionWithAuth";
import {Link, hashHistory} from "react-router";

const trade_type=['', '消费', '消费撤销', '退款', '', '预授权', '预授权撤销', '预授权完成', '', '预授权完成撤销'];
const print_type=['', '商户联', '持卡人联', '银行存根联'];
let mForm=null;
class SearchGroupForm extends React.Component {
    
    componentWillUnmount() {
        mForm=null;
    }
    
    render() {
        let form=this.props.form;
        mForm=form;
        let store=handler.$state();
        let payments=store.get("payments");
        return (<Form>
            <SearchGroupBorder>
                {/*payments*/}
                <SearchItemWithRadio initialValue="" title="支付方式" name="pay_mode_id" form={form}
                                     items={[
                                         {
                                             label: "（全部）",
                                             value: ""
                                         }].concat(payments.map(item=>({
                                         label: item.get("pay_mode_name"),
                                         value: item.get("pay_mode_id")
                                     })).toArray())}/>
                {/*"消费", "消费撤销", "退款", "", "预授权", "预授权撤销", "预授权完成", "", "预授权完成撤销"*/}
                <SearchItemWithRadio title="使用交易类型" name="trade_type" form={form} initialValue=""
                                     items={[
                                         {label: "（全部）", value: ""},
                                         {label: "消费", value: "1"},
                                         {label: "消费撤销", value: "2"},
                                         {label: "退款", value: "3"},
                                         {label: "预授权", value: "5"},
                                         {label: "预授权撤销", value: "6"},
                                         {label: "预授权完成", value: "7"},
                                         {label: "预授权完成撤销", value: "9"}]}/>
                <SearchItemWithRadio initialValue="" title="打印联类型" name="print_format_type" form={form}
                                     items={[
                                         {label: "（全部）", value: ""},
                                         {label: "商户联", value: "1"},
                                         {label: "持卡人联", value: "2"},
                                         {label: "银行存根联", value: "3"}]}/>
                <SearchItemWithInput
                    onChange={()=>Table.getTableInstance().reload(
                        cleanEmpty(mForm.getFieldsValue())
                    )}
                    title="模板名称" name="type_name"
                    placeholder="输入关键字查询"
                    getFieldDecorator={form.getFieldDecorator}/>
            
            </SearchGroupBorder>
        </Form>)
    }
}
const BindSearchForm=Form.create({
    onFieldsChange(props, {print_format_type, trade_type, pay_mode_id}){
        if(print_format_type||trade_type||pay_mode_id) {
            let values=cleanEmpty(mForm.getFieldsValue());
            Table.getTableInstance().reload(values);
            
        }
    }
})(SearchGroupForm);
export default class Component extends React.Component {
    componentWillMount() {
        getPayments()
    }
    
    componentWillUpdate() {
        if(handler._reload) {
            handler._reload=false;
            Table.getTableInstance().reload();
        }
    }
    
    render() {
        let {children} =this.props;
        return (<div>
            
            {children}
            <div style={{display: children ? "none" : "block"}}>
                <BindSearchForm/>
                <Table fixedParams={{pre_set:1}} extra={
                    <Auth to={CASHIER_PRINTER_TEMPLATE_PRESETS_ADD}>
                        <Button onClick={()=>hashHistory.push(`cashier/print/query/detail`)
                        } type={"primary"}><Icon type="plus-circle-o"/>新建打印模板</Button>
                    </Auth>} url="tprintTemplate/query" rowKey="" columns={[
                    {
                        title: "类型名称",
                        dataIndex: "type_name",
                        render: (a, col)=><Link
                            to={`cashier/print/query/detail?templateId=${col.templateId}`}>{col.type_name}</Link>
                    },
                    {title: "模板编码", dataIndex: "type_code"},
                    {title: "支付方式", dataIndex: "pay_mode_name"},
                    {
                        title: "适用交易类型",
                        dataIndex: "trade_type",
                        render: (a, col)=>col.trade_type ? trade_type[col.trade_type] : "全部"
                    },
                    {
                        title: "打印联类型",
                        dataIndex: "print_format_type",
                        render: (a, col)=>print_type[col.print_format_type]
                    },
                    {title: "最近更新时间", dataIndex: "update_time"},
                    {title: "状态", className:"corner-mark",dataIndex: "status", render: (a, col)=><span className={col.status==1?"text-success":"text-danger"}><span className="font-lg">.</span>{col.status==1?"可用":"停用"}</span>}
                ]}/>
            </div>
        </div>)
    }
}

