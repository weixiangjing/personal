import React from 'react';
import axios from 'axios';

import { Checkbox ,Spin,Row,Col,Switch,Icon,Button,notification} from 'antd';
import {nextStep,getStepData,getSysList,getSysBinding} from './reducer';
import CheckSystem from '../../../../../components/ChooseSystem'

export default class Component extends React.Component{
  state={plainOptions:[],loading:false,btnLoading:false}
  componentWillMount(){
   getSysList().then((res)=>{
     const arr=res.data
     const arr1=getStepData();
     arr.map((item)=>{
       item.checked=false;
       axios.post('outerSysRole/getInputSysRoles',{sys_no:item.sys_no}).then((res)=>{
         if(res.data.length)item.roles=res.data[0].roles;
       }).catch((err)=>{
         notification.error({message: item.sys_name+"获取角色失败"})
       })
     })
     if(arr1.length){
       arr.map((item)=>{
         arr1.map((key)=>{
           if(item.sys_name==key.sys_name){item.checked=true}
         })
       })
     }
     const params={
       login_account:this.props.query.account,
       userId:this.props.query.id,
     }
     getSysBinding(params).then((data)=>{
       /*arr.map((item,index)=>{
         data.data.map((text,i)=>{
           if(item.sys_no==text.sys_no){arr.splice(index,1)}
         })
       })*/
       const loop=list=>list.map((item,index)=>{
         data.data.map((text)=>{
           if(item.sys_no==text.sys_no){
             list.splice(index,1);
             loop(list)
           }
         })
       })
       loop(arr);
       this.setState({plainOptions:arr,loading:true})
     }).catch((err)=>{
       notification.error({message: err.message})
     })
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
    const {loading,plainOptions}=this.state;
    return (
      <Spin spinning={!loading}>
        {loading&&<CheckSystem plainOptions={plainOptions}
                     onChangeChecked={this.onChangeChecked.bind(this)}
        />}
        {loading&&plainOptions.length==0&&<div style={{textAlign:"center",height:50}}>没有可选系统</div>}
        {loading&&plainOptions.length>0&&<div className="footer text-center"><Button type='primary' onClick={this.isnextStep.bind(this)}>下一步</Button></div>}
      </Spin>
    )
  }
}
