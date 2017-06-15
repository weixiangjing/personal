'use strict';
import React from 'react';
import { Tabs,Spin,Row,Col,Alert,Card,Modal,message,Timeline,Tooltip,Icon } from 'antd';
const TabPane = Tabs.TabPane;
import * as reducer from './reducer';
import {getStatusText} from '../../../model/Order';
import UpdateBillForm from './UpdateBillForm';
import './style.scss';

export default class extends React.Component{
    state={
        error:null,
        updateVisible:false,
        updating:false,
        updatingBill:null
    };
    componentDidMount(){
       this.getOrderDetail();
    }
    getOrderDetail(){
        reducer.getDetail(this.props.router.params.id)
            .catch(err=>{
                this.setState({error:err.message});
            });
    }
    update(){
        this.updateForm.validateFields((err,values)=>{
            if(err)return;
            this.setState({updating:true});
            reducer.updateRemark(this.state.updatingBill,values.remark).then(()=>{
                this.setUpdateModalVisible(false);
                message.success('备注已修改');
            },err=>{
                Modal.error({
                    content:err.message
                })
            }).finally(()=>{
                this.setState({updating:false});
            });
        })
    }
    setUpdateModalVisible(flag){
        this.setState({updateVisible:flag})
    }
    updateBill(bill){
        this.setState({updatingBill:bill});
        this.setUpdateModalVisible(true);
    }
    handelMarkPaid(bill,type){
        Modal.confirm({
            title:'是否完成收款',
            content:'该订单是否' + (type===2?'立即代收':'已线下收款'),
            onOk:()=>{
                reducer.markPaid({
                    agent_instalment_bill_detail_id:bill.agent_instalment_bill_detail_id,
                    pay_mode:type
                }).then(()=>{
                    message.success('修改成功');
                    this.getOrderDetail();
                },err=>{
                    Modal.error({
                        content:err.message
                    });
                });
            }
        })
    }
    render(state){
        const order = state.get('order');
        if(this.state.error)return <Alert type="error" showIcon description={this.state.error}/>;
        return <div id="order-detail">
            <Spin spinning={state.get('pending')}>
                <div className="title">订单详情</div>
                {order&&<div>
                    <Tabs type="card" className='info-tab'>
                        <TabPane tab="基础信息" key="basic">
                            <div className="basic-info">
                                <Row>
                                    <Col span={8}><LabelItem name='订单号' value={order.agent_instalment_bill_id}/></Col>
                                    <Col span={8}><LabelItem name='创建时间' value={order.create_time}/></Col>
                                    <Col span={8}><LabelItem name='状态'><label className="status-label" data-status={order.status}>{getStatusText(order.status)}</label></LabelItem></Col>
                                </Row>
                                <Row>
                                    <Col span={8}><LabelItem name='代理商' value={order.agent_name}/></Col>
                                    <Col span={8}><LabelItem name='付款银行卡' value={order.bankcard}/></Col>
                                </Row>
                                <Row>
                                    <Col span={8}><LabelItem name='硬件使用费'>{order.expense_detail.hardwareUutilizationFee/100}元</LabelItem></Col>
                                    <Col span={8}><LabelItem name='软件服务费'>{order.expense_detail.softwareServiceFee/100}元</LabelItem></Col>
                                    <Col span={8}><LabelItem name='通讯费'>{order.expense_detail.communicationFee/100}元</LabelItem></Col>
                                </Row>
                                <Row>
                                    <Col span={8}><LabelItem name='手续费'>{order.unit_interest/100*order.num}元</LabelItem></Col>
                                    <Col span={8}><LabelItem name='支付次数'>{order.num}</LabelItem></Col>
                                    <Col span={8}><LabelItem name='每次支付金额'>{(order.unit_interest+order.unit_principal)/100}</LabelItem></Col>
                                </Row>
                                <Row>
                                    <Col span={22}>
                                        <LabelItem labelCol={3} valueCol={21} name='订单描述'>{order.des}</LabelItem>
                                    </Col>
                                </Row>
                            </div>
                            <div className="title gutter-top-lg">账单信息</div>
                            <div className="bills">
                                {order&&order.agent_instalment_list?order.agent_instalment_list.map((instalment,index)=>{
                                    return <Bill key={index}
                                                 instalment={instalment}
                                                 index={index}
                                                 handelMarkPaid={this.handelMarkPaid.bind(this)}
                                                 handleUpdateRemarkClick={(bill)=>this.updateBill(bill)}/>
                                }):<Alert type="info" showIcon description="没有账单信息"/>}
                            </div>
                        </TabPane>
                        {/*<TabPane tab="设备信息" key="device">
                            <div className="devices">
                                {order.sns.map(device=>{
                                    return <div key={device.sn} className="device-item">
                                        <label>{device.device_type}</label>
                                        <label>{device.sn}</label>
                                        <label>单价：{device.device_price/100}元</label>
                                    </div>
                                })}
                            </div>
                        </TabPane>*/}
                        <TabPane tab="订单记录" key="log">
                            <Logs/>
                        </TabPane>
                    </Tabs>
                </div>}
            </Spin>
            <Modal title="备注修改"
                   visible={this.state.updateVisible}
                   onOk={this.update.bind(this)}
                   confirmLoading={this.state.updating}
                   onCancel={()=>this.setUpdateModalVisible(false)}>
                <UpdateBillForm bill={this.state.updatingBill} ref={uf=>this.updateForm=uf}/>
            </Modal>
        </div>
    }
}

