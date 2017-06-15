"use strict";
import React from 'react';
import {Progress,Alert,Button} from 'antd';
const reducer = require('../reducer');

export default React.createClass({

    getInitialState(){
        return {percent:0,status:null,error:null}
    },

    componentDidMount(){
        this.setState({status:'active',percent:20});
        reducer.updateConfig().then(()=>{
            this.setState({status:'success',percent:100});
        },err=>{
            this.setState({status:'exception',percent:80,error:err.message})
        })
    },

    getMessage(){
        switch (this.state.status){
            case 'exception':
                return <Alert message={this.state.error} type="error"/>;
            case 'active':
                return <span>正在批量设置门店的收银参数，请稍候</span>;
            case 'success':
                return <span className="text-success">门店批量设置完成！</span>
        }
    },
    complete(){
        reducer.resetState();
    },
    render(){
        return (<div className="step step4">
            <div className="tip">
                <Progress className="progress" width={100} type="circle" status={this.state.status} percent={this.state.percent}/>
                <label className="msg">
                    {this.getMessage()}
                </label>
            </div>
            <hr/>
            <div className="text-center">
                {this.state.status=='exception'?
                    <Button onClick={reducer.preStep} type='primary'>上一步</Button>:
                    null}
                <Button type='primary' className='gutter-left' onClick={this.complete}>完成</Button>
            </div>
        </div>)
    }
})