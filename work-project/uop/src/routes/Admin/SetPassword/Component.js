'use strict'
import React from 'react';
import './style.scss';
import {message,Modal,Spin,Button,Icon,Form,Input} from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import Admin from '../../../model/Admin';

export default Form.create()(React.createClass({
    getInitialState(){
        return {
            pending:false
        }
    },
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err,fields)=>{
            if(err)return;
            if(fields['re_password'] !== fields['new_password'])return Modal.warn({
                content:'两次密码输入不一致'
            });
          for(let k in fields){if(fields[k]&&typeof(fields[k])!="number"){fields[k]=fields[k].trim();}}
            this.setState({pending:true});
            axios.post('user/updatePassword',Object.assign({userId:Admin.get('userId')},fields)).then(()=>{
                message.success('密码修改成功，请重新登录',5);
                setTimeout(()=>{
                  Admin.logout();
                    this.props.router.push({pathname:'console/login'});
                },0)
            },err=>{
                Modal.error({content:err.message});
            }).finally(()=>{
                this.setState({pending:false});
            })
        })
    },
    cancel(){
        this.props.router.goBack();
    },
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        return <Form id="set-password-page" onSubmit={this.handleSubmit}>
            <div className="page-title">
                <Icon className="title-icon" type="user"/>
                <h3 className="title-name">修改密码</h3>
            </div>
            <div className="form-content">
                <Spin spinning={this.state.pending}>
                    <FormItem label='原密码' {...formItemLayout}>
                        {getFieldDecorator('old_password', {
                            rules: [{required: true, message: '请输入原密码'},{whitespace:true,message: '密码不能为空格'}],
                        })(
                            <Input type='password'/>
                        )}
                    </FormItem>
                    <FormItem label='新密码' {...formItemLayout}>
                        {getFieldDecorator('new_password', {
                            rules: [{required: true, message: '请输入新密码'},{whitespace:true,message: '密码不能为空格'}],
                        })(
                            <Input type="password"/>
                        )}
                    </FormItem>
                    <FormItem label='确认新密码' {...formItemLayout}>
                        {getFieldDecorator('re_password', {
                            rules: [{required: true, message: '请再次输入新密码'},{whitespace:true,message: '密码不能为空格'}],
                        })(
                            <Input type="password"/>
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
