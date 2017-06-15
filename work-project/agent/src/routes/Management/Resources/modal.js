import React from 'react';
import axios from 'axios';
import {Modal, Form, Input, Select,Radio} from 'antd';
import {EDIT,NEWUSER,RESETPAW} from './component'

const FormItem = Form.Item;
const Option = Select.Option;


const RegistrationForm = Form.create()(React.createClass({
  getInitialState() {
    return {
      select:[]
    };
  },
  render(props){
    const { visible,onCancel, onCreate,  form ,confirmLoading,text} = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const value=text?text:new Object;
    return (
      <Modal
        visible={visible}
        title="编辑用户信息"
        okText="确认"
        onOk={onCreate}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        className="modal-no-cancel">
        <Form>
          <FormItem
            {...formItemLayout}
            label="资源名"
          >
            {getFieldDecorator('res_name',{
              rules: [{required: true, message: '资源名不能为空'}],
              initialValue:value.res_name
            })(
              <Input />
            )}
          </FormItem>
            <FormItem
              {...formItemLayout}
              label="资源类型"
            >
              {getFieldDecorator('res_type',{
                rules: [{required: true, message: '请选择资源类型'}],
                initialValue:value.res_type
              })(
                <Radio.Group>
                <Radio value={'Menu'} >菜单（Menu）</Radio>
                <Radio value={'Action'} >操作（Action）</Radio>
                </Radio.Group>

                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资源地址"
            >
              {getFieldDecorator('res_url',{
                rules: [{required: true, message: '请输入真实姓名'}],
                initialValue:value.res_url
              })(
                <Input type="text" />
              )}
            </FormItem>
          <FormItem
            {...formItemLayout}
            label="可用状态："
          >
            {getFieldDecorator('status',{
              rules: [{required: true}],
              initialValue:value.status
            })(
              <Radio.Group>
                <Radio value={1} >启用</Radio>
                <Radio value={2} >关闭</Radio>
              </Radio.Group>
            )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}))
export default RegistrationForm;
