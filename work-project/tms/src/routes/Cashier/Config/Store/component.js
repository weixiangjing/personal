"use strict";
import React from 'react';
import {Link} from 'react-router';
import {Row,Col,Button,Spin,Table,Form,Select,Switch,Input,Icon,Tabs,Checkbox,Timeline,Card,Alert,message,Modal} from 'antd';
import classNames from 'classnames';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Search = Input.Search;
const reducer = require('./reducer');
const CheckboxGroup = Checkbox.Group;
import className from 'classnames';
import PaymentCascader from '../../../../components/PaymentCascader';
import './style.scss'
import JSONTree from 'react-json-tree'
import {CASHIER_CONFIG_QUERY} from '../../../../config/auth_func';
import {Auth} from '../../../../components/ActionWithAuth';

const SearchForm = Form.create()(React.createClass({
    getInitialState:function() {
        return {pending:false};
    },
    handleSearch(){
        const params = this.props.form.getFieldsValue();
        if(!params.keywords)return reducer.reset();
        this.setBusy(true);
        reducer.search(params).then(merchants=>{
            if(!merchants.size){
                message.info('没有找到任何门店信息')
            }else {
                this.props.onData(merchants);
            }
        }).catch((err)=>{
            message.error('数据加载失败：'+err.message)
        }).finally(()=>{
            this.setBusy(false);
        });
    },
    setBusy(flag){
        this.setState({pending:flag});
    },
    render(){
        const { getFieldDecorator } = this.props.form;
        return (<Spin spinning={this.state.pending} size='small'>
            <Form horizontal>
                <Row gutter={5}>
                    <Col span={8}>
                        {getFieldDecorator('type', {
                            initialValue:'mcode'
                        })(
                            <Select placeholder="筛选类型">
                                <Option value="mcode">MCODE</Option>
                                <Option value="store_name_like">商户名称</Option>
                                <Option value="merchant_phone">商户手机号</Option>
                            </Select>
                        )}
                    </Col>
                    <Col span={16}>
                        {getFieldDecorator('keywords', {
                        })(
                            <Search onSearch={this.handleSearch}/>
                        )}
                    </Col>
                </Row>
            </Form>
        </Spin>)
    }
}));

const columns = [{
    width: 90,
    render(){
        let item = arguments[1];
        return <span>[{item.get('mcode')}]</span>
    }
}, {
    render(){
        let item = arguments[1];
        return <span>{item.get('store_name')}</span>
    }
}];
export default class extends React.Component{

    constructor(props) {
        super(props);
        this.state = {busy:false};
        this.modal = null;
    }

    componentDidMount(){
        const params = this.storeState.get('formData');
        if(params){
            this.refs.searchForm.setFieldsValue(params);
        }
        reducer.getOpenedPayChannel();
    }

    onStoreSelect(merchant){
        const currentMerchant = this.storeState.get('selectedMerchant');
        if(currentMerchant && currentMerchant.get('store_id') === merchant.get('store_id'))return;
        reducer.selectMerchant(merchant);
        this.onTabChange('payChannel');
    }

