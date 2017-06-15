'use strict'
import React from 'react';
import './style.scss';
import {message,Modal,Spin,Button,Icon,Form,Input,Alert} from 'antd';
import QueueAnim from 'rc-queue-anim';
const FormItem = Form.Item;
import axios from 'axios';
import Operator from '../../../model/Operator';

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
            this.setState({pending:true});
            axios.post('user/updatePassword',Object.assign({userId:Operator.get('userId')},fields)).then(()=>{
                message.success('密码修改成功，请重新登录',5);
                setTimeout(()=>{
                    Operator.logout();
                    this.props.router.push({pathname:'/login'});
                },0)
            },err=>{
                Modal.error({content:err.message});
            }).finally(()=>{
                this.setState({pending:false});
            })
        })
    },
    cancel(){
        this.props.router.replace({pathname:'/systems'});
    },
    render() {
        const {getFieldDecorator} = this.props.form;
        return <Form id="modify-password-page" onSubmit={this.handleSubmit} className="concise-form">
            <QueueAnim type={['top', 'bottom']} ease={['easeOutQuart', 'easeInOutQuart']} duration={800}>
                <div key="ani-a">
                    <h1 className="page-title">修改密码</h1>
                    <div className="form-content">
                        <Spin spinning={this.state.pending}>
                            <FormItem>
                                {getFieldDecorator('old_password', {
                                    rules: [{required: true, message: '请输入原密码'}],
                                })(
                                    <Input prefix={<Icon type="lock" className="input-icon"/>} type='password' placeholder="原密码"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('new_password', {
                                    rules: [{required: true, message: '请输入新密码'}],
                                })(
                                    <Input prefix={<Icon type="lock" className="input-icon"/>} type="password" placeholder="新密码"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('re_password', {
                                    rules: [{required: true, message: '请再次输入新密码'}],
                                })(
                                    <Input prefix={<Icon type="lock" className="input-icon"/>} type="password" placeholder="确认新密码"/>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" className='gutter-left' htmlType='submit' size="large">确定</Button>
                                <Button onClick={this.cancel} type="ghost" size="large" className='gutter-left-lg'>取消</Button>
                            </FormItem>
                        </Spin>
                    </div>
                </div>
            </QueueAnim>
        </Form>

    }
}))