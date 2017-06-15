/**
 *  created by yaojun on 17/2/8
 *
 */
import React from "react";
import ListItem from "../SearchListItem";
import fetch from "./fetch";
import {Col, Select, DatePicker, Input, Button, Form,Row} from "antd";
import {Icon32} from "../../../components/HomeIcon";
import {amountFormat,numberFormat} from "../../../util/helper";
import PaymentChannel from "../../../components/PaymentCascader";
import moment from "moment";
import {getTradeStatus, getTradeType, exportTradeRecords} from "../util";
import classNames from "classnames";
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const MonthFormat = "YYYY-MM";
const DateFormat  = MonthFormat + "-DD";
const oneDay      = 1000 * 60 * 60 * 24;
const month       = oneDay * 31;
const DayFormat   = "YYYY-MM-DD HH:mm:ss";
const FormItem    = Form.Item;
const formItemLayout={
    labelCol:{span:6},
    wrapperCol:{span:18}
}
export default class AdvanceBase extends React.Component {
    state = {
        list        : {data: [], total: 0},
        stat        : {total_trade_amount: 0, total_order_amount: 0},
        spinning    : false,
        isValidRange: true
    }
    
    // 数据列表
    searchResult() {
        return <ListItem onChange={(pa) => fetch(this, {...this.value, ...pa},true)} spinning={this.state.spinning}
                         list={this.state.list}/>
    }
    // common control 日期选择
    dateSelect(start_time=1,time_type=1,layout={lg:8, md:12 ,sm:12, xs:24},allowClear=true) {
        let {getFieldDecorator, getFieldValue,setFields}= this.props.form;
        return <Col  {...layout}>
            <FormItem {...formItemLayout} label={"按时间"}>
                    <span className="form-hide">
                     {
                         getFieldDecorator('start_time', {
                             initialValue: start_time
                         })(
                             <Select style={{width: 80}}>
                                 <Select.Option value={1}>按天</Select.Option>
                                 <Select.Option value={2}>按月</Select.Option>
                                 <Select.Option value={3}>自定义</Select.Option>
                             </Select>
                         )
                     }
                        </span>

                <Row className="date-select-group">
                    <Col span={8}>
                    {
                        getFieldDecorator('time_type', {
                            initialValue: time_type
                        })(
                            <Select>
                                <Select.Option value={1}>创建时间</Select.Option>
                                <Select.Option value={2}>交易时间</Select.Option>
                            </Select>
                        )
                    }
                    </Col>
                    <Col span={16}>
                    {

                        
                        getFieldValue("start_time") == 1 ?
                            getFieldDecorator('end_time_1', {
                                initialValue: moment(new Date, DateFormat),

                            })
                            (<DatePicker allowClear={allowClear}/>) :
                            getFieldValue("start_time") == 2 ?
                                getFieldDecorator('end_time_2', {
                                    initialValue: moment(new Date, MonthFormat),
                                })
                                (<MonthPicker/>) :
                                getFieldDecorator('end_time_3',{
                                    initialValue:[moment.ago(1),moment()]
                                })
                                (<RangePicker
                                    ranges={{
                                        "本月" : [moment().startOf("month"), moment()],
                                        "10天": [moment(getDayAgo(10)), moment()],
                                        "30天": [moment(getDayAgo(30)), moment()],
                                        "15天": [moment(getDayAgo(15)), moment()],
                                        "7天" : [moment(getDayAgo(7)), moment()]
                                    }}
                                    onChange={(e) => {
                                        let start = e[0];
                                        let end   = e[1];
                                        if(!start||!end) return;
                                        let diff  = Math.abs(start.diff(end)) / 86400000;
                                        if(diff>31){

                                            this.setState({isValidRange:false});
                                        }else{
                                            if(!this.state.isValidRange){
                                                this.setState({isValidRange:true});
                                            }
                                        }



                                    }} format={"YYYY-MM-DD"}/>)


                        
                        
                    }

                    </Col>
                </Row>
                {
                    !this.state.isValidRange &&<div  className="range-picker-error-msg">日期范围不能大于一个月</div>
                }
            </FormItem>

        </Col>
    }
    // 金额区间选择
    amountControl(layout={lg:8, md:12 ,sm:12, xs:24}) {
        let {getFieldDecorator, getFieldValue}= this.props.form;
        return <Col  {...layout}>
            <FormItem {...formItemLayout} label={"交易金额"}>

                <Row>
                    <Col span={10}>
                             {
                                 getFieldDecorator('trade_amount_min')(
                                     <Input />
                                 )
                             }
                    </Col>
                        <Col className="text-center" span={2}>~</Col>
                    <Col span={10}>

                    {
                        getFieldDecorator('trade_amount_max')(
                            <Input />
                        )
                    }
                    </Col>
                    
                    <Col span={2} className="text-center"> 元</Col>
                </Row>
            
            </FormItem>
        </Col>
    }
    // 搜索和清空
    actionBar(layout={lg:8, md:12 ,sm:12, xs:24}) {
        let {resetFields}= this.props.form;
        return <Col   {...layout} className={" search-action-bar"}>
            <FormItem   label={" "} {...formItemLayout}>
            <Button  className={"margin-right"} htmlType={"submit"}
                    type={"primary"}>搜索</Button>
            <Button onClick={() => resetFields()}>清除</Button>
            </FormItem>
        </Col>
    }
    // 交易状态选择
    tradeStatusControl(layout={lg:8, md:12 ,sm:12, xs:24}) {
        let {getFieldDecorator}= this.props.form;
        return <Col  {...layout}>
            <FormItem {...formItemLayout}  label={"交易状态"} >
                {
                    getFieldDecorator('trade_status',{
                        initialValue:"2"
                    })(
                        <Select>
                            {
                                getTradeStatus().map((item, index) => <Select.Option key={index}
                                                                                     value={index == 0 ? "" : index - 1 + ""}>{item}</Select.Option>)
                            }
                        </Select>
                    )
                }
            </FormItem>
        </Col>
    }
    // 交易类型选择
    tradeTypeControl(layout={lg:8, md:12 ,sm:12, xs:24}) {
        let {getFieldDecorator}= this.props.form;
        return <Col  {...layout}>
            <FormItem {...formItemLayout}  label={"交易类型"} >
                {
                    getFieldDecorator('trade_type',{
                        initialValue:"1"
                    })(
                        <Select>
                            {
                                getTradeType().map((item, index) =>  <Select.Option className={classNames([{"no-content-hide":!item}])} key={index}
                                                                                   value={index == 0 ? "" : index + ""}>{item}</Select.Option>)
                            }
                        </Select>
                    )
                }
            </FormItem>
        </Col>
    }
    // 支付通道选择
    channelSelect(isMust,layout={lg:8, md:12 ,sm:12, xs:24}) {
        let {getFieldDecorator}= this.props.form;
        let rules;
        if(isMust)rules={rules:[{required: true, message: "请选择支付通道"}]};
        return <Col  {...layout}>
            <FormItem {...formItemLayout}  label={"支付通道"} >
                {
                    getFieldDecorator('pay_channel_id',rules)(
                        <PaymentChannel params={{pageSize:999,status:1}}/>
                    )
                }
            </FormItem>
        </Col>
    }
    // 导出全部功能
    exportControl(type) {
        return <Button className={"pull-right"} onClick={() => {
            exportTradeRecords(this.props.form, type)
        }}>全部导出</Button>
    }
    // 统计数据
    statControl(statType,queryType,deviceAddress=null,hide){
        
       let stat = this.state.stat;
       if(hide) return null;
        return <Row gutter={12} className="data-group">
              
                <Col span={6} className="data-group-item">
        
                <Icon32 type="device" className="data-item-icon"/>
        
                {statType}
            </Col>
            
    
    
            <Col span={5} className="data-group-item">
                <Icon32 type="stat" className="data-item-icon"/>
                <div className="data-item-content">
                    <div className="data-item-txt">交易总笔数</div>
                    <div className="data-item-num">{numberFormat(stat.total_trade_num)}</div>
                </div>
            </Col>
    
            <Col span={5} className="data-group-item">
                <Icon32 type="amount" className="data-item-icon"/>
                <div className="data-item-content">
                    <div className="data-item-txt">订单总金额</div>
                    <div className="data-item-num">￥{amountFormat(stat.total_order_amount / 100)}</div>
                </div>
            </Col>
    
    
            <Col span={5} className="data-group-item">
                <Icon32 type="amount-o" className="data-item-icon"/>
                <div className="data-item-content">
                    <div className="data-item-txt">交易总金额</div>
                    <div className="data-item-num">￥{amountFormat(stat.total_trade_amount / 100)}</div>
                </div>
            </Col>
         
            <Col className="text-right" span={3}>
            {
                this.exportControl(queryType)
            }
            </Col>

        </Row>
    }
    handleSubmit(e) {
        e.preventDefault();
        if(!this.state.isValidRange ) return;
        this.props.form.validateFields((error, value) => {
            if (!this.state.isValidRange) return;
            if (value.start_time == 3) { // 自定义
                let start = value.end_time_3[0];
                let end   = value.end_time_3[1];
                if (start && end) {
                    value.start_time = start.format(DateFormat) + " 00:00:00"
                    value.end_time   = end.format(DateFormat) + " 23:59:59";
                } else {
                    value.start_time = null;
                    value.end_time   = null;
                }
            }
            if (value.start_time == 2) {// 按月
                value.start_time = value.end_time_2.startOf('month').format(DateFormat) + " 00:00:00"
                value.end_time   = value.end_time_2.endOf('month').format(DateFormat) + " 23:59:59";
            }
            if (value.start_time == 1 || this.query_type === 0) {// 按日
                value.start_time = value.end_time_1.startOf("day").format(DayFormat);
                value.end_time   = value.end_time_1.endOf("day").format(DayFormat);
            }
            if (error) return;
            this.setState({spinning: true});
            if (value.trade_amount_min) {
                value.trade_amount_min *= 100;
            }
            if (value.trade_amount_max) {
                value.trade_amount_max *= 100;
            }
            value.query_type = this.query_type;
            if (this.query_type != 0 && value.pay_channel_id) {
                value.pay_channel_id = value.pay_channel_id[1];
            }
            this.value = value;
            fetch(this, value);
        });
    }
}
function getDayAgo(num = 1, date = new Date) {
    return date.setDate(date.getDate() - num), date;
}