import React from 'react';
import { Form, Icon, Input, Button, notification ,Popconfirm,Row,Col,Switch} from 'antd';
import {nextStep,createUser} from './reducer'

const FormItem = Form.Item;




const step1Form=Form.create()(React.createClass({

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    return(
      <div className="checkDiv">
        <Form onSubmit={(e)=>{
          e.preventDefault();
          this.props.form.validateFields((err, fieldsValue) => {
            if(err)return;
            for(let k in fieldsValue){if(fieldsValue[k]&&typeof(fieldsValue[k])!="number"){fieldsValue[k]=fieldsValue[k].trim();}}
            createUser(fieldsValue).then((res)=>{
               nextStep(res.data);
            }).catch((err)=>{
              notification.error({message: err.message})
            })
           });
          }}>
          <FormItem
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('login_account',{
              rules: [{required: true, message: '登录名不能为空'},{type:'email',message: '请输入正确的邮箱地址'}],
              //initialValue: roleValue.username
            })(
              <Input placeholder="输入正确的邮箱地址作为登录名"  type="email"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码"
          >
            {getFieldDecorator('login_pwd',{
              rules: [{required: true, message: '请输入密码'},{whitespace:true,message: '密码不能为空格'}],
              //initialValue: roleValue.real_name
            })(
              <Input type="password" placeholder="输入密码"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('name',{
              rules: [{required: true, message: '请输入真实姓名'}],
              //initialValue: roleValue.real_name
            })(
              <Input placeholder="输入用户真实姓名"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话"
          >
            {getFieldDecorator('contact_phone',{
              rules: [
                {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号'},
                {required: true, message: '请输入联系电话'}
              ],
              //initialValue: roleValue.tel_phone
            })(
              <Input placeholder="输入用户手机号" type='tel' maxLength="11" />
            )}
          </FormItem>
          {/*<FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator('email',{
              rules: [{required: true, message: '请输入用户邮箱'}],
              //initialValue: roleValue.real_name
            })(
              <Input placeholder="输入用户邮箱"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="启用"
          >
            {getFieldDecorator('role_id', {
              //initialValue: role_id
            })(
              <Switch checkedChildren={'开'} unCheckedChildren={'关'}/>
            )}
          </FormItem>*/}
          <FormItem className="footer text-center"><Button htmlType='submit' type='primary'>下一步</Button></FormItem>

        </Form>
      </div>
    )
  }
}))
export default step1Form;
