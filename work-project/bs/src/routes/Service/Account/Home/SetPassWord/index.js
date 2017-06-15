'use strict'
import React from 'react';
import './style.scss';
import {message,Modal,Spin,Button,Icon,Form,Input,Row,Col} from 'antd';
const crypto =require("crypto")
const FormItem = Form.Item;
import axios from 'axios';
import user from '../../../../../model/User';
export default Form.create()(React.createClass({
  getInitialState(){
    return {
      pending:false,
      smscode_err:'',
      disabled:false,
      setTimer:0,
      to:this.props.location.query.to,
      id:this.props.location.query.id,
      phone:user.phone,
    }
  },
  handleSubmit(e){
    e.preventDefault();
    const {to,id,phone}=this.state;
    this.props.form.validateFields((err,fields)=>{
      if(err)return;
      for(let k in fields){if(fields[k]&&typeof (fields[k])!='number')fields[k]=fields[k].trim()}
      axios.post('openApi/serviceAccount/checkSmsCode',{phone:phone,smsCode:fields.smsCode}).then(()=>{
        if(fields['account_password'] !== fields['new_password'])return Modal.warn({
          content:'两次密码输入不一致'
        });
        this.setState({pending:true});
        let md5 = crypto.createHash("md5");
            md5.update(`${user.account_no}/${fields.account_password}`);
          let account_password=md5.digest("hex").toUpperCase();
        axios.post('openApi/serviceAccount/setPayPwd',{...fields,account_no:user.account_no,account_password}).then(()=>{
          message.success('密码修改成功',5);
          if(to){
            const url=to+"?id="+id;
            this.props.router.push(url)
          }else {
            this.props.router.push('service/account/home')
          }
        },err=>{
          Modal.error({content:err.message});
        }).finally(()=>{
          this.setState({pending:false,smscode_err:''});
        })
      },err=>{
        this.setState({smscode_err:err.message,disabled:false,setTimer:0})
      })
    })
  },
  cancel(){
    this.props.router.goBack();
  },
  getMsCode(){
    let num=60;
    let me=this;
    let timer=setInterval(function () {
      num--;
      me.setState({disabled:true,setTimer:num});
      if(num==0){
        clearInterval(timer);
        me.setState({disabled:false,setTimer:0});
      }
    },1000)
    const {to,id,phone}=this.state;
    axios.post('openApi/serviceAccount/getSmsCode',{phone:phone}).then(()=>{

    },err=>{
      Modal.error({content:err.message});
      clearInterval(timer);
      me.setState({disabled:false,setTimer:0});
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form;
    const {disabled,pending,smscode_err,setTimer}=this.state;
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17}
    };
    let phone =user.phone.slice(0,3)+"*****"+user.phone.slice(8);
    return <Form id="modify-password-page" onSubmit={this.handleSubmit}>
      <div className="form-content">
        <Spin spinning={pending}>
          <FormItem
            {...formItemLayout}
            label="短信验证码"
          >
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('smsCode',{
                  rules: [{required: true, message: '验证码不能为空'}],
                })(
                  <Input placeholder="输入正确的验证码"/>
                )}
              </Col>
              <Col span={12}>
                <Button size="large" onClick={this.getMsCode}
                        disabled={disabled}
                        style={{width:102}}
                >{setTimer?setTimer+"s":"获取验证码"}</Button>
              </Col>
              <p className={smscode_err?"err_color":"def_color"}>{smscode_err?smscode_err:`本操作将向商户的注册手机(${phone})发送一条短信`}</p>
            </Row>
          </FormItem>
          <FormItem label='新支付密码' {...formItemLayout}>
            {getFieldDecorator('new_password', {
              rules: [{required: true, message: '请输入新密码'}],
            })(
              <Input type="password" placeholder="请输入6-10位数字" className="pass_input"/>
            )}
          </FormItem>
          <FormItem label='确认支付密码' {...formItemLayout}>
            {getFieldDecorator('account_password', {
              rules: [{required: true, message: '请再次输入新密码'}],
            })(
              <Input type="password" placeholder="请输入6-10位数字" className="pass_input"/>
            )}
          </FormItem>
          <FormItem className='text-center'>
            <Button type="primary" htmlType='submit' size="large">确定</Button>
            <Button onClick={this.cancel} type="ghost" size="large" className='gutter-left'>取消修改</Button>
          </FormItem>
        </Spin>
      </div>
    </Form>

  }
}))
