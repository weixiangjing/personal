"use strict";
import React from 'react';
import {Button,Row,Col,Tabs,Table,Form,Radio,Input,Checkbox,Select,Alert,Spin,Modal,message} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const reducer = require('./reducer');
import DynamicForm from '../../../../../components/DynamicForm';
import './style.scss'
import classNames from 'classnames';
import {CASHIER_CONFIG_UPDATE,CASHIER_CONFIG_DELETE} from '../../../../../config/auth_func';
import {Auth} from '../../../../../components/ActionWithAuth';

export default React.createClass({
    getInitialState(){
        return {
            error:null
        }
    },
    componentDidMount(){
        this.getMerchantInfo().then(this.initData);
    },
    initData(){
        this.getPayChannelDetailInfo(this.initParamFormValue);
    },
    initParamFormValue(){
        const channelConfig = this.storeState.get('channelConfig');
        if(!channelConfig)return;
        let values = {};
        (channelConfig.storeParms || []).map(item=>{
            values[item['attr_name']] = item['attr_value'];
        });
        this.refs.dynamicForm.setFieldsValue(values);
        this.refs.ruleForm.setFieldsValue(channelConfig);
    },
    update(){
        this.getFormData().then(params=>{
            reducer.setBusy(true);
            reducer.applyConfig(params).then(()=>{
                message.success('操作成功');
                this.initData();
            },err=>{
                Modal.error({
                    title:'操作失败',
                    content:err.message
                })
            }).finally(()=>{
                reducer.setBusy(false);
            });
        });
    },
    getFormData(){
        let params = {};
        let forms = [
            {
                form:this.refs.ruleForm,
                transfer:(value)=>{
                    Object.assign(params,value);
                }
            },{
                form:this.refs.bizForm,
                transfer:(value)=>{
                    params.bz_ability = [];
                    Object.keys(value).map(key=>{
                        const val = value[key]===true?1:0;
                        if(val===1)params.bz_ability.push({
                            bz_ability_id:key,
                            attr_value:val
                        })
                    })
                }
            },
            {
                form:this.refs.dynamicForm,
                transfer:(value)=>{
                    params.store_params = [];
                    Object.keys(value).map(key=>{
                        params.store_params.push({
                            attr_name:key,
                            attr_value:value[key]
                        })
                    })
                }
            }
        ];
        let promises = [];
        forms.map(form=>{
            promises.push(transferForm(form));
        });
        return new Promise((resolve,reject)=>{
            Promise.all(promises).then(()=>{
                resolve(params);
            },()=>{
                message.error('表单项有误，请检查。',5);
                reject();
            });
        });

        function transferForm(item) {
            return new Promise((resolve,reject)=>{
                if(!item.form)resolve();
                item.form.validateFields((err,value)=>{
                    if(err)return reject(err);
                    item.transfer(value);
                    resolve(value);
                })
            });
        }
    },
    open(){
        let q = this.props.location.query;
        this.getFormData().then(params=>{
            reducer.setBusy(true);
            reducer.openPayChannel(q.mid,q.cid,params).then(()=>{
                message.success('操作成功');
                this.initData();
            },err=>{
                Modal.error({
                    title:'操作失败',
                    content:err.message
                })
            }).finally(()=>{
                reducer.setBusy(false);
            });
        });
    },
    del(){
        Modal.confirm({
            title:'确定删除配置?',
            content:'将删除所有配置信息，删除后不可恢复！',
            onOk:()=>{
                reducer.setBusy(true);
                reducer.delConfig().then(()=>{
                    message.success('操作成功');
                    this.props.router.replace({pathname:'/cashier/config/store'})
                },err=>{
                    Modal.error({
                        title:'操作失败',
                        content:err.message
                    })
                }).finally(()=>{
                    reducer.setBusy(false);
                });
            }
        })
    },
    getPayChannelDetailInfo(success){
        let q = this.props.location.query;
        reducer.setBusy(true);
        return reducer.getPayChannelDetail(q.mid,q.cid,q.spid).then(success,err=>{
            Modal.error({
                title: '数据获取失败',
                content: err.message
            });
        }).finally(()=>{
            reducer.setBusy(false);
        })
    },
    getMerchantInfo(){
        let params = this.props.params;
        reducer.setBusy(true);
        return reducer.getMerchantInfo(params.mcode).catch(err=>{
            this.setState({error:'门店加载失败：'+err.message});
        }).finally(()=>{
            reducer.setBusy(false);
        })
    },
    handelTabChange(key){
        switch (key){
            case 'params':
                if(!this.storeState.get('merchantDevice').size){
                    reducer.setBusy(true);
                    return reducer.getDevices().catch(err=>{
                        Modal.error({
                            title:'设备加载失败',
                            content:err.message
                        })
                    }).finally(()=>{
                        reducer.setBusy(false);
                    })
                }
                break;
        }
    },
    render(props,state){
        if(this.state.error)return <Alert message={this.state.error} type="error"/>;
        let merchant = state.get('merchant');
        let channel = state.get('channel');
        return (<Spin spinning={state.get('busy')}>
            <header className="clearfix">
                {merchant?<div className="pull-left">[{merchant.mcode}] {merchant.store_name}</div>:null}
                {channel?<div className="pull-right">
                        {channel.isOpen?
                            <div>
                                <Auth to={CASHIER_CONFIG_UPDATE}>
                                    <Button type='primary' onClick={this.update}>保存</Button>
                                </Auth>
                                <Auth to={CASHIER_CONFIG_DELETE}>
                                    <Button type='danger' onClick={this.del} className='gutter-left'>删除配置</Button>
                                </Auth>
                            </div>:
                            <div>
                                <Auth to={CASHIER_CONFIG_UPDATE}>
                                    <Button type='primary' onClick={this.open}>开通</Button>
                                </Auth>
                            </div>}
                    </div>:null}
            </header>
            <Tabs type="card" className='gutter-top' onChange={this.handelTabChange}>
                <TabPane tab="交易规则及参数" key="rule">
                    <RuleForm ref="ruleForm" {...props}/>
                    <hr className="gutter-bottom-lg"/>
                    <div style={{width:640}}>
                        <DynamicForm ref="dynamicForm" items={channel&&channel.pay_channel_store_params} labelCol={{span:6}} wrapperCol={{span:14}}/>
                    </div>
                </TabPane>
                <TabPane tab="终端参数" key="params" disabled={!channel}>
                    <PosParamSetting channel={channel}/>
                </TabPane>
                <TabPane tab="业务能力" key="biz" disabled={!channel}>
                    <BizSetting ref="bizForm"/>
                </TabPane>
            </Tabs>
        </Spin>)
    }
})

