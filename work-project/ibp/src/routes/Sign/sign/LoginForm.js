'use strict';
import React from 'react'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item;

export default Form.create()(React.createClass({
    render(){
        const {getFieldDecorator} = this.props.form;
        const {busy,onSubmit} = this.props;
        return <Form onSubmit={onSubmit}>
            <FormItem label='登录名'>
                {getFieldDecorator('username', {
                    rules: [{required: true, message: '请输入登录名'}],
                })(
                    <Input/>
                )}
            </FormItem>
            <FormItem label='登录密码'>
                {getFieldDecorator('password', {
                    rules: [{required: true, message: '请输入登录密码'}],
                })(
                    <Input type="password"/>
                )}
            </FormItem>
            <FormItem>
                <Button type="primary" htmlType='submit' size="large" className='login-button' loading={busy}>登录</Button>
            </FormItem>
        </Form>
    }
}))
