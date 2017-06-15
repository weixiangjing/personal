'use strict'
import React from 'react'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item

export default Form.create()(React.createClass({
    render(){
        const {getFieldDecorator} = this.props.form;
        const {loading} = this.props;
        return <Form onSubmit={this.props.onSubmit}>
            <FormItem label='登录名'>
                {getFieldDecorator('login_account', {
                    rules: [{required: true, message: '请输入登录名'},{whitespace:true,message: '登录名不能为空格'}],
                })(
                    <Input/>
                )}
            </FormItem>
            <FormItem label='登录密码'>
                {getFieldDecorator('login_pwd', {
                    rules: [{required: true, message: '请输入登录密码'},{whitespace:true,message: '密码不能为空格'}],
                })(
                    <Input type="password"/>
                )}
            </FormItem>
            <FormItem>
                <Button type="primary" htmlType='submit' size="large" className='login-button' loading={loading}>登录</Button>
            </FormItem>
        </Form>
    }
}))