const RuleForm = Form.create()(React.createClass({
    render(){
        const formItemLayout = {labelCol: {span: 6},wrapperCol: {span: 14}};
        const { getFieldDecorator } = this.props.form;
        let query = this.props.location.query;
        let channels = [];
        if(query.mid)channels.push(String(query.mid));
        if(query.cid)channels.push(String(query.cid));
        let state = reducer.state;
        let channel = state.get('channel');
        if(!channel)return null;
        return(
            <Form horizontal onSubmit={this.handleSubmit} style={{width:640}}>
                <Row className='ant-form-item'>
                    <Col span={formItemLayout.labelCol.span} className='ant-form-item-label'>
                        <label>通道名称</label>
                    </Col>
                    <Col span={formItemLayout.wrapperCol.span}>
                        <div className="ant-form-item-control text-danger">{channel.pay_mode_name}/{channel.pay_channel_name}</div>
                    </Col>
                </Row>
                {channel.operation_mode==3 &&
                <FormItem {...formItemLayout} label="通道运营类型">
                    {getFieldDecorator('operation_mode', {
                        initialValue:String(channel.operation_mode)
                    })(
                        <RadioGroup>
                            <Radio value='1'>自营</Radio>
                            <Radio value='2'>自有</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                }
                {this.renderRateElement(channel,formItemLayout)}
            </Form>
        )
    },
    renderRateElement(channel,formItemLayout){
        const rate = channel.rate;
        const { getFieldDecorator } = this.props.form;
        const SelectProps = {
            showSearch:true,
            notFoundContent:'没有可用费率',
            filterOption:(input, option) => {
                const text = option.props.children;
                return text.indexOf(input) >= 0;
            }
        };
        if(channel.pay_mode_id==1006){
            return <div>
                <FormItem {...formItemLayout} label="交易手续费率">
                    {getFieldDecorator('rate_id', {
                    })(
                        <Select {...SelectProps}>
                            {rate.uinInner.map(item=>{
                                return <Option key={item.rate_id} value={String(item.rate_id)}>{item.rate_name}</Option>
                            })}
                        </Select>
                    )}
                    <div className="small text-muted">商户签约支付通道的手续费率，银行卡方式下须分借贷记</div>
                </FormItem>
                <FormItem {...formItemLayout} label="UPI卡交易手续费率">
                    {getFieldDecorator('upi_rate_id', {
                    })(
                        <Select {...SelectProps}>
                            {rate.uinOuter.map(item=>{
                                return <Option key={item.rate_id} value={String(item.rate_id)}>{item.rate_name}</Option>
                            })}
                        </Select>
                    )}
                    <div className="small text-muted">用户使用银联国际（UPI）卡在境内交易的手续费率，是否支持需要商户向签约通道方确认</div>
                </FormItem>
                <FormItem {...formItemLayout} label="外卡交易手续费率">
                    {getFieldDecorator('outer_rate_id', {
                    })(
                        <Select {...SelectProps}>
                            {rate.outer.map(item=>{
                                return <Option key={item.rate_id} value={String(item.rate_id)}>{item.rate_name}</Option>
                            })}
                        </Select>
                    )}
                    <div className="small text-muted">用户使用外卡在境内交易的手续费率，是否支持需要商户向签约通道方确认</div>
                </FormItem>
            </div>
        }else {
            return <FormItem {...formItemLayout} label="交易手续费率">
                {getFieldDecorator('rate_id', {
                })(
                    <Select {...SelectProps}>
                        {rate.other.map(item=>{
                            return <Option key={item.rate_id} value={String(item.rate_id)}>{item.rate_name}</Option>
                        })}
                    </Select>
                )}
                <div className="small text-muted">商户签约支付通道的手续费率，银行卡方式下须分借贷记</div>
            </FormItem>
        }
    }
}));
const PosParamSetting = React.createClass({
    getInitialState(){
        return {
            selectedRowKeys:[],
            editDevice:null,
            showEditModal:false
        }
    },
    editableColumns:[],
    getColumns(){
        this.editableColumns = [];
        const channel = this.props.channel;
        let params = channel.pay_channel_terminal_params;
        if(params && params.length){
            params.forEach(item=>{
                if(item.validator){
                    item.validator.forEach(validator=>{
                        if(validator.pattern && !(validator.pattern instanceof RegExp))validator.pattern = new RegExp(validator.pattern);
                    });
                }
                this.editableColumns.push(Object.assign({width:260,dataIndex:item.key},item))
            });
        }
        let columns = [{
            title: '设备EN号',
            dataIndex: 'device_en'
        },{
            title: '设备类型',
            dataIndex: 'device_type'
        }].concat(this.editableColumns);
        if(this.editableColumns.length){
            columns.push({
                title: '操作',
                width: 200,
                render:(text,record,index)=>{
                    return <a onClick={()=>{this.edit(record,index)}}>编辑</a>
                }
            })
        }
        columns.push({
            title: '最近更新',
            dataIndex: 'last_pos_params_update'
        });
        return columns;
    },
    onSelectChange(selectedRowKeys){
        this.setState({ selectedRowKeys });
    },
    edit(item,index){
        item.index = index;
        this.setState({selectedRowKeys:[],editDevice:item});
        setTimeout(()=>{
            this.toggleEditModal(true);
        },0)
    },
    toggleEditModal(show){
        this.setState({showEditModal:show});
        if(show==true&&this.state.editDevice){
            let values = {};
            this.editableColumns.forEach(item=>{
                values[item.dataIndex] = this.state.editDevice[item.dataIndex];
            });
            this.editForm.setFieldsValue(values);
        }
    },
    removeAttr(){
        let rows = this.state.selectedRowKeys;
        if(rows.length<=0)return;
        Modal.confirm({
            title:'移除参数',
            content:'确定移除？',
            onOk:()=>{
                reducer.cleanPosParams(rows);
                this.setState({ selectedRowKeys:[] });
            }
        });
    },
    handleEditDone(){
        this.editForm.validateFields((errors,values)=>{
            if(!errors){
                reducer.updatePosParam(this.state.editDevice,values);
                this.toggleEditModal(false);
            }
        });
    },
    handleEditCancel(){
        this.toggleEditModal(false);
    },
    render(){
        if(!this.props.channel)return null;
        let state = reducer.state;
        const device = state.get('merchantDevice');
        const channelConfig = state.get('channelConfig');
        let msg = <div>门店下共绑定<span className="text-danger">{device.size}</span>
            台设备，其中<span className="text-success">{this.props.channel.bind_en_num}</span>台已设置终端参数。</div>;
        const rowSelection = this.editableColumns.length?{
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange
        }:null;
        const devices = device.toJS();
        return <div>
            <Alert message={msg} type="info" showIcon/>
            <div className={classNames("operation",{'hidden':!rowSelection})}>
                <Button className="gutter-v" onClick={this.removeAttr}>移除参数</Button>
            </div>
            <Table bordered rowSelection={rowSelection} dataSource={devices} pagination={false} columns={this.getColumns()} rowKey={(val,index)=>index}/>
            <Modal title={'编辑设备信息'} visible={this.state.showEditModal} onOk={this.handleEditDone} onCancel={this.handleEditCancel}>
                <DeviceEditForm ref={form=>this.editForm=form} editable={this.editableColumns} device={this.state.editDevice}/>
            </Modal>
        </div>
    }
});
const DeviceEditForm = Form.create()(React.createClass({
    render(){
        const {getFieldDecorator} = this.props.form;
        const {editable,device} = this.props;
        const formItemLayout = {labelCol:{span:6},wrapperCol:{span:14}};
        if(!device)return null;
        return <Form horizontal>
            <FormItem label='设备EN号' {...formItemLayout}>
                <Input disabled value={device.device_en}/>
            </FormItem>
            {editable.map(item=>{
                return <FormItem key={item.dataIndex} label={item.title} {...formItemLayout}>
                    {getFieldDecorator(item.dataIndex, {
                        //initialValue:device[item.dataIndex],
                        rules:item.validator
                    })(
                        <Input/>
                    )}
                    <label className="text-muted small">{item.description}</label>
                </FormItem>
            })}
        </Form>
    }
}));
const BizSetting = Form.create()(React.createClass({
    getInitialState(){
        return {busy:false,biz:null}
    },
    componentDidMount(){
        this.setState({busy:true});
        reducer.getBzAblity().then(biz=>{
            this.setState({biz:biz});
        }).finally(()=>{
            this.setState({busy:false});
        });
    },
    getBizItem(field){
        if(!field)return null;
        let type = field.input_type || 1;
        let {getFieldDecorator} = this.props.form;
        switch (type){
            case 1:
                return <FormItem labelCol={{span: 6}} wrapperCol={{ span: 14 }}>
                        {getFieldDecorator(String(field.bz_ability_id), {
                            initialValue:field.attr_value==1,
                            valuePropName:'checked'
                        })(
                            <Checkbox>{field.attr_name}</Checkbox>
                        )}
                    </FormItem>;
            case 2:
                return <FormItem labelCol={{span: 6}} wrapperCol={{ span: 14 }} label={field.attr_name}>
                    {getFieldDecorator(field.attr_key, {
                        initialValue:field.attr_value
                    })(
                        <Input style={{width:300}} placeholder={field.description}/>
                    )}
                </FormItem>;
            default: return null;
        }
    },
    render(){
        const {biz} = this.state;
        if(!biz)return <Spin spinning={this.state.busy}><div style={{height:50}}/></Spin>;
        if(!biz.length)return <Alert message="没有业务能力配置项" type="info"/>;
        return <Form horizontal>
            {biz.map((item,index)=>{
                return <div className="biz-group" key={index}>
                    <div className="title text-md">{item.label}</div>
                    <div className="content">
                        {
                            item.child.map(field=>{
                                return <label role="button" key={field.id}>{this.getBizItem(field)}</label>;
                            })
                        }
                    </div>
                </div>
            })}
        </Form>
    }
}));