import React from 'react';
import { Checkbox ,Popconfirm,Row,Col,Switch,Icon,Button} from 'antd';
import './style.scss'



export default class Component extends React.Component{
  state  = {
    checked:false,
    allchecked:false,
    plainOptions: []
  }
  componentWillMount(){
    const options=this.props.plainOptions;
    let checked=true;
    options.map((item)=>{
      if(item.checked==false)checked=false;
    })
    this.setState({plainOptions:options,allchecked:checked})
  }
  onChangeSwicth(checked){
    const {plainOptions}=this.state;
    const {onChangeChecked}=this.props;
    plainOptions.map((item)=>{
      item.checked=checked;
    })
    this.setState({plainOptions,allchecked:checked})
    onChangeChecked(plainOptions)
  }
  onChangeBox(e,name){
    const {plainOptions}=this.state;
    const {onChangeChecked}=this.props;
    plainOptions.map((item)=>{
      if(item.sys_name==name){
        item.checked=e.target.checked
      }
    })
    this.setState({plainOptions})
    onChangeChecked(plainOptions)
  }
  render(){
    const {plainOptions}=this.state;
    return (
      <div className="checkDiv">
        {plainOptions.length>0&&<div style={{marginBottom:20}}>全选：<Switch onChange={this.onChangeSwicth.bind(this)} checkedChildren={'开'} unCheckedChildren={'关'} checked={this.state.allchecked}/></div>}
        <div className="CheckList">
          {plainOptions.map((item,index)=>{
            return <Checkbox key={index} className="sysCheck" checked={item.checked} onChange={(e)=>this.onChangeBox(e,item.sys_name)}>
              <img src={item.sys_icon?decodeURIComponent(item.sys_icon):"/img/sysicon/default.png"} alt=""/>
              <span>{item.sys_name}</span></Checkbox>
          })}
        </div>
      </div>
    )
  }
}