const LabelItem = ({name,value,children,labelCol,valueCol})=>{
    return <Row className='label-item'>
        <Col span={labelCol||8} className='label-name'>{name}</Col>
        <Col span={valueCol||16} className='label-value'>{children||value}</Col>
    </Row>
};

class Bill extends React.Component{
    render(){
        const {instalment,index,handleUpdateRemarkClick,handelMarkPaid} = this.props;
        return <div className='bill'>
            <Card bodyStyle={{padding:0}}>
                <div className="bill-title gutter-lg">{`账单 #${index+1}`}</div>
                <div className="gutter-lg">
                    <Row>
                        <Col span={12}>
                            <LabelItem name="还款日" value={instalment.bill_date}/>
                        </Col>
                        <Col span={12}>
                            <LabelItem name="账单金额">
                                {(instalment.unit_principal+instalment.unit_interest)/100} 元
                            </LabelItem>
                        </Col>
                    </Row>
                    <LabelItem labelCol={4} valueCol={20} name="还款时间" value={instalment.update_time}/>
                    <LabelItem labelCol={4} valueCol={20} name="备注">{instalment.remark} <a onClick={()=>handleUpdateRemarkClick(instalment)}>【修改备注】</a></LabelItem>
                </div>
                <div className="bill-card-footer">
                    <div className="pull-left">
                        <label className="status-label dot" data-status={instalment.status}>{getStatusText(instalment.status)}</label>
                        {instalment.status==4&& instalment.errorDes &&
                        <Tooltip placement="topLeft" title={instalment.errorDes}>
                            <Icon type="question-circle-o" className="gutter-left help"/>
                        </Tooltip>}
                    </div>
                    <div className="pull-right">
                        {instalment.is_need_pay==1&&<div>
                            <a onClick={()=>handelMarkPaid(instalment,2)}>立即代收</a>
                            <span className="text-muted gutter-h">|</span>
                            <a onClick={()=>handelMarkPaid(instalment,3)}>已线下收款</a>
                        </div>}
                    </div>
                    <div className="clearfix"/>
                </div>
            </Card>
        </div>
    }
}

class Logs extends React.Component{
    state={
        loading:false
    };
    componentDidMount(){
       this.getLogs();
    }
    getLogs(params){
        this.setState({loading:true});
        return reducer.getLogs(params).finally(()=>{
            this.setState({loading:false});
        });
    }
    render(){
        let logs = reducer.state.get('logs');
        if(!logs)return null;
        logs = logs.toJS();
        let hasNext = logs.total/logs.pageSize > logs.pageNum;
        let pending;
        if(this.state.loading){
            pending = <Spin size='small'/>
        }else {
            pending = hasNext?
                <a onClick={()=>{this.getLogs('next')}}>查看更多日志...</a>:
                <span className="text-muted">没有更多日志了</span>;
        }
        return <Timeline pending={pending}>
            {logs.data.map((log)=>{
                return <Timeline.Item key={log.id} color={log.logType==1?'red':'blue'}>
                    <p className={log.logType==1?'text-danger':'text-primary'}>{log.create_time}</p>
                    <div className="text-normal">{log.description}</div>
                </Timeline.Item>
            })}
        </Timeline>
    }
}