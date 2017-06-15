import React from 'react';
import axios from 'axios';

import { Table ,Popconfirm,Row,Col,Switch,Icon,notification,Select,Input} from 'antd';
import './style.scss'
const Option = Select.Option;
export default class Component extends React.Component{

  state={roleList:[],sysList:[]}
  componentDidMount(){
    /*const {roleList}=this.state;
    const {list}=this.props;
    list.map((item)=>{
      axios.post('outerSysRole/getInputSysRoles',{sys_no:item.sys_no}).then((res)=>{
        if(res.data.length)roleList.push(res.data[0]);
        this.setState({roleList:roleList})
      }).cacth((err)=>{
        notification.error({message:err.message})
      })
    })*/
  }
  changeValue(value,record,str){
    const {sysList}=this.state;
    let obj=new Object();
    if(str=="role"){
      let arr=value.split("&")
      obj.access_roleId=arr[0];
      obj.access_role_name=arr[1];
    }
    if(str=="account"&&value.target.value)obj.access_account=typeof (value.target.value)=='number'?value.target.value:value.target.value.trim();
    let pushobj={...obj,...record}
    console.log(obj)
    if(sysList.length){
      let isPush=true;
      sysList.map((item)=>{
        if(item.sys_no==record.sys_no){
          if(str=="role"){
            let arr=value.split("&")
            item.access_roleId=arr[0];
            item.access_role_name=arr[1];
          }
          if(str=="account"&&value.target.value)item.access_account=typeof (value.target.value)=='number'?value.target.value:value.target.value.trim();
          isPush=false
        }
      })
      if(isPush)sysList.push(pushobj)
    }else {
      sysList.push(pushobj)
    }
    this.setState({sysList})
    this.props.getSysList(sysList)
  }
  render(){
    const {roleList}=this.state;
    const columns=[
      {
        title:'系统编码',
        dataIndex: 'sys_no'
      },
      {title:'系统名称',dataIndex: 'sys_name'},
      {
        title:'选择角色',
        render:(text, record, index)=>{
          return (
            <Select style={{ width: '100%' }}
                    allowClear
                    onSelect={(e)=>this.changeValue(e,record,"role")}
            >
              {record.roles.map((item,i)=>{
                return(
                  <Option value={item.role_id+"&"+item.role_name} key={i}>{item.role_name}</Option>
                )
              })}
            </Select>
          )
        }
      },
      {
        title:'关联账户',
        render:(text, record, index)=>{return <Input style={{ width: '100%' }} onChange={(e)=>this.changeValue(e,record,"account")}/>}
      },
    ];
    const {list}=this.props;
    return(
      <Table
          columns={columns}
          dataSource={list}
          rowKey={'sys_no'}
          bordered
          className="TableList"
          pagination={false}
        />


    )
  }
}
