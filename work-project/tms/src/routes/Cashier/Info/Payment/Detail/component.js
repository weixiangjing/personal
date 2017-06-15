/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {Form, Input, Radio, Row, Col, Icon, Button,Popconfirm,InputNumber} from "antd";
import {ImageUpload} from "../../../../../components/ImageUpload";
import SubBackHeader from "../../../../../components/SubBackHeader";
import {Auth} from "../../../../../components/ActionWithAuth";
import {CASHIER_PAYMENT_ADD, CASHIER_PAYMENT_DELETE} from "../../../../../config/auth_func";
import {deletePayment, submit, handler, getDetail} from "./reducer";
import "./layout.scss";
let form;
let mTable;
const FormItem=Form.Item;
const layout={labelCol: {span: 3}, wrapperCol: {span: 8}}
const SearchForm=Form.create()(React.createClass({
    componentWillMount(){
        let id=this.props.location.query.id;
        let pid =this.props.location.query.bid;
        this.pay_mode_id=id;
        
        if(pid)
        getDetail(pid, this.props.form);
    },
    render(){
        let {getFieldDecorator, getFieldValue} = this.props.form;
        
        form=this.props.form;
        return (
            <Form ref="forms" className="channel-list">
                
                <SubBackHeader extra={
                    <span>
                        {
                            this.pay_mode_id &&
                                <Auth to={CASHIER_PAYMENT_DELETE}>
                                    <Popconfirm title="确认删除该支付方式吗？" onConfirm={()=>deletePayment(form)}>
                                    <Button  style={{marginRight: 12}} type={"danger"}><Icon
                                        type="delete"/> 删除</Button>
                                    </Popconfirm>
                                </Auth>
                           
                        }
                       
                        <Auth to={CASHIER_PAYMENT_ADD}>
                        <Button onClick={()=>submit(form, this.pay_mode_id)} type={"primary"}><Icon
                            type="save"/> 保存</Button>
                        </Auth>
                    </span>
                }/>
                <FormItem {...layout} label={"支付方式编号"}>
                    {
                        getFieldDecorator("pay_mode_id", {rules: [{required: true, message: "请输入支付方式编号"}]})(<Input
                            disabled={!!this.pay_mode_id}/>)
                    }
                </FormItem>
                <FormItem {...layout} label={"支付方式名称"}>
                    {
                        getFieldDecorator("pay_mode_name", {rules: [{required: true, message: "请输入支付方式名称"}]})(<Input/>)
                    }
                </FormItem>
    
                <FormItem {...layout} label={"序号"}>
                    {
                        getFieldDecorator("sort_num")(<InputNumber/>)
                    }
                </FormItem>
                <FormItem {...layout} label={"描述"}>
                    {
                        getFieldDecorator("description")(<Input/>)
                    }
                </FormItem>
                <FormItem {...layout} label={"状态"}>
                    {
                        getFieldDecorator("status", {rules: [{required: true, message: "请选择状态"}]})(
                            <Radio.Group>
                                <Radio value={1}>可用</Radio>
                                <Radio value={2}>停用</Radio>
                            </Radio.Group>)
                    }
                </FormItem>
                
                <Row className="upload-images-container">
                    <Col span={3}>上传图标资源 </Col>
                    <Col span={16}>
                        <Row>
                            <Col span={12}>
                                
                                
                                <FormItem className="upload-image-item">
                                    {
                                        getFieldDecorator("icon_key_1")(<ImageUpload showButton={false} className="item-icon"/>)
                                    }
                                    <img src={getFieldValue("icon_key_1")}/>
                                    <div className="right-desc">
                                        <div>01 请选择支付方式图片</div>
                                        <div>100x100</div>
                                        <div>背景黑色，图标部分镂空</div>
                                    </div>
                                </FormItem>
                            
                            
                            </Col>
                            <Col span={12}>
                                <FormItem className="upload-image-item upload-image-item-200 ">
                                    {
                                        getFieldDecorator("icon_key_2")(<ImageUpload showButton={false} className="item-icon big-icon"/>)
                                    }
                                    <img src={getFieldValue("icon_key_2")}/>
                                    <div className="right-desc">
                                        <div>02 支付方式主页面背景图</div>
                                        <div>254x100</div>
                                        <div>背景透明</div>
                                    </div>
                                </FormItem>
                            </Col>
                        
                        
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem className="upload-image-item">
                                    {
                                        getFieldDecorator("icon_key_3")(<ImageUpload showButton={false} className="item-icon"/>)
                                    }
                                    <img src={getFieldValue("icon_key_3")}/>
                                    <div className="right-desc">
                                        <div>03 POS扫手机Logo</div>
                                        <div>90x90</div>
                                        <div>背景透明</div>
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem className="upload-image-item">
                                    {
                                        getFieldDecorator("icon_key_4")(<ImageUpload showButton={false} className="item-icon"/>)
                                    }
                                    <img src={getFieldValue("icon_key_4")}/>
                                    <div className="right-desc">
                                        <div className="desc">04 二维码中间Logo</div>
                                        <div className="size">80x72</div>
                                        <div className="alpha">背景透明</div>
                                    </div>
                                </FormItem>
                            </Col>
                        
                        </Row>
                    
                    </Col>
                
                </Row>
               
                <Row className="margin-top-lg">
                    <Col span={3}>图标上传示例</Col>
                    <Col span={16}>
                        <img height={300} src={require("./assets/payment_assets.png")}/>
                    </Col>
                
                </Row>
            
            
            </Form>)
    }
}));
export default class Component extends React.Component {
    
    render() {
        let {children} =this.props;
        let state=this.storeState;
        
        return (
            <div>
                
                <div style={{display: children ? "none" : "block"}}>
                    <SearchForm store={state} {...this.props}/>
                </div>
            </div>
        )
    }
}



    

