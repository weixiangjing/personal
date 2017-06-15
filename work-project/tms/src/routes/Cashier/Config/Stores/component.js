"use strict";
import React from 'react';
import {Spin,Steps} from 'antd';
const Step = Steps.Step;
import './style.scss';
import classnames from 'classnames';

import Step1 from './step/step.1';
import Step2 from './step/step.2';
import Step3 from './step/step.3';
import Step4 from './step/step.4';

const steps = [{
    title: '选择配置内容及通道',
    content: Step1
}, {
    title: '确认门店列表',
    content: Step2
}, {
    title: '配置收银参数',
    content:  Step3
}, {
    title: '完成',
    content: Step4
}];

export default React.createClass({

    componentWillMount(){
        this.leaveHook = this.props.router.setRouteLeaveHook(this.props.route,()=>{
            if(this.storeState.get('step')>0)return '您的操作未完成，离开后当前数据无法保存';
        });
    },

    componentWillUnmount(){
        if(this.leaveHook)this.leaveHook();
    },

    render(props,state){
        let step = state.get('step');
        if(isNaN(step))step = 0;
        step = Math.max(0,Math.min(step,steps.length-1));
        const CurrentStep = steps[step].content;
        return (<Spin spinning={state.get('busy')}>
            <div className="steps">
                <Steps current={step}>
                    {steps.map((step,i)=>{
                        return (<Step key={i} title={step.title}/>)
                    })}
                </Steps>
            </div>
            <div className="steps-content">
                <CurrentStep {...props} state={state}/>
            </div>
        </Spin>)
    }
});