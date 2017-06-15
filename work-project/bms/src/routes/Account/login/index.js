import React from 'react';
import { Form, Icon, Input, Button, Checkbox ,notification,Spin,Modal,Card} from 'antd';
import './index.scss';
import axios from 'axios';
import User from '../../../model/User';
import OldPathName from '../../../model/SavePathName';

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
      newU.username='';
      newU.remember=false;
      setStore(userSave,newU);
    }
    setStore(LoginTime,null)
  }
}
const to2=(str)=>{
  let total2str = "";
  for (let i = 0; i < str.length; i++) {
    let num10 = str.charCodeAt(i);  ///< 以10进制的整数返回 某个字符 的unicode编码
    let str2 = num10.toString(2);   ///< 将10进制数字 转换成 2进制字符串

    if( total2str == "" ){
      total2str = str2;
    }else{
      total2str = total2str + "/" + str2;
    }
  }
  return encodeURIComponent(total2str);

}
const toGoal=(str)=>{
  let goal = "";
  let arr = decodeURIComponent(str).split("/");
  for(let i=0; i < arr.length; i++){
    let str2 = arr[i];
    let num10 = parseInt(str2, 2); ///< 2进制字符串转换成 10进制的数字
    goal += String.fromCharCode(num10); ///< 将10进制的unicode编码, 转换成对应的unicode字符
  }
  return goal.split("&")[1];
}
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: false,isShowForm:true,loginErr:''}
    }
    componentWillMount(){
      const sys_no=this.props.router.location.query.sys_no;//系统编码
      const url=this.props.router.location.query.origin;//回调根地址
      const login=this.props.router.location.query.login;//回调地址login路由
      const systems=this.props.router.location.query.systems;//回调地址系统选择路由
      let to_url=OldPathName.pathname;//跳转页面--
      const query=this.props.router.location.query;
      if(url){
        this.setState({isShowForm:false})
        const href=location.href;
        const host=href.split("?");
        User.tokenLogin(query,host[0]).then(({userMenus}) => {
          if (userMenus.length > 0) {
            this.setState({loginErr:""})
            if(to_url){
              this.props.router.push(to_url);
              setTimeout(function () {OldPathName.logout()},100)
            }else {
              this.props.router.push(Object.keys(User.authMap)[0]);
            }
          } else {
            notification.error({
              message: '无效用户'
            })
            this.setState({loginErr:"无效用户"})
          }
        }).catch((err) => {
          this.setState({loginErr:err.message})
          Modal.error({
            title     : '错误提示',
            content   : err.message,
            okText    : '确认',
            closable    :false,
            maskClosable    :false,
            onOk() {
              window.close();
            },
          });
        });
      }else {
        this.setState({isShowForm:true})
      }
    }
    loginedPush(){
      const auth=Object.keys(User.authMap);
      if(auth.length){
        this.props.router.push(auth[0]);
      }else {
        notification.error({message:"无效用户"})
      }
    }
    goHome(){User.logout();this.setState({loading:false})}
    render() {
        var form                                                  = this.props.form;
        const {getFieldDecorator, getFieldsValue, validateFields} = form;
        const FormItem                                            = Form.Item;
        const userNameFun                                         = () => {
            if (getStore(userSave)) {
                if (getStore(userSave).remember || getStore(userSave).username) {
                    return getStore(userSave);
                }else {return {}}
            } else {
                return {
                    username: '',
                    password: '',
                    remember: false
                }
            }
        }
      const {isShowForm,loading,loginErr}=this.state;
      return (
            <div className="login-content">
            <Card title='登录' extra={<img src="/img/login-panel-title.png" className="login-extra"/>}>
              {User.logined&&<div>
                  <div onClick={this.loginedPush.bind(this)} className="user-logined">
                    <p className="img-back"><img src="/img/avatar.png" alt=""/></p>
                    <h5>{User.username}</h5>
                  </div>
                  <p onClick={this.goHome.bind(this)} className="gutter-top-lg"><a>更换账号</a></p>
                </div>
              }
              {isShowForm&&!User.logined&&<Form onSubmit={(e) => {
                    e.preventDefault();
                    validateFields((err, value) => {
                        if (!err) {
                            for(let k in value){if(k!='remember')value[k]=value[k].trim()}
                            const parmas={
                              username:value.username,
                              //password:to2(value.username+"&"+value.password),
                              remember:value.remember
                            }
                            if (value.remember) {setStore(userSave, parmas)}
                            if (!getStore(LoginTime) && value.remember) {setStore(LoginTime, new Date())}

                            this.setState({loading: true})
                            User.login(value).then(({userMenus}) => {
                                this.setState({loading: false})
                                if (userMenus.length > 0) {
                                    console.log(Object.keys(User.authMap)[0])
                                    this.props.router.push(Object.keys(User.authMap)[0]);
                                } else {
                                    notification.error({
                                        message: '无效用户'
                                    })
                                }
                            }).catch((err) => {
                                this.setState({loading: false})
                            });
                        }
                    })
                }} className="login-dialog">
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
                          //initialValue: userNameFun().password?toGoal(userNameFun().password):'',
                            rules       : [{required: true, message: '请输入您的登录密码'},{whitespace:true,message: '密码不能为空格'}],
                        })(
                            <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="请输入您的登录密码"/>
                        )}
                    </FormItem>
                    <FormItem className="remember">
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue : userNameFun().remember,
                        })(
                            <Checkbox>记住登录账号</Checkbox>
                        )}


                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                                loading={loading}>
                            登录
                        </Button>
                    </FormItem>
                </Form>}
              {!isShowForm&&
                <Spin size="large" tip={`${loginErr?loginErr:"正在登录系统，请销后..."}`}>
                  <div style={{height:200}}></div>
                </Spin>
              }
            </Card>
            </div>
        );
    }
}

export default Form.create()(Login);


