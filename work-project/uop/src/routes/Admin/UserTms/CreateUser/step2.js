import React from 'react';
import axios from 'axios';

import { Checkbox ,Popconfirm,Row,Col,Switch,notification,Button} from 'antd';
import {nextStep,getStep2Data,getSysList} from './reducer';
import CheckSystem from '../../../../components/ChooseSystem'

export default class Component extends React.Component{
  state={plainOptions:[],loading:false,btnLoading:false}
  componentWillMount(){
    getSysList().then((res)=>{
      const arr=res.data
      const arr1=getStep2Data();
      arr.map((item)=>{
        item.checked=false;
        axios.post('outerSysRole/getInputSysRoles',{sys_no:item.sys_no}).then((res)=>{
          if(res.data.length)item.roles=res.data[0].roles;
        }).catch((err)=>{
          notification.error({message: item.sys_name+"获取角色失败"});
        })
      })
      if(arr1.length){
        arr.map((item)=>{
          arr1.map((key)=>{
            if(item.sys_name==key.sys_name){item.checked=true}
          })
        })
      }
      this.setState({plainOptions:arr,loading:true})
    }).catch((err)=>{
      notification.error({message: err.message})
    })
  }
  onChangeChecked(e){this.setState({plainOptions:e})}
  isnextStep(){
    const {plainOptions}=this.state;
    const checkedTrue=[];
    plainOptions.map((item)=>{
      if(item.checked){checkedTrue.push(item);}
    });
    if(checkedTrue.length){
      nextStep(checkedTrue)
    }else {
      notification.error({message: '未选择系统'})
    }
  }
  render(){
    return (
      <div>
        {this.state.loading&&<CheckSystem plainOptions={this.state.plainOptions}
                                          onChangeChecked={this.onChangeChecked.bind(this)}
        />}
        <div className="footer text-center"><Button type='primary' onClick={this.isnextStep.bind(this)}>下一步</Button></div>
      </div>
    )
  }
}
