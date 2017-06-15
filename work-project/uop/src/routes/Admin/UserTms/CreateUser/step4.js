import React from 'react';
import {Button,notification,Progress,Alert,Card,Row,Col,Icon} from 'antd';
import {Link} from 'react-router';
import {getStep3Data,getStep1Data} from './reducer';



export default class Component extends React.Component {


  render(){
    const data=getStep3Data();
    return(
      <div>
        <Alert message={`已授权成功${data.bindingSysSuccess.length}个系统，失败${data.bindingSysError.length}个！`} type="info" showIcon/>
        <Card title={<span>{getStep1Data()[0].name}</span>}>
          {data.bindingSysSuccess.length?<div className="bindsuccess">
            <div className="topIcon">
              <Icon type="check-circle"/>
              <h5>授权成功</h5>
            </div>
            {data.bindingSysSuccess.map((item,index)=>{
              return (
                <Row key={index}>
                  <Col span="6">【{item.sys_no}】{item.sys_name}</Col>
                  <Col span="6" style={{color:"#999"}}>{item.access_role_name}</Col>
                  <Col span="6" style={{color:"#999"}}>{item.access_account}</Col>
                </Row>
              )
            })}
          </div>:""}
          {data.bindingSysError.length?<div className="binderror">
            <div className="topIcon">
              <Icon type="exclamation-circle-o" />
              <h5>授权失败</h5>
            </div>
            {data.bindingSysError.map((item,index)=>{
              return (
                <Row key={index}>
                  <Col span="6">【{item.sys_no}】{item.sys_name}</Col>
                  <Col span="6" style={{color:"#999"}}>{item.access_role_name}</Col>
                  <Col span="6" style={{color:"#999"}}>{item.access_account}</Col>
                  <Col span="6" style={{color:"#f90"}}>不告诉你失败原因，O(∩_∩)O</Col>
                </Row>
              )
            })}
          </div>:""}
          <div className="link_btn">
            <Link to="/console/user"><Button type='primary'>确认</Button></Link>
          </div>
        </Card>
      </div>
    )
  }
}
