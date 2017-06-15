import React from 'react';
import { Form, Icon, Input, Button, Checkbox ,notification} from 'antd';
import './index.scss';
import axios from 'axios';
import User from '../../../model/User';
const userSave='agentSave';
const LoginTime='Agent_Login_Time';
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
    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
        if (getStore(userSave)) {
            const newU    = getStore(userSave);
            newU.password = '';
            newU.remember = false;
            setStore(userSave, newU);
        }
    }

    constructor(props) {
        super(props);
        this.state = {loading: false}
    }

    render() {
        var form                                                  = this.props.form;
        const {getFieldDecorator, getFieldsValue, validateFields} = form;
        const FormItem                                            = Form.Item;
        const userNameFun                                         = () => {
            if (getStore(userSave)) {
                if (getStore(userSave).remember || getStore(userSave).username) {
                    return getStore(userSave);
                }
            } else {
                return {
                    username: '',
                    password: '',
                    remember: false
                }
            }
        }
      return (

            <div className="login-content">

                <Form onSubmit={(e) => {
                    e.preventDefault();
                    validateFields((err, value) => {
                        if (!err) {
                            const parmas={
                              username:value.username.trim(),
                              password:value.password,
                              remember:value.remember
                            }
                            if (value.remember) {
                                setStore(userSave, parmas)
                            }
                            if (!getStore(LoginTime) && value.remember) {
                                setStore(LoginTime, new Date())
                            }
                            this.setState({loading: true})
                            User.login(parmas).then((data) => {
                                if (data) {
                                    
                                    this.props.router.push('service');
                                } else {
                                    notification.error({
                                        message: '无效用户'
                                    })
                                    this.setState({loading: false})
                                }
                            }).catch((err) => {
                              
                                this.setState({loading: false})
                            });
                        }
                    })
                }} className="login-dialog">
                    <div style={{borderBottom: '1px solid #ddd', marginBottom: 15}}>
                        <h4>登录</h4>
                    </div>
                    <FormItem>
                        {getFieldDecorator('username', {
                            initialValue: userNameFun().username,
                            rules       : [{required: true, message: '请输入您的登录账号'}],
                        })(
                            <Input addonBefore={<Icon type="user"/>} placeholder="请输入您的登录账号"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            initialValue: userNameFun().password,
                            rules       : [{required: true, message: '请输入您的登录密码'}],
                        })(
                            <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="请输入您的登录密码"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue : userNameFun().remember,
                        })(
                            <Checkbox>记住密码</Checkbox>
                        )}


                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                                loading={this.state.loading}>
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Login);


