import React from 'react';
import './login.scss';
import {Card,notification} from 'antd';
import LoginForm from './LoginForm';
import Admin from '../../../model/Admin';
'use strict'
class Login extends React.Component {
  state={
    loading:false,
  }
    handleSubmit(e){
        e.preventDefault();
        this.loginForm.validateFields((err,fields)=>{
            if(err)return;
          this.setState({loading:true})
          Admin.login(fields).then(()=>{
            this.setState({loading:false})
            this.props.router.push("/console/user");
          }).catch((err)=>{
            notification.error({message: err.message})
            this.setState({loading:false})
          })
        })
    }
  pushUser(){this.props.router.push("/console/user");}
    render() {
      if(Admin.logged){
        return <div className="logged-user">
          <Card onClick={this.pushUser.bind(this)}>
            <i className="fa fa-user"/>
            <a>您已登录</a>
          </Card>
        </div>;
      }
      return <div className="login-page">
          <Card title='登录' className="login-card" extra={<img src="/img/login-panel-title.png" className="login-extra"/>}>
              <LoginForm onSubmit={this.handleSubmit.bind(this)} ref={form=>this.loginForm=form} loading={this.state.loading}/>
          </Card>
      </div>
    }
}

export default Login;
