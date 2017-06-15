import React from 'react';
import { Form, Icon, Input, Button, Checkbox ,notification} from 'antd';
const {MERCHANT_JUMP_URL} =require( "../../../config/url.config");
import './index.scss';
import axios from 'axios';
import User from '../../../model/User';
const userSave='BmsSave';
const LoginTime='Bms_Login_Time';
const SavePawTime=1000*60*60*24*7;//保存密码周期
const SaveLoginTime = 1000*60*30;//保存登录周期

export function getStore(key) {
  var obj = localStorage.getItem(key);
  try {
    obj = JSON.parse(obj);
  } catch (e) {
  }
  return obj || null;
}
export function setStore(k,v) {localStorage.setItem(k,typeof v=== "object" ? JSON.stringify(v) : v );}



{
  let lastLogin=getStore(LoginTime);
  if(lastLogin&&(Date.now()-new Date(lastLogin)>=SavePawTime)){
    if(getStore(userSave)){
      let newU=getStore(userSave);
      newU.password='';
      newU.remember=false;
      setStore(userSave,newU);
    }
    setStore(LoginTime,null)
  }
}
class Login extends React.Component {


    componentWillMount(){
        let token =this.props.location.query.token;
        if(!token) return;
        User.loginWithToken(token).then(res=>{
            this.props.router.push("service/personal/home");
        }).catch(()=>{
            this.setState({error:true})
        })
    }


    constructor(props) {
        super(props);
        this.state = {error: !this.props.location.query.token}
    }

    render() {
        console.log(this.state.error)
        return (

        <div className="request-loading-container">
            {
                this.state.error?<div>您尚未登录或者登录已过期
                        <div>
                            <Button className="margin-top">
                                <a href={MERCHANT_JUMP_URL}>去登录</a>
                            </Button>
                        </div>
                    </div>: <Icon className="request-loading-icon" type="loading"/>
                  
            }
           
        </div>
           
        );
    }
}

export default Form.create()(Login);


