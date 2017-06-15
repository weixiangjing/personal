import React from 'react';
import { Form, Icon, Input, Button, Checkbox ,notification,Table,Popconfirm,Row,Col,Steps,Switch} from 'antd';
import {Link} from 'react-router';
import '../../../../../styles/adminstyle.scss';
import {resetState} from './reducer'
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
const Step = Steps.Step;
const muemStep=[
  {title:'选择授权登录系统',step:Step1},
  {title:'选择系统角色',step:Step2},
  {title:'完成',step:Step3},
]


export default class Component extends React.Component{


  componentWillUnmount(){resetState()}
  render(props,state){
    let step=props.get('step');
    if(isNaN(step))step = 0;
    const CurrentStep = muemStep[step].step;
    return (
      <div>
        <div className="detailTop">
          <div className="Icon60">
            <Icon type="user"></Icon>
          </div>
          <span>添加授权系统</span>
          <Button><Link to="/console/user">返回</Link></Button>
        </div>
        <div className="step_div">
          <Steps className="step" current={step}>
            {muemStep.map((item,index)=>{
              return(<Step key={index} title={item.title}/>)
            })}
          </Steps>
          <CurrentStep query={this.props.location.query}/>
        </div>
      </div>
    )
  }
}