    onTabChange(key){
        reducer.activeTab(key);
        const merchant = this.storeState.get('selectedMerchant');
        switch (key) {
            case 'payChannel':
                if(merchant.get('modes') && merchant.get('modes').size>0)return;
                this.setState({'busy':true});
                reducer.getOpenedPayChannel().catch(err=>{
                    message.error(err.message);
                }).finally(()=>{
                    this.setState({'busy':false});
                });
                break;
            case 'logs':
                const logs = reducer.state.get('logs');
                if(logs.get('total')<=0)this.getLogs();
                break;
        }
    }
    handlePayModeSortEnd(sort){
        if(sort.oldIndex == sort.newIndex)return;
        this.setState({busy:true});
        reducer.sortPayMode(sort).finally(()=>{
            this.setState({busy:false});
        });
    }
    handlePayModeToggle(flag,mode){
        const newStatus = flag?1:2;
        const merchant = this.storeState.get('selectedMerchant');
        this.modal = Modal.confirm({
            title: '确认提醒',
            content: `确定${flag?'打开':'关闭'}【${mode.get('pay_mode_name')}】？`,
            onOk:()=>{
                this.setState({busy:true});
                reducer.togglePayMode({
                    mcode:merchant.get('mcode'),
                    pay_mode_id:mode.get('pay_mode_id'),
                    status:newStatus
                }).catch(err=>{
                    Modal.error({
                        title:'操作失败：',
                        content:err.message
                    })
                }).finally(()=>{
                    this.setState({busy:false});
                });
            }
        })
    }
    handlePayChannelToggle(open,channel,mode){
        const toggleChannel = (isOpen,spid,refreshOnSuccess)=> {
            this.setState({busy:true});
            return reducer.updatePayChannel({
                storePaychannelId:spid,
                status:isOpen?1:2
            },refreshOnSuccess).catch(err=>{
                Modal.error({
                    title:'操作失败：',
                    content:err.message
                });
            }).finally(()=>{
                this.setState({busy:false});
            });
        };

        const channels = mode.get('channels');
        if(open){
            for(let i=0;i<channels.size;i++){
                let channelItem = channels.get(i);
                if(channel.get('pay_channel_id')==channelItem.get('pay_channel_id'))continue;
                if(channelItem.get('status')==1){
                    Modal.confirm({
                        title:'提示',
                        content:`已开通[${channelItem.get('pay_channel_name')}],是否关闭后开通[${channel.get('pay_channel_name')}]`,
                        onOk:()=>{
                            toggleChannel(false,channelItem.get('storePaychannelId'),false)
                                .then(()=>{
                                    toggleChannel(true,channel.get('storePaychannelId'))
                                })
                        }
                    });
                    return;
                }
            }
        }
        this.modal = Modal.confirm({
            title: '确认提醒',
            content: `确定${open?'打开':'关闭'}【${channel.get('pay_channel_name')}】？`,
            onOk:()=>{
                toggleChannel(open,channel.get('storePaychannelId'));
            }
        });
    }
    getLogs(pageIndex){
        this.setState({busy:true});
        reducer.getLog(pageIndex).catch(err=>{
            message.error(err.message);
        }).finally(()=>{
            this.setState({busy:false});
        });
    }
    handleSearchResult(merchants){
        if(merchants.size>0)this.onStoreSelect(merchants.get(0));
    }
    render(props,state){
        let merchants = state.get('merchants');
        let selectedMerchant = state.get('selectedMerchant');
        const storeId = selectedMerchant?selectedMerchant.get('store_id'):null;
        const tabPanelOption = {disabled:!state.get('selectedMerchant')};
        const habits = state.get('habits').toJS();
        return (<div>
            <Row gutter={8}>
                <Col span={8}>
                    <SearchForm {...props} onData={this.handleSearchResult.bind(this)} ref="searchForm"/>
                    <hr className="gutter-top"/>
                    <div className={classNames('text-muted','small','gutter-v',{'hidden':merchants.size<=0})}>搜索到{merchants.totalCount}条匹配的信息,显示最近30条记录</div>
                    <Table onRowClick={this.onStoreSelect.bind(this)}
                           className="stores-table x-scroll"
                           pagination={false} columns={columns} dataSource={merchants.toArray()}
                           rowKey={record=>record.get('store_id')}
                           rowClassName={(record)=>{
                               return storeId==record.get('store_id')?'selected':'unselected';
                           }}/>
                </Col>
                <Col span={16}>
                    <Tabs activeKey={state.get('tabKey')} type="card" onChange={this.onTabChange.bind(this)}>
                        <TabPane tab="支付通道" key="payChannel" {...tabPanelOption}>
                            {selectedMerchant&&selectedMerchant.get('modes')?
                                <div className="gutter"><OpenOtherPayMode merchant={selectedMerchant}/></div>:null}
                            <div className="gutter">
                                <PayModeList merchant={selectedMerchant} busy={this.state.busy}
                                             onSortEnd={this.handlePayModeSortEnd.bind(this)}
                                             onPayModeToggle={this.handlePayModeToggle.bind(this)}
                                             onPayChannelToggle={this.handlePayChannelToggle.bind(this)}/>
                            </div>
                        </TabPane>
                        <TabPane tab="收银习惯" key="habit" {...tabPanelOption}>
                            <Habits habits={habits} mcode={selectedMerchant&&selectedMerchant.get('mcode')}/>
                        </TabPane>
                        <TabPane tab="操作日志" key="logs" {...tabPanelOption}>
                            <Logs logs={state.logs} busy={this.state.busy} next={()=>this.getLogs('next')}/>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>)
    }
}

