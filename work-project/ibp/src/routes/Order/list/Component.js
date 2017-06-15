'use strict';
import React from 'react';
import {Table,Spin} from 'antd';
import SearchForm from './SearchForm.component';
import {getStatusText} from '../../../model/Order';
import * as reducer from './reducer';
import {Link} from 'react-router';

const columns = [{
    title: '订单号',
    dataIndex: 'agent_instalment_bill_id',
    render(id){
        return <Link to={`/order/${id}`}>{id}</Link>
    }
}, {
    title: '订单描述',
    dataIndex: 'des',
}, {
    title: '代理商',
    dataIndex:'agent_name'
}, {
    title: '已支付次数/总支付次数',
    render(){
        let record = arguments[1];
        return <span>{record.completed_num}/{record.num}</span>
    }
},{
    title: '每次支付金额(元)',
    render(){
        let record = arguments[1];
        return <span>{(record.unit_principal+record.unit_interest)/100}</span>
    }
},{
    title: '状态',
    dataIndex: 'status',
    render(status){
        return <label className="status-label" data-status={status}>{getStatusText(status)}</label>
    }
}];

export default class extends React.Component{

    handelTableChange(pagination){
        reducer.setPagination(pagination);
        document.getElementById('submit-btn').click();
    }

    render(state){
        const pagination = state.get('pagination');
        pagination.showTotal = (total) =>`共搜索到 ${total} 个结果`;
        return <div>
            <SearchForm/>
            <Spin spinning={state.get('pending')}>
                <Table bordered className='data-table' columns={columns}
                       pagination={pagination}
                       onChange={this.handelTableChange.bind(this)}
                       rowKey={(record,index)=>index}
                       dataSource={state.get('list')}/>
            </Spin>
        </div>
    }
}