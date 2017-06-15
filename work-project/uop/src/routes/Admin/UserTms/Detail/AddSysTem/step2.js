import React from 'react';
import {Button,notification,Progress,Alert,Card,Row,Col,Icon} from 'antd';
import {prevStep,getStepData,saveAcessCode,nextStep} from './reducer'
import Tablerole from '../../../../../components/ChooseRole'
import {Link} from 'react-router';

export default class Component extends React.Component{

  state={sysList:[],percent:0,loading:true}

  getSysList(list){this.setState({sysList:list})}
  onSave(){
    const {sysList}=this.state;
    const query={
      login_account:this.props.query.account,
      userId:this.props.query.id,
      name:this.props.query.name
    };
    let isSave=true;
    if(sysList.length==0){
      getStepData().map((item)=>{
        if(!item.role_id){
          notification.error({message:item.sys_name+"未选择角色"})
          isSave=false;
        }
      })
    }else {
      sysList.map((item)=>{
        if(!item.access_roleId){
          notification.error({message:item.sys_name+"未选择角色"})
          isSave=false;
        }
        delete item.create_time;
        delete item.update_time;
      })
    }
    const params={...query,outerSystems:sysList};
    if(isSave){
      let num=0;
      let me=this;
     let timer=setInterval(function () {
        num++;
       me.setState({loading:false,percent:num});
       if(num==98)clearInterval(timer);
     },100)
      saveAcessCode(params).then((res)=>{
        let success=[],error=[];
        res.data.map((item)=>{
          if(item.bandingSuc==0){success.push(item)}
          if(item.bandingSuc==1){error.push(item)}
        })
        clearInterval(timer)
        this.setState({percent:100});
        nextStep([{bindingSysSuccess:success,bindingSysError:error}])
      }).catch((err)=>{
        this.setState({loading:true,percent:0});
        clearInterval(timer)
        notification.error({message: err.message})
      })
    }
  }
  render(){
    const {loading,percent,bindingSysSuccess,bindingSysError,showCard}=this.state;
    return(
      <div className="checkDiv">
        {loading?<Tablerole list={getStepData()} getSysList={this.getSysList.bind(this)}/>:
        <div className="loadingProgress">
          <Progress type="circle" percent={percent}/>
        </div>}
        {loading&&<div className="footer text-center">
          <Button type='primary' onClick={this.onSave.bind(this)}>确认</Button>
          <Button onClick={()=>prevStep()}>返回修改</Button>
        </div>}
      </div>

    )
  }
}