const SortableItem = ({value}) => <li>{value}</li>;
const SortableList = ({items}) => {
    return (
        <ul>
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`} index={index} value={value} />
            )}
        </ul>
    );
};
const PayModeList = ({merchant,busy,onSortEnd,onPayModeToggle,onPayChannelToggle})=>{
    let modes = null;
    if(!merchant)return modes;
    modes = merchant.get('modes');
    if(modes && modes.size){
        let sortItems = [];
        modes.map(mode=>{
            sortItems.push(<Card key={mode.get('pay_mode_id')} className="gutter-bottom">
                <Row>
                    <Col span={3}>
                        <div className="gutter-v">
                            <Switch onChange={flag=>onPayModeToggle(flag,mode)} checked={mode.get('status')==1} checkedChildren={'开'} unCheckedChildren={'关'}/>
                            <div className="gutter-top-lg text-md">{mode.get('pay_mode_name')}</div>
                        </div>
                    </Col>
                    <Col span={21}>
                        <PayChannelList merchant={merchant} mode={mode} onPayChannelToggle={onPayChannelToggle}/>
                    </Col>
                </Row>
            </Card>)
        });
        modes = <SortableList items={sortItems} onSortEnd={onSortEnd}/>;
    }else {
        modes = busy?<div style={{height:300}}></div>:<Alert message="没有配置支付通道" type="warning"/>
    }
    return <Spin size='large' spinning={busy}>{modes}</Spin>;
};
const PayChannelList = ({merchant,mode,onPayChannelToggle})=>{
    let channels = mode.get('channels');
    return (<div>
        {channels.map(channel=>{
            return (
                <Row key={channel.get('pay_channel_id')}>
                    <Col span={15}>
                        <div className={className('channel-item','clearfix',{'disabled':channel.get('status')!=1})}>
                            <span>{channel.get('pay_channel_name')}</span>
                            <label className="pull-right">{channel.get('bind_en_num')}</label>
                        </div>
                    </Col>
                    <Col span={9}>
                        <div className="gutter channel-op">
                            <Switch onChange={flag=>onPayChannelToggle(flag,channel,mode)}
                                    checked={channel.get('status')==1}
                                    className='inline-block' checkedChildren={'开'} unCheckedChildren={'关'}/>
                            <Link className="gutter-left-lg font-md inline-block" to={{pathname:`/cashier/config/store/${merchant.get('mcode')}`,query:{cid: channel.get('pay_channel_id'),mid:channel.get('pay_mode_id'),spid:channel.get('storePaychannelId')}}}>
                                <Auth to={CASHIER_CONFIG_QUERY}>
                                    <Icon type="edit" role="button"/>
                                </Auth>
                            </Link>
                        </div>
                    </Col>
                </Row>
            )
        })}
    </div>)
};
const Habits = React.createClass({
    getInitialState(){
        return {
            busy:false,
            defaultSelected:[],
            selected:[],
            error:null
        }
    },
    componentWillReceiveProps(nextProps){
        if(this.props.mcode !== nextProps.mcode){
            this.setState(this.getInitialState());
            this.getHabits(nextProps.mcode);
        }
    },
    componentDidMount(){
        this.getHabits(this.props.mcode);
    },
    getHabits(mcode){
        if(!mcode)return;
        this.setState({busy:true});
        reducer.getHabits({
            params_type:1,
            mcode:mcode
        }).then(res=>{
            const data = res.data;
            const selected = [];
            if(data){
                data.forEach(item=>{
                    if(item.params_val){
                        selected.push(item.params_key);
                    }
                })
            }
            this.setState({selected,defaultSelected:selected})
        },err=>{
            this.setState({error:err.message});
        }).finally(()=>{
            this.setState({busy:false});
        })
    },
    updateHabits(){
        const params = [];
        this.state.selected.forEach(item=>{
            params.push({
                params_type:1,
                params_key:item,
                params_val:1
            });
        });
        this.setState({busy:true});
        reducer.updateHabits({
            mcode:this.props.mcode,
            storeCashierParams:params
        }).then(()=>{
            this.setState({defaultSelected:this.state.selected});
            message.success('保存成功');
        },err=>{
            Modal.error({
                content:err.message
            })
        }).finally(()=>{
            this.setState({busy:false});
        })
    },
    handleHabitChange(checkedValues){
        this.setState({selected:checkedValues});
    },
    isDirty(){
        return this.state.selected.join('') !== this.state.defaultSelected.join('');
    },
    render(){
        const {habits} = this.props;
        return <Spin spinning={this.state.busy}>
            <div className="habit">
                <label className="pull-left">门店收银习惯：</label>
                <div className="pull-left fields">
                    {this.state.error?
                        <Alert type="warning" description={this.state.error}/>:
                        <CheckboxGroup onChange={this.handleHabitChange} options={habits} value={this.state.selected}/>
                    }
                </div>
                <div className="clearfix"/>
                <div className="gutter" style={{paddingLeft:'7em'}}>
                    <Button type='primary' disabled={!this.isDirty()} onClick={this.updateHabits}>保存</Button>
                </div>
            </div>
        </Spin>
    }
});
//未开通的其他支付方式
const OpenOtherPayMode = React.createClass({
    contextTypes:{
        router: React.PropTypes.object
    },
    handleSelected(payment){
        if(!payment.length)return;
        let mode = payment[0],
            channel = payment[1];
        let merchant = this.props.merchant;
        this.context.router.push({
            pathname:`/cashier/config/store/${merchant.get('mcode')}`,
            query:{mid:mode,cid:channel}
        });
    },
    transferOptions(options){
        const modes = this.props.merchant.get('modes');
        if(!modes)return [];
        const channels = [];
        modes.map(item=>{
            item.get('channels').map(channel=>{
                channels.push(channel.get('pay_channel_id'));
            })
        });
        options.forEach((item)=>{
            if(item.children){
                item.children = item.children.filter((channel)=>{
                    return channels.indexOf(channel.pay_channel_id) == -1;
                });
            }
        });
        options = options.filter(opt=>{
            return opt && opt.children && opt.children.length;
        });
        return options;
    },
    render(){
        return(<div>
            <label>新增支付通道：</label>
            <PaymentCascader width={300} notFoundContent={<span>没有更多通道了</span>} transfer={this.transferOptions} params={{status:1}} placeholder="请选择支付通道" onChange={this.handleSelected}/>
        </div>)
    }
});
//操作日志
const Logs = React.createClass({
    getInitialState(){
        return {selectedLog:null,jsonView:true};
    },
    showDetail(log){
        this.setState({selectedLog:log});
    },
    hideDetail(){
        this.setState({selectedLog:null});
    },
    changeLogDataStyle(){
        this.setState({jsonView:!this.state.jsonView});
    },
    getLogDetail(){
        if(!this.state.selectedLog)return null;
        let logData = this.state.selectedLog.log_data;
        if(logData){
            try{
                logData = window.JSON.parse(logData);
            }catch (e){
                logData = {};
                console.warn('log parse error',e);
            }
        }
        return <div>
            <div>
                <label>调用者：</label>
                <span>{this.state.selectedLog.invokerDes}</span>
            </div>
            <div>
                <label>支付通道：</label>
                <span>{this.state.selectedLog.pay_channel_name}</span>
            </div>
            <div>
                <label>用户账户：</label>
                <span>{this.state.selectedLog.userName}</span>
            </div>
            <div>
                <label>添加时间：</label>
                <span>{this.state.selectedLog.create_time}</span>
            </div>
            <div>
                <label>数据包：</label>
                <div className="log-view">
                    <a className="log_style_btn" onClick={this.changeLogDataStyle}>{this.state.jsonView?'源码':'格式化'}</a>
                    {this.state.jsonView?
                        <JSONTree data={logData}/>:
                        <Input autosize readOnly type='textarea' defaultValue={this.state.selectedLog.log_data}/>
                    }
                </div>
            </div>
        </div>
    },
    render(){
        const busy = this.props.busy;
        let logs = reducer.state.get('logs');
        if(logs instanceof Error)return <Alert message={`日志加载失败:${logs.message}`} type="error"/>;
        if(!logs)return null;
        logs = logs.toJS();
        let pending = <Spin size='small'/>;
        if(!busy){
            let hasNext = logs.total/logs.pageSize > logs.pageNum;
            pending = hasNext?
                <a onClick={this.props.next}>查看更多日志...</a>:
                <span className="text-muted">没有更多日志了</span>;
        }
        return <div className="logs x-scroll">
            <Spin spinning={busy}>
                <Timeline pending={pending}>
                    {logs.data.map((log)=>{
                        return <Timeline.Item key={log.id} color={log.invoker==1?'blue':'red'}>
                            <p className={log.invoker==1?'text-primary':'text-danger'}>{log.create_time}</p>
                            <a className="text-normal" onClick={()=>this.showDetail(log)}>【{log.invokerDes}】{log.userRealName} {log.description}</a>
                        </Timeline.Item>
                    })}
                </Timeline>
            </Spin>
            <Modal title="日志详情" className="modal-no-cancel" visible={this.state.selectedLog!=null}
                onOk={this.hideDetail} onCancel={this.hideDetail}>
                {this.getLogDetail()}
            </Modal>
        </div>
    }
});