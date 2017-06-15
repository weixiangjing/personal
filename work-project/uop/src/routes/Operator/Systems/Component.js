'use strict'
import React from 'react';
import {Card,Alert,Spin,Modal} from 'antd';
import './style.scss';
import QueueAnim from 'rc-queue-anim';
import Operator from '../../../model/Operator';
import axios from 'axios';
const DEFAULT_ICON = '/img/sysicon/default.png';

export default React.createClass({
    getInitialState(){
        return {
            busy:false,
            systems:null,
            error:null
        }
    },
    handelSystemItemClick(system){
        const appWindow = window.open("about:blank",system.sys_no);
        Operator.syncInfo().then(()=>{//先检查一下是否登录了
            let url = system.sys_login_url;
            const query = {
                origin:location.origin,
                login:'/login',
                systems:'/systems',
                sys_no:system.sys_no
            }
            if(!(/\?/g.test(url)))url+='?';
            let params = [];
            Object.keys(query).forEach(key=>{
                var val = query[key];
                if(null!=val){
                    val = encodeURIComponent(query[key]);
                    params.push(`${key}=${val}`);
                }
            })
            params = params.join('&');
            appWindow.location.href = url+params;
            console.log('url:',url+params)
        },err=>{
            appWindow.close();
            Modal.error({
                content:err.message
            })
        })
    },
    componentDidMount(){
        this.setState({busy:true});
        axios.post('/outerSys/getAccountBindingSys',{
            userId:Operator.get('userId')
        }).then(res=>{
            this.setState({systems:res.data});
        },err=>{
            this.setState({error:err.message});
        }).finally(()=>{
            this.setState({busy:false});
        })
    },
    render(){
        // let sys = systems[0];
        // for(let i=0;i<20;i++){
        //     systems.push(Object.assign({},sys,{id:Math.random(),sys_no:Math.random(),sys_name:sys.sys_name+'-'+i}))
        // }
        const getContent = ()=>{
            if(this.state.error)return <Alert type="error" message={this.state.error}/>;
            if(this.state.busy)return <div/>;
            let systems = this.state.systems || [];
            return systems.length>0?
                <QueueAnim duration={300}>
                    {systems.map(item=>{
                        return <div key={item.sys_no} className="system-item" title={item.name}>
                            <Card onClick={()=>{this.handelSystemItemClick(item)}}>
                                <div className="icon" style={{backgroundImage:`url(${decodeURIComponent(item.sys_icon) || DEFAULT_ICON})`}}/>
                                <div className="name">{item.sys_name}</div>
                            </Card>
                        </div>
                    })}
                </QueueAnim>:
                <Alert message="没有配置系统" type="warning"/>
        }
        return <div id="system-page">
            <Spin spinning={this.state.busy}>
                {getContent()}
            </Spin>
        </div>
    }
})