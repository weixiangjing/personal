/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {Card, Row, Col, Table,DatePicker,Icon,Tooltip} from "antd"
import moment from "moment";
import {amountFormat, numberFormat,amountRound} from "../../../util/helper";
import G2 from "g2";
import "g2-plugin-slider";
import createG2 from "g2-react";
import ajax from "axios";
import "./home.scss";
import PaymentCascader from "../../../components/PaymentCascader";
const TipsConstant= require("../../../config/tips_constant");

const decimal =require("decimal.js");
window.g2=G2;
let id;
const DATE_FORMAT="YYYY-MM-DD";
const G2LineChart=createG2((chart)=> {
    chart.col("trade_amount", {
        alias: "交易金额（万元）",
        formatter:(val)=>val<1?val:numberFormat(Number(val.toFixed(2)))
    }).col("trade_date", {
        type:"time",
        tickCount:12,
        mask:DATE_FORMAT.toLocaleLowerCase(),
        range:[0,1]
    }).col("trade_num",{
        alias:"交易笔数",
        range:[0,1],
        formatter:(val)=>numberFormat(val)
    })
    chart.axis("trade_date",{title:null});
    chart.legend({position:"top",dy:-20});
    chart.area().position('trade_date*trade_amount').color('l(100) 0:#57d8fd 1:#23ccfd').size(2).shape("smooth");
    chart.line().position("trade_date*trade_num").color("#6060ff").size(2).shape("smooth");


    let slider = new G2.Plugin.slider({
        domId:id,
        height:26,
        xDim:"trade_date",
        yDim:"trade_amount",
        charts:chart,
        start:moment.ago(30).format(DATE_FORMAT),
        end:moment.ago(1).format(DATE_FORMAT)
    })
   slider.render();

});
export default class HomeIndex extends React.Component {
    state ={
        today: {}, all: {}, lately: [], top: {
            channel_rank:[],
            device_rank:[],
            mcode_rank:[]
        }, channels: [], tendency: [], width: 700
    }
    option={}


    getTotalStat(id){
        let send={}
        if(id){
            send.pay_channel_id=id;
        }
        ajax.post("trade/totalCount",send).then((res)=>this.setState({all:res.data[0]}))
    }
    containerId="chart-container-"+Math.random().toString().slice(2)
    componentWillMount() {
        id="slider-container-"+Math.random().toString().slice(2);
        
        this.statAll();
        this.statToday();
        this.getTopList();
        this.getTradeTendency(180);
        this.handleResize=this.handleResize.bind(this);
        ajax.post("tmsPaychannel/getPayChannel").then(res=>this.setState({channels: res.data}));
    }
    __chart_channel_id="";
    getTradeTendency(day, value) {
        if(day) {
            this.day=day;
        }
     
        let send={
            count_date_min: moment.ago(day||this.day).format(DATE_FORMAT),
            count_date_max: moment.ago(1).format(DATE_FORMAT)
        }
        if(value) {
            send['pay_channel_id'] =value;
        }
        ajax.post("trade/trendCount", send).then(res=> {
            let _data=res.data.map((item, index)=> {
                item.trade_amount= +Number(decimal(item.trade_amount).div(1000000)).toFixed(2);
                item.trade_date=moment(item.trade_date).format(DATE_FORMAT)
                return item;
            });
            this.setState({
                tendency: _data
            })
        });
    }

    getTopList(type=1,date=moment.ago(1)) {
        let send={
            rank_date: date.format(DATE_FORMAT),
            pageSize      : 10
        }

        ajax.post("trade/rankCount", send).then(res=>this.setState({top: res.data[0]}));
    }
    
    

    statToday(channel) {
        let send={
            trade_time_min: moment().format(DATE_FORMAT)+" 00:00:00",
            trade_time_max: moment().format(DATE_FORMAT)+" 23:59:59"
        }
        if(channel) {
            send["pay_channel_id"]=channel;
        }
        ajax.post("trade/count", send).then(res=>this.setState({today: res.data[0]}));
    }
    statAll(channel) {
       this.getTotalStat(channel);
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        setTimeout(()=>{
            let container=this.container=document.querySelector("#"+this.containerId);
            let width=container.getBoundingClientRect().width;
            this.offsetWidth=window.innerWidth-width;
            this.setState({width: width||this.state.width});
        });
    }

