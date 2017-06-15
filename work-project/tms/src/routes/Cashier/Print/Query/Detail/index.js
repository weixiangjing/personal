/**
 *  created by yaojun on 2017/5/17
 *
 */
import React from "react";
import {Button, Col, Form, Icon, Input, Popconfirm, Radio, Row, Select} from "antd";
import PaymentSelect from "../../../../../components/Select/payment";
import VisualEditor from "../../../../../components/VisualPrint";
import SubBackHeader from "../../../../../components/SubBackHeader";
import {Auth} from "../../../../../components/ActionWithAuth";

import {deleteScheme, echoScheme, handler, submit} from "./reducer";
import {
    CASHIER_PRINTER_TEMPLATE_PRESETS_DETAIL_DELETE,
    CASHIER_PRINTER_TEMPLATE_PRESETS_DETAIL_SAVE
} from "../../../../../config/auth_func";
import "./index.scss";
const FormItem=Form.Item;

class EditorForm extends React.Component {
    
    render() {
        let {getFieldDecorator}=this.props.form;
        let layout={
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        }
        
        let disableControl={disabled: !!this.props.query.templateId};
        
        return (
            <Form>
                <Row>
                    <Col lg={8} md={12}>
                        <FormItem {...layout} label={"类型名称"}>
                            {
                                getFieldDecorator("type_name", {rules: [{required: true, message: "请输入模板名称"}]})(
                                    <Input {...disableControl}/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={12}>
                        <FormItem {...layout} label={"类型编码"}>
                            {
                                getFieldDecorator("type_code", {rules: [{required: true, message: "请输入类型编码"}]})(
                                    <Input onChange={(e)=>{this.props.onCodeChange(e.target.value)}} {...disableControl} />)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={12}>
                        <FormItem {...layout} label={"支付方式"}>
                            {
                                getFieldDecorator("pay_mode_id")(
                                    <PaymentSelect disable={disableControl.disabled} defaultAll={true}
                                                   autoWidth={true}/>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={12}>
                        <FormItem {...layout} label={"交易类型"}>
                            {
                                getFieldDecorator("trade_type", {
                                    initialValue: ''
                                })(
                                    <Select {...disableControl}>
                                        <Select.Option value={''}>不限</Select.Option>
                                        <Select.Option value={1}>消费</Select.Option>
                                        <Select.Option value={2}>消费撤销</Select.Option>
                                        <Select.Option value={3}>退款</Select.Option>
                                        <Select.Option value={5}>预授权</Select.Option>
                                        <Select.Option value={6}>预授权撤销</Select.Option>
                                        <Select.Option value={7}>预授权完成</Select.Option>
                                        <Select.Option value={9}>预授权完成撤销</Select.Option>
                                    </Select>)
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={12}>
                        <FormItem {...layout} label={"打印联"}>
                            {
                                getFieldDecorator("print_format_type", {
                                    initialValue: 1
                                })(
                                    <Radio.Group {...disableControl}>
                                        <Radio value={1}>商户</Radio>
                                        <Radio value={2}>持卡人</Radio>
                                        <Radio value={3}>银行存根</Radio>
                                    
                                    </Radio.Group>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col lg={8} md={12}>
                        <FormItem {...layout} label={"状态"}>
                            {
                                getFieldDecorator("status", {initialValue: 1})(
                                    <Radio.Group>
                                        <Radio value={1}>可用</Radio>
                                        <Radio value={2}>停用</Radio>
                                    </Radio.Group>
                                )
                            }
                        </FormItem>
                    </Col>
                
                </Row>
            </Form>)
    }
}
const BindEditorForm=Form.create()(EditorForm);
export default class Component extends React.Component {
    componentWillMount() {
        this.query=this.props.location.query
    }
    
    componentDidMount() {
        
        echoScheme(this.query, this.mForm);
    }
    
    render() {
        let template=handler.$state("template");
        let name =handler.$state("templateName");
        
        return (
            <div className="print-template-normal-detail">
                <SubBackHeader extra={
                    <div>
                        <Auth replace to={CASHIER_PRINTER_TEMPLATE_PRESETS_DETAIL_SAVE}>
                            <Button onClick={()=>submit(this.mForm, this.query)} type={"primary"}><Icon type="save"/>保存</Button>
                        </Auth>
                        {
                            this.query.templateId&&
                            <Auth replace to={CASHIER_PRINTER_TEMPLATE_PRESETS_DETAIL_DELETE}>
                                <Popconfirm onConfirm={()=>deleteScheme(this.query)} title="确认要删除该基础模板吗？">
                                    <Button style={{marginLeft: 12}} type={"danger"}><Icon type="delete"/>删除</Button>
                                </Popconfirm>
                            </Auth>
                        }
                    </div>}/>
                <BindEditorForm onCodeChange={(name)=>{handler.$update("templateName",name)}} query={this.query} ref={(form)=>this.mForm=form}/>
                <VisualEditor
                    templateName={name}
                    showDelete={false}
                    showSave={false}
                    saveAuth={CASHIER_PRINTER_TEMPLATE_PRESETS_DETAIL_SAVE}
                    deleteAuth={CASHIER_PRINTER_TEMPLATE_PRESETS_DETAIL_DELETE}
                    printControls={template}
                    onChange={(a, temName)=> {
                        if(temName) {
                            this.mForm.setFieldsValue({type_code: temName});
                        }
                        
                        handler.$update("template", a)
                    }}
                    isEmpty={false}/>
            </div>)
    }
}

