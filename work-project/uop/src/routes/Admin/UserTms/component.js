import React from 'react';
import axios from 'axios';
'use strict'
import { Form, Icon, Input, Button, Checkbox ,notification,Popconfirm} from 'antd';
import {Link} from 'react-router';
import '../../../styles/adminstyle.scss';
import {Table} from '../../../components/Table';
const Search = Input.Search;
let setTable;
export default React.createClass({
  onUserState(id,status){
    const params={
      userId:id,
      status:status==1?2:1
    }
    axios.post('user/updateUser',params).then((res)=>{
      setTable.update()
    }).catch((err)=>{
      notification.error({message: '修改失败',description: err.message})
    })
  },
  onSearch(value){
    if(value&&typeof (value)!="number")value=value.trim();
    if(value+""){setTable.update({login_account:value})}else {setTable.update()}
  },
  render(props,state){
    const columns=[
      {
        title:'用户名',
        render:(text, record, index)=><Link to={`/console/user/detail?userid=${record.user_id}`}>{record.login_account}</Link>
      },
      {title:'姓名',dataIndex: 'name'},
      {title:'手机号',dataIndex: 'contact_phone'},
      {title:'创建时间',dataIndex: 'create_time'},
      {title:'授权系统数',dataIndex: 'sys_num',},
      {title:'操作',
        key: 'action',
        render:(text, record, index)=>{
          let status=record.status;
          return (
            <span>
              {record.login_account!="admin"&&<Popconfirm title={<span>您是否要<b style={{color:"#f90"}}>{status==1?'冻结':'启用'}</b>用户【{record.login_account}】?</span>} onConfirm={()=>this.onUserState(record.user_id,record.status)}><a>{status==1?'冻结用户':'启用用户'}</a></Popconfirm>}
            </span>
              
        );}
      },
    ];
    return (
    <div style={{paddingTop:15}}>
      <span>用户名：</span>
      <Search
        placeholder="请输入用户名"
        style={{ width: 200 }}
        onSearch={value=>setTable.update({login_account:value})}
      />
      <hr/>
      <div style={{textAlign:"right",marginBottom:15}}><Button type="primary"><Link to="/console/user/create">新建用户</Link></Button></div>
      <Table
        url="user/getUsers"
        columns={columns}
        rowKey={'user_id'}
        bordered
        ref={(t)=>setTable=t}
      />
    </div>
    )
  }
})
