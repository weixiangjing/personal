/**
 *  created by yaojun on 16/12/14
 *
 */
  


   
import React from "react";
import {Form,Select,Modal,Input,Row,Col} from "antd";
import {SDK_CONF} from "../../../../config/pay_plugin_config";
import InputControl from "../../../../components/InputControl";
import {toggleVisible,submit} from "./reducer"
import "./layout.scss";



const Option = Select.Option;

export default Form.create()(React.createClass({
    render(){
        let {getFieldDecorator,getFieldValue} = this.props.form;
        let {visible,confirmLoading,modal,id} =this.props;
       
        let isTerminalPlugin = getFieldValue("plugin_type")==1;

      return (
      <Modal onOk={()=>{submit(this.props.form,id);}}
             onCancel={()=>toggleVisible(false)}
             confirmLoading={confirmLoading}
             visible={visible}
             width={700}
             title={modal.get("_title")||"添加插件"}>
          <Form>
              <div className="form-hide">
                  {
                      getFieldDecorator("pay_plugin_id")(
                          <Input/>
                      )
                  }
              </div>
              
              <Row gutter={24}>
                  <Col span={12}>
                      <Form.Item label="收银SDK版本" className="ant-row ant-form-item m-group">
        
                       
                          {
                              getFieldDecorator("trade_sdk_version",{
                                  rules:[{required:true,message:"收银SDK版本"}]})(
                                  <Select style={{width:150}}  placeholder={"请选择收银版本"} >
                                      {
                                          SDK_CONF.map(item=>{
                                              return (<Option key={item.key} value={String(item.key)}>{item.value}</Option>);
                                          })
                                      }
                                  </Select>
                              )
                          }
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <InputControl style={{width:150}}   placeholder="请输入业务接入号" rules={[{required:true,message:"请输入业务接入号"}]} className="m-group"  {...this.props.form} label="业务接入号:" name="biz_no" />
                  </Col>
              </Row>
              <Row gutter={24}>
                  <Col span={12}>
                    
        
                          <Form.Item className="ant-row ant-form-item m-group" label="插件类型">
                              {
                                  getFieldDecorator("plugin_type",{
                                      initialValue:1,
                                      rules:[{required:true,message:"插件类型必选"}]})(
                                      <Select style={{width:150}} >
                                          <Select.Option value={1}>终端插件</Select.Option>
                                          <Select.Option value={2}>云端插件</Select.Option>
                                      </Select>
                                  )
                              }
                          </Form.Item>
                         
                      
                  </Col>
                  <Col span={12}>
                      {
                        isTerminalPlugin &&  <InputControl style={{width:150}} extra="需要共用密钥区请填写相同的索引号"  placeholder="插件的主密钥索引标识"  className="m-group"  {...this.props.form} label="主密钥索引号" name="master_key" />
                      }
                  </Col>
              </Row>
              {
                  isTerminalPlugin ?<div>
                      <InputControl extra="终端插件，必须填写Android程序的包名" style={{width:500}}    placeholder="程序的包名，如：com.wangpos.plugin.jf03" rules={[{required:true,message:"请输入Android程序的包名"}]} className="m-group"  {...this.props.form} label="插件包名:" name="package_name" />
                      <InputControl extra="终端插件，必须填写Android程序的ClassPath" style={{width:500}} placeholder="程序的ClassPath，如：com.wangpos.plugin.jf03.service.PluginService" rules={[{required:true,message:"请输入Android程序的ClassPath"}]} className="m-group"  {...this.props.form} label="插件ClassPath:" name="run_main_class" />
                  </div>: <InputControl extra="云端插件，必须填写服务地址" style={{width:500}} placeholder="以 http:// 或 https://  开头" rules={[{required:true,message:"请输入正确的服务地址"},{pattern:/^(http|https)/,message:"必须以http 或者 https开头"}]} className="m-group"  {...this.props.form} label="云服务地址:" name="plugin_url" />
              }
              
              <InputControl style={{width:500}} placeholder="插件描述" rules={[{required:true,message:"请输入插件描述"}]} className="m-group"  {...this.props.form} label="插件描述:" name="description" />
              <InputControl style={{width:500}}
                            type="textarea"
                            rules={[{
                                validator:(rule,value,cb)=>{
                                    if(!value) return cb()
                                    try{
                                        JSON.parse(value);
                                        cb();
                                    }catch (e){
                                        cb("JSON格式错误");
                                    }
                                },message:"JSON格式错误"
                            }]}
                            rows={5}
                            placeholder='请输入本插件适用的JSON格式的配置参数 如：{"key":"value"}'
                            className="m-group"
                            {...this.props.form}
                            label="全局参数配置:"
                            name="global_settings" />
          </Form>
      </Modal>
         )
    }
}))