import React from 'react';
import { Form, Icon, Input, Button,notification,Popconfirm,Row,Col,Modal,Switch} from 'antd';
import '../../../styles/adminstyle.scss'
import {addSys,updateSys,deleteSys} from './reducer';
import {Table} from '../../../components/Table';
import {ImageUpload} from "../../../components/ImageUpload";

const Search = Input.Search;
const FormItem=Form.Item;
let sysTable;
export default class Component extends React.Component{
  state={
    visible:false,
    params:{},
    value:''
  }

  showModal(params){
    this.setState({visible:true,params})
  }
  handleCancel(){
    const form =this.form;
    form.resetFields();
    this.setState({
      visible: false,
    });
  }
  handleCreate(){
    const {params,value}=this.state;
    const form =this.form;
    form.validateFields((err,values)=>{
      if (err) {return;}
      for(let k in values){if(values[k]&&typeof(values[k])!="number"){values[k]=values[k].trim();}}
      values.sys_icon="uopIcon/"+values.sys_icon.split('uopIcon/')[1];
      if(params){
        let data={...params,...values};
        delete data.update_time;
        delete data.create_time;
        updateSys(data).then(()=>{
          sysTable.update({sys_no:value})
          this.setState({visible:false})
        }).catch((err)=>{
          notification.error({message: err.message})
        })
      }else {
        addSys(values).then(()=>{
          sysTable.update()
          this.setState({visible:false})
        }).catch((err)=>{
          notification.error({message: err.message})
        })
      }
      form.resetFields();
    })
  }
  onDelete(id){
    deleteSys({sys_id:id}).then(()=>{
      sysTable.update()
    }).catch((err)=>{
      notification.error({message: err.message})
    })
  }
  onSearch(value){
    if(value&&typeof (value)!="number")value=value.trim();
    this.setState({value})
    if(value+""){sysTable.update({sys_no:value})}else {sysTable.update()}
  }
  render(){
    const columns=[
      {title:'系统图标',
        render:(text, record, index)=>{return record.sys_icon&&<img src={decodeURIComponent(record.sys_icon)} alt="" className="tb-sys-icon"/>}
      },
      {title:'系统编码',dataIndex: 'sys_no'},
      {title:'系统名称',dataIndex: 'sys_name'},
      {title:'描述',dataIndex: 'sys_desc'},
      {title:'操作',
        key: 'action',
        render:(text, record, index)=>{
          return (
            <span>
              <a onClick={()=>this.showModal(record)}>编辑</a>
              <span className="ant-divider"/>
              <Popconfirm title={`您是否要删除【${record.sys_name}】?`} onConfirm={()=>this.onDelete(record.sys_id)}><a>删除</a></Popconfirm>
          </span>
          );}
      },
    ];
    return(
      <div style={{paddingTop:15}}>
        <span>系统编码：</span>
        <Search
          placeholder="请输入系统编码"
          style={{ width: 200 }}
          onSearch={this.onSearch.bind(this)}
          defaultValue={this.state.value}
        />
        <hr/>
        <div style={{textAlign:"right",marginBottom:15}}><Button type="primary" onClick={()=>this.showModal()}>添加系统</Button></div>
        <Table
          url="outerSys/getSys"
          columns={columns}
          rowKey={'sys_id'}
          ref={t=>sysTable=t}
          bordered
        />
          <ModalForm
            visible={this.state.visible}
            params={this.state.params}
            ref={t=>this.form=t}
            onCancel={this.handleCancel.bind(this)}
            onCreate={this.handleCreate.bind(this)}
          />
      </div>
    )
  }
}
const ModalForm=Form.create()(React.createClass({

  render(){
    const {visible,params,form,onCreate,onCancel}=this.props;
    const { getFieldDecorator,getFieldValue } = form;
    const title=params?"编辑系统":"添加系统";
    const value=params?params:{};
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    console.log(value.sys_icon)
    let src =getFieldValue('sys_icon')?getFieldValue('sys_icon'):value.sys_icon?decodeURIComponent(value.sys_icon):"/img/sysicon/default.png";
    return (
      <Modal
        visible={visible}
        title={title}
        okText="确认"
        onOk={onCreate}
        onCancel={onCancel}
        className="sys-modal"
      >
        <Form>
          <Row>
            <Col span={18}>
              <FormItem
                {...formItemLayout}
                label="系统编码"
              >
                {getFieldDecorator('sys_no',{
                  rules: [{required: true, message: '系统编码不能为空'}],
                  initialValue: value.sys_no
                })(
                  <Input placeholder="请输入系统编码，必填"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="系统SOA基地址"
              >
                {getFieldDecorator('sys_soa_base_url',{
                  rules: [{required: true, message: '请输入系统SOA基地址'}],
                  initialValue: value.sys_soa_base_url
                })(
                  <Input placeholder="请输入系统SOA基地址，必填"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="系统登陆地址"
              >
                {getFieldDecorator('sys_login_url',{
                  rules: [{required: true, message: '请输入系统登陆地址'}],
                  initialValue: value.sys_login_url
                })(
                  <Input placeholder="请输入系统登陆地址，必填"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="系统名称"
              >
                {getFieldDecorator('sys_name',{
                  rules: [{required: true, message: '请输入系统名称'}],
                  initialValue: value.sys_name
                })(
                  <Input placeholder="请输入系统名称，必填"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="系统描述"
              >
                {getFieldDecorator('sys_desc',{
                  rules: [{required: true, message: '请输入系统描述'}],
                  initialValue: value.sys_desc
                })(
                  <Input type="textarea" rows={4} placeholder="请输入系统描述，必填"  />
                )}
              </FormItem>
            </Col>
            <Col span={6} className="sys-icon">
              <div>
                <div className="margin-bottom">
                  <img width={120} height={120} src={decodeURIComponent(src)} />
                </div>

                <FormItem >
                  {
                    getFieldDecorator("sys_icon",{
                      rules:[{required:true,message:"请上传系统图标"}],
                      initialValue: value.sys_icon?decodeURIComponent(value.sys_icon):""
                    })(<ImageUpload/>)
                  }
                </FormItem>

              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}));
