/**
 *  created by yaojun on 16/12/19
 *
 */
import React from "react";
import {Form, Input, Select, DatePicker, Row, Button, Card,Col} from "antd";
import {Icon32} from "../../../components/HomeIcon";
import {amountFormat,cleanEmpty,showTaskModal} from "../../../util/helper";
import {CardTable} from "../../../components/Table";
import {getApi} from "../../../config/api";
import ajax from "axios";
import "./index.scss";
const MonthPicker = DatePicker.MonthPicker;
export default Form.create()(React.createClass({
    getInitialState(){
        return {
            stat: {},
            list: [],
            exportLoading:false,
            search:""
        }
    },
    handleSubmit(e){
        e.preventDefault();
        let value = this.props.form.getFieldsValue();
            if(!value.mcode && !value.device_en){
                return ;
            }
            this.sendRequest(cleanEmpty(value));
            CardTable.getTableInstance().reload(cleanEmpty(value));
    },
    sendRequest(send){
        
        ajax.post("tradeBatchSettle/queryCount", send).then(res => this.setState({stat: res.data[0]}));
    },
    exportData(){
        this.props.form.validateFields((error, value) => {
            if (error) return;
           value= cleanEmpty(value);
            ajax.post(`tradeBatchSettle/queryList`,Object.assign({},value,{"export":1})).then(()=>showTaskModal(1))
        });
    },
    render(){
        let {getFieldDecorator, getFieldValue, resetFields} =this.props.form;
        let stat                                            = this.state.stat || {};
        this.state.list=[{"refund_num":1,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-21 14:45:09","settle_amount":1,"trade_end_time":"2017-04-21 14:44:30","refund_amount":1,"settle_count_id":124475,"settle_num":1,"trade_start_time":"2017-04-21 14:44:30","store_name":"","mcode":"170560"},{"refund_num":21,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-18 15:40:36","settle_amount":33,"trade_end_time":"2017-04-18 15:26:41","refund_amount":21,"settle_count_id":124469,"settle_num":32,"trade_start_time":"2017-04-17 17:21:37","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-21 14:43:59","settle_amount":900,"trade_end_time":"2017-04-21 14:43:44","refund_amount":0,"settle_count_id":124466,"settle_num":1,"trade_start_time":"2017-04-21 14:43:44","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 14:14:46","settle_amount":1,"trade_end_time":"2017-04-19 14:13:51","refund_amount":0,"settle_count_id":124410,"settle_num":1,"trade_start_time":"2017-04-19 14:13:51","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 14:13:38","settle_amount":1,"trade_end_time":"2017-04-19 14:13:30","refund_amount":0,"settle_count_id":124402,"settle_num":1,"trade_start_time":"2017-04-19 14:13:30","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 14:12:12","settle_amount":1,"trade_end_time":"2017-04-19 14:12:03","refund_amount":0,"settle_count_id":124392,"settle_num":1,"trade_start_time":"2017-04-19 14:12:03","store_name":"","mcode":"170560"},{"refund_num":1,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-21 14:28:50","settle_amount":1,"trade_end_time":"2017-04-21 14:28:15","refund_amount":1,"settle_count_id":124388,"settle_num":1,"trade_start_time":"2017-04-21 14:28:15","store_name":"","mcode":"170560"},{"refund_num":1,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 14:09:12","settle_amount":1,"trade_end_time":"2017-04-19 14:08:38","refund_amount":1,"settle_count_id":124386,"settle_num":1,"trade_start_time":"2017-04-19 14:08:38","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-21 14:27:06","settle_amount":1,"trade_end_time":"2017-04-21 14:26:54","refund_amount":0,"settle_count_id":124378,"settle_num":1,"trade_start_time":"2017-04-21 14:26:54","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 14:06:40","settle_amount":1,"trade_end_time":"2017-04-19 14:06:24","refund_amount":0,"settle_count_id":124375,"settle_num":1,"trade_start_time":"2017-04-19 14:06:24","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 14:05:15","settle_amount":1,"trade_end_time":"2017-04-19 14:04:56","refund_amount":0,"settle_count_id":124361,"settle_num":1,"trade_start_time":"2017-04-19 14:04:56","store_name":"","mcode":"170560"},{"refund_num":1,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-24 15:28:11","settle_amount":1,"trade_end_time":"2017-04-24 15:27:36","refund_amount":1,"settle_count_id":124358,"settle_num":1,"trade_start_time":"2017-04-24 15:27:36","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-24 15:27:08","settle_amount":1,"trade_end_time":"2017-04-24 15:27:01","refund_amount":0,"settle_count_id":124344,"settle_num":1,"trade_start_time":"2017-04-24 15:27:01","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-21 13:55:32","settle_amount":1,"trade_end_time":"2017-04-21 13:54:48","refund_amount":0,"settle_count_id":124342,"settle_num":1,"trade_start_time":"2017-04-21 13:54:48","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 13:56:03","settle_amount":1,"trade_end_time":"2017-04-19 13:55:53","refund_amount":0,"settle_count_id":124335,"settle_num":1,"trade_start_time":"2017-04-19 13:55:53","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-21 13:54:24","settle_amount":1,"trade_end_time":"2017-04-21 13:54:15","refund_amount":0,"settle_count_id":124326,"settle_num":1,"trade_start_time":"2017-04-21 13:54:15","store_name":"","mcode":"170560"},{"refund_num":1,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 13:53:35","settle_amount":1,"trade_end_time":"2017-04-19 13:52:40","refund_amount":1,"settle_count_id":124320,"settle_num":1,"trade_start_time":"2017-04-19 13:52:40","store_name":"","mcode":"170560"},{"refund_num":0,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-21 11:23:25","settle_amount":1,"trade_end_time":"2017-04-21 11:23:11","refund_amount":0,"settle_count_id":124313,"settle_num":1,"trade_start_time":"2017-04-21 11:23:11","store_name":"","mcode":"170560"},{"refund_num":36,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-19 13:47:13","settle_amount":42,"trade_end_time":"2017-04-19 12:09:50","refund_amount":37,"settle_count_id":124308,"settle_num":41,"trade_start_time":"2017-04-18 15:43:07","store_name":"","mcode":"170560"},{"refund_num":6,"device_en":"af602b0c","cashier_name":"匿名用户","create_time":"2017-04-22 20:33:52","settle_amount":60205,"trade_end_time":"2017-04-22 20:22:49","refund_amount":60205,"settle_count_id":124300,"settle_num":6,"trade_start_time":"2017-04-22 19:14:31","store_name":"","mcode":"170560"}]
        return (<Form className="liquidate-search" inline onSubmit={this.handleSubmit}>
            <Form.Item label="mcode">
                {
                    getFieldDecorator('mcode')(
                     <Input/>
                    )
                }
            </Form.Item>
            
            <Form.Item label={"设备en"}
                       className="inline-input-group input-size-de inline margin-left">
                {
                    getFieldDecorator('device_en')(
                        <Input/>
                    )
                }
            </Form.Item>
            
            <span className="pull-right">
                    <Button className={"margin-right"} htmlType={"submit"} type={"primary"}>搜索</Button>
                <Button onClick={() => resetFields()}>清除</Button>
            </span>
            {
                (stat.mcode||stat.device_en) && <Row className="data-group">
                    
                    <Col  span={3} className="data-group-item">
                        <Icon32 type="home" className="data-item-icon"/>
                        
                        <div className="data-item-content">
                            <div className="data-item-num">{stat.mcode||stat.device_en}</div>
                        </div>
                    </Col>
                    
                    
                    <Col span={5} className="data-group-item">
                        <Icon32 type="stat" className="data-item-icon"/>
                        
                        <div className="data-item-content">
                            <div className="data-item-txt">交易总笔数</div>
                            <div className="data-item-num">{stat.total_settle_num}</div>
                        </div>
                    </Col>
                    <Col span={5} className="data-group-item">
                        <Icon32 type="amount" className="data-item-icon"/>
                        
                        <div className="data-item-content">
                            <div className="data-item-txt">交易总金额 (元)</div>
                            <div className="data-item-num">{amountFormat(stat.total_settle_amount / 100)}</div>
                        </div>
                    </Col>
                    
                    <Col span={3} className="data-group-item">
                        <Icon32 type="amount" className="data-item-icon"/>
                        
                        <div className="data-item-content">
                            <div className="data-item-txt">退款总笔数</div>
                            <div className="data-item-num">{stat.total_refund_num}</div>
                        </div>
                    </Col>
                    <Col span={5} className="data-group-item">
                        <Icon32 type="amount-o" className="data-item-icon"/>
                        <div className="data-item-content">
                            <div className="data-item-txt">退款总金额（元）</div>
                            <div className="data-item-num">{amountFormat(stat.total_refund_amount / 100)}</div>
                        </div>
                    </Col>
                    <Col className="text-right" span={3}>
                    <Button onClick={() => this.exportData()}>全部导出</Button>
                    </Col>
                
                </Row>
                
            }
            
            <CardTable autoInit={false} requireOneOfProps={["device_en","mcode"]} url="tradeBatchSettle/queryList" renderContent={(items)=>{
                
                 return items.map(item=> (
                    <Row key={item.settle_count_id} className="settle-item common-simple-card margin-top">
                        <Col span={3}>
                            <div className="text-shade text-left">结算时间</div>
                            <div className="margin-top">{item.create_time}</div>
                        </Col>
            
                        <Col span={4}>
                            <div>
                                {item.store_name||"--"}
                            </div>
                            <div className="margin-top">
                                <label  className="label bg-default ">{item.mcode}</label>
                                <label> {item.device_en}</label>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="text-shade">开始时间 {item.trade_start_time}</div>
                            <div className="margin-top text-shade">
                                结束时间  {item.trade_end_time}
                
                
                            </div>
                        </Col>
            
                        <Col span="3">
                            <div className="text-shade">交易笔数</div>
                            <div className="font-md">{item.settle_num}</div>
                        </Col>
            
                        <Col span="4">
                            <div className="text-shade">
                                交易金额（元）
                            </div>
                            <div className="font-md">
                                ￥{amountFormat(item.settle_amount / 100)}
                            </div>
                        </Col>
            
            
                        <Col span="2">
                            <div className="text-shade">退款笔数</div>
                            <div className="font-md">{item.refund_num}</div>
                        </Col>
                        <Col span="2">
                            <div className="text-shade">退款金额（元）</div>
                            <div className="font-md">{item.refund_amount/100}</div>
                        </Col>
        
                    </Row>
               ))
            }}/>
            
            
        
        
        </Form>)
    }
}))