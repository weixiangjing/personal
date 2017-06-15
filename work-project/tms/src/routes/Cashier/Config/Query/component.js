"use strict";
import React from 'react';
import {Spin,Table} from 'antd';
import {Link} from 'react-router';
import SearchForm from './SearchForm.component';
const reducer = require('./reducer');
import './style.scss'
import {CASHIER_CONFIG_QUERY} from '../../../../config/auth_func';
import {Auth} from '../../../../components/ActionWithAuth';

const columns = [{
    title: 'MCODE',
    dataIndex: 'mcode',
    sorter:true
}, {
    title: '门店名称',
    dataIndex: 'store_name',
}, {
    title: '支付通道',
    render(){
        let record = arguments[1];
        return <span>{record.pay_mode_name}/{record.pay_channel_name}</span>
    }
}, {
    title: '绑定设备',
    dataIndex: 'bind_en_num',
}, {
    title: '状态',
    dataIndex: 'status',
    render(status){
        return status==1?
            <span className="text-success">使用中</span>
            :<span className="text-muted">已关闭</span>
    }
},{
    title: '最后更新时间',
    dataIndex: 'update_time',
    sorter:true
},{
    title: '操作',
    render(){
        let record = arguments[1];
        return <Auth to={CASHIER_CONFIG_QUERY}>
            <Link to={{pathname:`/cashier/config/store/${record.mcode}`,query:{mid:record.pay_mode_id,cid:record.pay_channel_id}}}>收银设定</Link>
            </Auth>
    }
}];

module.exports = React.createClass({
    handelTableChange(pagination,filters,sort){
        reducer.setPagination(pagination);
        reducer.setSort(sort);
        setTimeout(()=>{
            document.getElementById('submit-btn').click();
        },0)
    },
    componentDidMount(){
        const form = this.storeState.get('formData');
        if(form)this.searchForm.setFieldsValue(form);
    },
    render(props,state){
        const pagination = state.get('pagination');
        pagination.showTotal = (total) =>`共搜索到 ${total} 个结果`;
        return (<div>
            <SearchForm ref={form=>{this.searchForm = form}}/>
            <Spin spinning={state.get('pending')}>
                <Table bordered className='data-table' columns={columns}
                       onChange={this.handelTableChange}
                       pagination={pagination}
                       rowKey={(record,index)=>index}
                       dataSource={state.get('list')}/>
            </Spin>
        </div>)
    }
});