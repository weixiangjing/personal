/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {SearchGroupBorder, SearchItemWithRadio,SearchItemWithInput} from "../../../../components/SearchGroupBorder";
import {Form, Row, Col, Radio, Button, Select, Modal, Switch, Input} from "antd";
import "./layout.scss";
import {echoPayTypes, toggleVisible, submit} from "./reducer";
import {CASHIER_PROFIT_ADD, CASHIER_PROFIT_UPDATE} from "../../../../config/auth_func";
import {Auth} from "../../../../components/ActionWithAuth";
import {PayChannelSelect} from "../../../../components/PayChannelSelect";
import {Table} from "../../../../components/Table";

import {ProfitPackage} from "../../../../components/ProfitPackage";
const FormItem  =Form.Item;
const RadioGroup=Radio.Group;
let form;
const SearchForm=Form.create({
    onFieldsChange(props, fields){
        let value=form.getFieldsValue();
        Table.getTableInstance().reload(value);
    }
})(React.createClass({
    componentWillMount(){
        echoPayTypes();
    }, render(){
        let store=this.props.store;
        let types=store.get("types").toJS();
        form     =this.props.form;
        return (<Form >

            <SearchGroupBorder>

                <SearchItemWithRadio initialValue="" title="状态" name="rate_status" form={this.props.form} items={[{label: "（全部）", value: ""}].concat([{
                    label: "可用", value: "1"
                },{
                    label: "已停用", value: "2"
                }])}/>
                <SearchItemWithRadio initialValue="" items={[{label: "（全部）", value: ""}].concat([{
                    label: "银联境内卡", value: "1"
                }, {
                    label: "银联国际（UPI）卡", value: "2"
                }, {
                    label: "外卡", value: "3"
                }, {
                    label: "非银行卡", value: "4"
                }])} title="套餐类型" name="rate_type" form={this.props.form}/>
                <SearchItemWithRadio initialValue="" items={[{label: "（全部）", value: ""}].concat(types.map(item=>({
                    label: item.pay_mode_name, value: item.pay_mode_id
                })))} title="支付方式" name="pay_mode_id" form={this.props.form}/>
                <SearchItemWithInput  getFieldDecorator={this.props.form.getFieldDecorator}
                                      name="keywords"
                                      placeholder="费率套餐的名称或说明" title="按关键字查询"/>
            </SearchGroupBorder>

        </Form>);
    }
}));
let __profit_form;
const NewProfit =Form.create()(React.createClass({
    render(){
        let {getFieldDecorator, getFieldValue, setFieldsValue}  =this.props.form;
        let {state, types}                                      = this.props;//编辑的时候，回显示数据
        let echo                                                =state.get("echo");
        let isBank                                              =getFieldValue("pay_mode_id")==1006;
        let backType                                            =getFieldValue("rate_type");
        let packageType                                         ="4";
        if(isBank) {
            packageType=backType||"1";
        } else {
            packageType="4";
        }
        const formItemLayout={
            labelCol: {span: 4}, wrapperCol: {span: 12},
        };
        __profit_form       =this.props.form;
        window.form         =__profit_form;
        return (

            <Modal title={state.get("title")}
                   onCancel={()=>toggleVisible(false, undefined, undefined, this.props.form)}
                   visible={state.get("visible")}
                   width={720}
                   onOk={()=>submit(this.props.form)}
                   confirmLoading={state.get("confirmLoading")}
            >
                <Form className="new-profit-dialog">
                    <Row>
                        <Col span={12}>
                            <FormItem wrapperCol={{span: 15}} labelCol={{span: 8}} label={"费率名称"}>
                                {
                                    getFieldDecorator("rate_name", {
                                        rules: [{
                                            required: true, message: "请输入费率名称"
                                        }]
                                    })(<Input placeholder="请输入费率名称"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={6} offset={4}>
                            <FormItem >

                                {
                                    getFieldDecorator("status", {
                                        valuePropName: "checked", initialValue: true
                                    })(<Switch checkedChildren={'开'} unCheckedChildren={'关'}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={"支付方式"} wrapperCol={{span: 15}} labelCol={{span: 8}}
                                      className={'m-input-group'}>



                                {
                                    getFieldDecorator("pay_mode_id", {
                                        rules: [{
                                            required: true, message: "请选择支付方式"
                                        }]
                                    })(<Select onChange={(e)=>{
                                        let rate_type=packageType=="4"?"1":packageType;
                                        setFieldsValue({rate_service:getRateService([{}],rate_type),rate_type});
                                    }} >
                                        {
                                            types.map(item=> {
                                                return (<Select.Option key={item.get("pay_mode_id")}
                                                                       value={item.get("pay_mode_id")}>{item.get("pay_mode_name")}</Select.Option>)
                                            })
                                        }
                                    </Select>)
                                }


                            </FormItem>
                        </Col><Col span={12}>
                        <FormItem label={"支付通道"} wrapperCol={{span: 15}} labelCol={{span: 8}}
                                  className={'m-input-group'}>
                            {
                                getFieldDecorator("pay_channel_id", {})(<PayChannelSelect
                                    pay_mode_id={getFieldValue("pay_mode_id")}/>)
                            }


                        </FormItem>
                    </Col>

                        {
                            getFieldValue("pay_mode_id")==1006&&<Col span={24}>
                                <FormItem {...formItemLayout} label={"套餐类型"}>
                                    {
                                        getFieldDecorator("rate_type", {
                                            rules: [{
                                                required: true, message: "请选择套餐类型"
                                            }]
                                        })(<RadioGroup onChange={(e)=> {
                                            let type  =e.target.value;
                                            setFieldsValue({rate_service: getRateService([{}],type)});
                                        }}>
                                            <Radio value={1}>银联境内卡</Radio>
                                            <Radio value={2}>银联国际（UPI）卡</Radio>
                                            <Radio value={3}>外卡</Radio>
                                        </RadioGroup>)
                                    }
                                </FormItem>
                            </Col>
                        }


                        <Col span={24}>
                            <FormItem {...formItemLayout} label={"费率说明"}>

                                {
                                    getFieldDecorator("description", {
                                        rules: [{
                                            required: true, message: "请输入费率说明"
                                        }]
                                    })(<Input placeholder="请输入费率说明"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {
                                    getFieldDecorator("rate_service", {
                                        rules: [{
                                            validator: (rule, value, cb)=> {
                                                cb()
                                            }
                                        }]
                                    })(<ProfitPackage form={this.props.form} type={packageType}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>



        )
    }
}))
export default class Profit extends React.Component {
    static RATE_TYPES=["", "银联境内卡", "银联国际（UPI）卡", "外卡", "非银行卡"];

    saveForm(form) {
        this.form=form;
    }

    saveProfitForm(form) {
        this.pfrom=form;
    }

    render() {
        const columns=[{
            title: '套餐ID', dataIndex: 'rate_id', width: 100,
        }, {
            title: '费率套餐名称', dataIndex: 'rate_name',
        }, {
            title: '套餐类型', render: (a, col)=>Profit.RATE_TYPES[col.rate_type]
        }, {
            title: '支付方式', dataIndex: 'pay_mode_name',
        }, {
            title    : "支付通道",
            dataIndex: "pay_channel_name",
            render   : (a, col)=><span>{col.pay_channel_name ? col.pay_channel_name : "--"}</span>
        }, {
            title: '费率说明', dataIndex: 'description',
        }, {
            title    : '状态',
            width    : 70,
            className: "corner-mark",
            render   : (a, col)=>col.status==1 ?
                <span className="text-success"><font className="font-lg">.</font>可用</span> :
                <span className="text-danger"><font className="font-lg">.</font>已停用</span>
        }, {
            title: '操作', dataIndex: '', render: (a, col)=> {
                return (<span className="channel-action">
                    <Auth to={CASHIER_PROFIT_UPDATE}>
                    <a onClick={()=> {
                        toggleVisible(true, col.rate_name, col, __profit_form)
                    }}>编辑</a>
                    </Auth>
                </span>)
            }
        },];
        let state    =this.storeState;
        let total    =state.get("total");
        let pageSize =state.get("pageSize");
        return (
            <div className="cashier-profit-list">
                <SearchForm ref={this.saveForm.bind(this)} store={state}/>
               
                <NewProfit res={this.saveProfitForm.bind(this)} state={state} types={state.get("types")}/>
                <Table extra={ <Auth to={CASHIER_PROFIT_ADD}>
                    <Button className={"pull-right"} onClick={()=> {
                        toggleVisible(true, "新增套餐", undefined, this.form)
                    }}>新手续费率</Button></Auth>}  url={"tmsPayRate/getPayRateCombo"}  rowKey={"rate_id"}  className={'channel-records'} columns={columns} />
            </div>
        );
    }
}


function getRateService(values,type){
   return values.map(item=> {
        let value={//default 4
            rate        : item.rate||"",
            begin_amount: item.begin_amount||"",
            max_amount  : item.max_amount||"",
            id          : item.id||Math.random()
        }
        if(type=="3") {
            value.card_brand      =item.card_brand||"VISA"
            value.card_type       =item.card_type||"1"
            value.rate_change_type=item.rate_change_type||"EDC"
        } else if(type=="2"||type=="1") {
            value.card_type=item.card_type||"1";
        }
        return value;
    });
}