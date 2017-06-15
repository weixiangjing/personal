"use strict";
import React from 'react';
import './style.scss';
import {Card,Alert,notification} from 'antd';
import LoginForm from './LoginForm';
import User from '../../../model/User';
import {Link} from 'react-router';
import QueueAnim from 'rc-queue-anim';

export default class extends React.Component {
    state = {
        busy: false,
        error: null
    };
    handleSubmit(e) {
        e.preventDefault();
        if(this.state.error)this.setState({error: null});
        this.loginForm.validateFields((err, fields) => {
            if (err)return;
            this.setState({busy: true});
            fields.username=fields.username.trim();
            fields.password=fields.password.trim();
            User.login(fields).then(({userMenus}) => {
                this.setState({busy: false});
              //if(User.get('menuMap').length>0)this.props.router.push("/order");
              const auth=User.get('authMap');
              if(userMenus.length>0){
                this.props.router.push(Object.keys(auth)[0]);
              }else {
                notification.error({message:"无权访问"});
              }
            }).catch((err) => {
                this.setState({error: err.message,busy: false})
            });
        })
    }
    render() {
        return <div id="login-page">
            <QueueAnim type={['top', 'bottom']} ease={['easeOutQuart', 'easeInOutQuart']} duration={800}>
                <div key="ani-key1">
                    <Card title='登录' className="login-card"
                          extra={<img src="/img/login-panel-title.png" className="login-extra"/>}>
                        <div className="error-tip">
                            {this.state.error && <Alert message={this.state.error} type="warning" showIcon className="animated bounce"/>}
                        </div>
                        {User.logged?
                            <div className="user-info">
                                <Link to="/">
                                    <p className="avatar"
                                       style={{backgroundImage:`url(${User.get('avatar')})`}}/>
                                    <div>{User.get('name')}</div>
                                </Link>
                                <p onClick={()=>User.logout()} className="gutter-top-lg"><a>更换账号</a></p>
                            </div>:
                            <div>
                                <LoginForm onSubmit={this.handleSubmit.bind(this)} ref={form => this.loginForm = form}
                                           busy={this.state.busy}/>
                                <div className="forget-pwd text-center">
                                    <Link to="/user/forgetPassword">忘记密码？</Link>
                                </div>
                            </div>
                        }
                    </Card>
                </div>
            </QueueAnim>
        </div>
    }
}