    handleResize(e) {
        let width=window.innerWidth-this.offsetWidth;
        this.setState({width: width});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        let today   =this.state.today;//{total_trade_amount,total_trade_num}
        let all     =this.state.all;
        let top     =this.state.top;
        let lately  =this.state.lately;
        let channels=[{pay_channel_id: "", pay_channel_name: "全部通道"}].concat(this.state.channels);
        return (<div className="cashier-home" id={this.containerId}>
            <div className="stat-rank-group">

                    <Card className="lg-card-body" title={<span>今日完成交易
                        <Tooltip title={TipsConstant.TradeQuery.TODAY_TRADE}>
                        <Icon className="text-shade margin-left" type="question-circle-o"/>
                        </Tooltip>
                    </span>}
                          extra={<PaymentCascader placeholder="请选择支付通道" onChannelChange={(e)=> {
                              this.statToday(e[1])
                          }}/>}>
                        <Row gutter={24}>
                            <Col span={6}>
                                <div className="data-item">
                                    <span className="data-text-icon">消费</span>
                                    <div className="data-text">
                                        <p className="d-title">总笔数</p>
                                        <p className="d-number">{numberFormat(today.total_trade_num)}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="data-item">
                                    <div className="data-text">
                                        <p className="d-title">总金额(万元)</p>
                                        <p className="d-number">{amountRound(+today.total_trade_amount/1000000)}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                            <div className="data-item">
                                <span style={{background:"#666666"}} className="data-text-icon">退款</span>

                                <div className="data-text">
                                    <p className="d-title">总笔数</p>
                                    <p className="d-number">{numberFormat(today.total_refund_num)}</p>
                                </div>
                            </div>
                        </Col>
                            <Col span={6}>
                            <div className="data-item">


                                <div className="data-text">
                                    <p className="d-title">总金额(万元)</p>
                                    <p className="d-number">{amountRound(+today.total_refund_amount/1000000)}</p>
                                </div>
                            </div>
                        </Col>


                        </Row>
                    </Card>

                    <Card className="lg-card-body" title={<span>累计完成交易
                        <Tooltip title={TipsConstant.TradeQuery.TOTAL_TRADE}>
                        <Icon className="text-shade margin-left" type="question-circle-o"/>
                        </Tooltip>
                    </span>}
                          extra={<PaymentCascader placeholder="请选择支付通道" onChannelChange={(e)=>this.statAll(e[1])}/>}>
                        <Row gutter={24}>
                            <Col span={6}>

                                <div className="data-item">
                                    <span className="data-text-icon">消费</span>
                                    <div className="data-text">
                                        <p className="d-title">总笔数</p>
                                        <p className="d-number">{numberFormat(all.total_trade_num)}</p>
                                    </div>
                                </div>

                            </Col>
                            <Col span={6}>
                                <div className="data-item">
                                    <div className="data-text">
                                        <p className="d-title">总金额(万元)</p>
                                        <p className="d-number">{amountRound(+all.total_trade_amount/1000000)}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="data-item">
                                    <span style={{background:"#666666"}}  className="data-text-icon">退款</span>

                                    <div className="data-text">
                                        <p className="d-title">总笔数</p>
                                        <p className="d-number">{numberFormat(all.total_refund_num)}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="data-item">
                                    <div className="data-text">
                                        <p className="d-title">总金额(万元)</p>
                                        <p className="d-number">{amountRound(+all.total_refund_amount/1000000)}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            
                        <Card title={  <span>交易趋势图（截至昨日）
                        <Tooltip title={TipsConstant.TradeQuery.TREND_TRADE}>
                        <Icon className="text-shade margin-left" type="question-circle-o"/>
                        </Tooltip>
                    </span>} extra={
                            <PaymentCascader params={{status:1}} placeholder="请选择支付通道" onChannelChange={(e)=> {
                                this.getTradeTendency(null, e[1])
                            }}/>
                        }>

                            {
                                this.state.tendency.length>0&&
                                <G2LineChart plogCfg={[40,85]}  forceFit={true} width={this.state.width}    height={300} data={this.state.tendency}/>
                            }
                            <div id={id}></div>
                        </Card>





            <div className="card-radio-group-extra trade-home-rank" span={8}>
                <Card title={
                    <span>消费交易排行
                        <Tooltip title={TipsConstant.TradeQuery.RANK_TRADE}>
                        <Icon className="text-shade margin-left" type="question-circle-o"/>
                        </Tooltip>
                    </span>
                } extra={  <DatePicker onChange={(e)=>{
                    this.getTopList(this._rank_type,e)
                }} className="rank-date-picker" defaultValue={moment.ago(1)}/>
                }>
                    <Row gutter={48}>
                        <Col span={7}>
                            <Table className="small-table" columns={[{
                                width:53,
                                title: "排名 ", render: (col, item, index)=><span
                                    className={'level-tag level-tag-'+(index+1)}>{index+1}</span>
                            }, {
                                title: "通道名", dataIndex: "rank_name"
                            }, {
                                title    : "交易总金额（元）",
                                render   : (item)=>numberFormat(item.trade_amount/100),
                                className: "text-right"
                            }]} rowKey={"rank_name"} dataSource={top.channel_rank} pagination={false}/>
                        </Col> <Col span={10}>
                        <Table className="small-table" columns={[{
                            title: " 排名", render: (col, item, index)=><span
                                className={'level-tag level-tag-'+(index+1)}>{index+1}</span>
                        }, {
                            title: "门店名"
                            ,render:(a,col)=><div className="text-ellipsis">[{col.mcode}] {col.rank_name}</div>
                        }, {
                            title    : "交易总金额（元）",
                            render   : (item)=>numberFormat(item.trade_amount/100),
                            className: "text-right"
                        }]} rowKey={"mcode"} dataSource={top.mcode_rank} pagination={false}/>
                    </Col> <Col span={7}>
                        <Table className="small-table" columns={[{
                            title: " 排名", render: (col, item, index)=><span
                                className={'level-tag level-tag-'+(index+1)}>{index+1}</span>
                        }, {
                            title: "设备EN", dataIndex: "rank_name"
                        }, {
                            title    : "交易总金额（元）",
                            render   : (item)=>numberFormat(item.trade_amount/100),
                            className: "text-right"
                        }]} rowKey={"rank_name"} dataSource={top.device_rank} pagination={false}/>
                    </Col>
                    </Row>
                </Card>
            </div>
        </div>)
    }
}
