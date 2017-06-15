'use strict'
import React from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Spin ,notification,Table,Popconfirm,Row,Col,Switch} from 'antd';
import {Link} from 'react-router';
import {userList,resetPassword,deleteSys,deleteUser,resetState} from './reducer';
import '../../../../styles/adminstyle.scss';



export default class Component extends React.Component{


  componentWillMount(){
    const params={userId:this.props.location.query.userid}
    userList(params)
  }
  onChecked(checked,action){
    let params={userId:this.props.location.query.userid};
    if(action=='update'){
      params.status=checked?1:2
    }else {params.is_delete=2}
    deleteUser(params).then((res)=>{
      if(action=='update'){userList({userId:this.props.location.query.userid})}
      else {this.props.router.push("/console/user")}
    }).catch((err)=>{
      notification.error({message: '修改失败',description: err.message})
    })
  }
  deleteSys(id){
    const userId=this.props.location.query.userid;
    deleteSys(id,userId).then(()=>{
      userList({userId:userId})
    }).catch((err)=>{
      notification.error({message: err.message})
    })
  }
  componentWillUnmount(){resetState();}
  render(props,state){
    const columns=[
      {
        title:'系统编码',
        dataIndex: 'sys_no'
      },
      {title:'系统名称',dataIndex: 'sys_name'},
      {title:'角色',dataIndex: 'access_role_name'},
      {title:'已关联账户',
        render:(text, record, index)=>(<span>{record.rel_Account!="null"?record.rel_Account:"--"}</span>)
      },
      {title:'操作',
        key: 'action',
        render:(text, record, index)=>{
          let status=record.status;
          return (
              <Popconfirm title={`您是否要删除已授权的【${record.sys_name}】?`} onConfirm={()=>this.deleteSys(record.id)}><a>删除</a></Popconfirm>
          );}
      },
    ];
    const userList=props.get('user').toJS()[0];
    return(
      <div>
        <Spin spinning={!props.get('loading')}>
        {props.get('loading')&&<div>
          <div className="detailTop">
            <div className="Icon60">
              <Icon type="user"></Icon>
            </div>
            <span>用户详情</span>
            <Button><Link to="/console/user">返回</Link></Button>
            {userList.login_account!="admin"&&<Popconfirm title={<span>您是否要删除用户【{userList.login_account}】?</span>}
              onConfirm={()=>this.onChecked()}>
              <Button type="danger">删除用户</Button>
            </Popconfirm>}
          </div>
          <div className="basic">
            <h5>基本信息</h5>
            <Row>
              <Col  xs={6} sm={4}>
                <span>用户名：{userList.login_account}</span>
              </Col>
              <Col  xs={6} sm={4}>
                <span>密码：<Popconfirm title={`您是否要重置用户的密码?`} onConfirm={()=>resetPassword(userList.user_id)}><a>重置密码</a></Popconfirm></span>
              </Col>
              <Col  xs={6} sm={4}>
                <span>姓名：{userList.name}</span>
              </Col>
              <Col  xs={6} sm={4}>
                <span>手机号码：{userList.contact_phone}</span>
              </Col>
              <Col  xs={6} sm={4}>
                <span>邮箱：{userList.email}</span>
              </Col>
              <Col  xs={6} sm={4}>
                {userList.login_account!="admin"&&<span>启用：<Switch checked={userList.status==1?true:false} onChange={(e)=>this.onChecked(e,'update')}/></span>}
              </Col>
            </Row>
          </div>
          <h5 style={{lineHeight:'28px'}}>已授权系统<Button style={{float:'right'}}><Link
            to={`/console/user/detail/add?account=${userList.login_account}&id=${userList.user_id}&name=${userList.name}`}
          >添加授权系统</Link></Button></h5>
          <Table
            dataSource={userList.outerSystems}
            columns={columns}
            rowKey={'sys_no'}
            bordered

          />
        </div>}
        </Spin>
      </div>
    )
  }
}
