"use strict";
import React from 'react';
import {Button,Table,Spin,Modal,Alert} from 'antd';
const reducer = require('../reducer');
import DynamicForm from '../../../../../components/DynamicForm';
import className from 'classnames';

export default React.createClass({
    getInitialState(){
        return {pending:false,error:null,selectedRowKeys:[],paramBusy:false,showParam:false,paramItems:null}
    },
    componentWillMount(){
        let cacheForm = reducer.getFormData();
        if(cacheForm)this.state.selectedRowKeys = cacheForm.selectedKeys || [];
    },
    componentDidMount(){
        this.setState({pending:true});
        reducer.getMerchantsInfo().catch(err=>{
            this.setState({error:err.message})
        }).finally(()=>{
            this.setState({pending:false});
        });
    },
    onSelectChange(selectedRowKeys){
        this.setState({selectedRowKeys});
    },
    toggleParamModal(){
        let show = !this.state.showParam;
        let state = {showParam:show};
        if(!show)state.paramItems = null;
        this.setState(state);
    },
    showParams(item){
        this.setState({paramBusy:true});
        reducer.getConfig(item.storePaychannelId,{pay_mode_id:item.pay_mode_id,pay_channel_id:item.pay_channel_id}).then(data=>{
            let paramsMap = {};
            data.params.map(item=>{
                paramsMap[item.attr_name] = item.attr_value;
            });
            this.setState({paramItems:data.template});
            let from = this.refs.paramsForm;
            if(from){
                from.resetFields();
                from.setFieldsValue(paramsMap);
            }
        },err=>{
            Modal.error({
                title:'参数获取错误',
                content:err.message
            });
            this.toggleParamModal();
        }).finally(()=>{
            this.setState({paramBusy:false});
        })
    },
    prev(){
        reducer.storeFormData(null);
        reducer.preStep();
    },
    next(){
        let list = [];
        let merchants = reducer.state.get('merchants');
        this.state.selectedRowKeys.map(index=>{
            list.push(merchants[index]);
        });
        if(list.length<=0){
            return Modal.info({
                title:'提示',
                content:'请选择需要配置的门店'
            });
        }
        reducer.storeFormData({selectedStore:list,selectedKeys:this.state.selectedRowKeys});
        reducer.nextStep();
    },
    getColumns(){
        return [{
            title: '门店名称',
            render:(item)=>{
                return (<span><label>[{item.mcode}]</label> {item.store_name}</span>)
            }
        }, {
            title: '同类设置通道',
            render:(item)=>{
                let currentSettingChannel = reducer.state.get('forms').get(0).payment[1];
                return (<div>{
                        item.payment.map((payment,index)=>{
                            return <a key={index} onClick={()=>{this.toggleParamModal();this.showParams(payment)}}
                               className={className('gutter-right',{'text-danger':currentSettingChannel==payment.pay_channel_id})}>{payment.pay_channel_name}</a>
                        })
                    }</div>)
            }
        }, {
            title: '最近更新时间',
            dataIndex: 'update_time'
        }]
    },
    render(){
        let merchants = reducer.state.get('merchants');
        return (<div className="step step2">
            <p className="gutter-bottom">请再次确认门店信息：</p>
            <Spin spinning={this.state.pending} tip="数据加载中...">
                {this.state.error?
                    <Alert message='数据获取失败' description={this.state.error} type="error"/>:
                    <Table pagination={false}
                           rowKey={(value,index)=>index}
                           rowSelection={{selectedRowKeys:this.state.selectedRowKeys,onChange: this.onSelectChange}}
                           columns={this.getColumns()} dataSource={merchants}/>
                }
            </Spin>
            <Modal title="收银参数信息" className="modal-no-cancel" width={600} visible={this.state.showParam}
                   onCancel={this.toggleParamModal}
                   onOk={this.toggleParamModal} cancelText={false}>
                <div className="params-view x-scroll">
                    <Spin spinning={this.state.paramBusy}>
                        <div style={{minHeight:60}}>
                            {this.state.paramItems && this.state.paramItems.length?
                                <DynamicForm items={this.state.paramItems} ref="paramsForm"
                                             labelCol={{span: 6}} wrapperCol={{span: 18}} preview={true} excludeAction={true}/>:
                                !this.state.paramBusy&&<Alert message="没有参数信息" type="info"/>}

                        </div>
                    </Spin>
                </div>
            </Modal>
            <div className="footer text-center">
                <Button type='primary' onClick={this.prev}>上一步</Button>
                <Button type='primary' onClick={this.next}>下一步</Button>
            </div>
        </div>)
    }
})