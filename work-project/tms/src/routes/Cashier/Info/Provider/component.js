/**
 *  created by yaojun on 16/12/20
 *
 */
import React from 'react';
import {Button, Form, Input, Radio, Modal,Popconfirm} from "antd";
import {editorProvider,showModal,disableProvider,deleteProvider} from './reducer';
import {CASHIER_PROVIDER_ADD,
CASHIER_PROVIDER_TOGGLE,
CASHIER_PROVIDER_UPDATE,CASHIER_PROVIDER_DELETE} from "../../../../config/auth_func";
import {Auth} from "../../../../components/ActionWithAuth";
import {SearchItemWithRadio,SearchItemWithInput,SearchGroupBorder} from "../../../../components/SearchGroupBorder";

import {Table} from "../../../../components/Table";
let mSearchForm; ;
class  SearchForm extends React.Component{
    render(){
        mSearchForm=this.props.form;
        return (
            <Form>
    
                <SearchGroupBorder>
                    <SearchItemWithRadio initialValue="" title="状态" name="status" form={this.props.form} items={[{label: "（全部）", value: ""}].concat([{
                        label: "可用", value: "1"
                    },{
                        label: "已停用", value: "2"
                    }])}/>
                    <SearchItemWithInput onChange={(e)=>Table.getTableInstance().reload(mSearchForm.getFieldsValue())} placeholder="输入提供方名称，按回车搜索" title="通道提供方" name="pay_sp_name_like" getFieldDecorator={this.props.form.getFieldDecorator}/>
                </SearchGroupBorder>
            </Form>
        )
    }
    componentDidUnMount(){
        mSearchForm=null;
    }
}

const BindSearchForm = Form.create({
    onFieldsChange(prop,field){
       
            let value =mSearchForm.getFieldsValue();
            if(value.pay_sp_name_like){
                value.pay_sp_name_like=value.pay_sp_name_like.trim();
            }
           Table.getTableInstance().reload(value);
       
    }
})(SearchForm);
export default class Provider extends React.Component{
   

  
    saveForm(form){
        this.form=form;
    }

    render(){
        let columns = [{
            title: "ID",
            dataIndex:"pay_sp_id"
        }, {
            title: "名称",
            dataIndex:"pay_sp_name"
        }, {
            title: "描述",
            dataIndex:"description"
        }, {
            title: "状态",
            className:"corner-mark",
            render:(v,col)=>(col.status==1?<span className="text-success"><font className="font-lg">.</font>可用</span>:<span className="text-danger"><font className="font-lg">.</font>无效</span>)
        }, {
            title: "最近更新时间",
            dataIndex:"update_time"
        },{
            title:"操作",
            render:(a,col)=>{
                return (<span>
                    <Auth to={CASHIER_PROVIDER_TOGGLE}>
                    <Popconfirm onConfirm={()=>{
                        disableProvider(col)
                    }} title={`确认要${col.status==1?"停用":"启用"}该提供方吗`}>
                         <a className="margin-right">{col.status==1?"停用":"启用"}</a>
                    </Popconfirm>
                    </Auth>
                    <Auth to={CASHIER_PROVIDER_UPDATE}>
                    <a onClick={()=>showModal(true,col,this.form)} className="margin-right">编辑</a>
                    </Auth>
                    {/*<a onClick={()=>disableProvider(col)}>删除</a>*/}
                    
                </span>)
            }
        }]
        
        
   
        let store =this.storeState;
        let total =store.get("total");
        let loading =store.get("loading")
        let confirmLoading =store.get("confirmLoading");
        let items =store.get("items").toJS();
        let visible =store.get("visible");
        let pageSize =store.get("pageSize");
    
    
    
    
        return (
            <div  >
             
                <BindSearchForm/>
             
                
                <Table extra={  <Auth to={CASHIER_PROVIDER_ADD}>
                    <Button onClick={()=>showModal(true,null,this.form)} className={"margin-left pull-right"}>新建提供方</Button>
                </Auth>} url="tmsPaymode/getSp" rowKey={"pay_sp_id"}  columns={columns}>
                </Table>
                <CreateProviderForm ref={this.saveForm.bind(this)}  visible={visible}  />
            
            
            </div>
        );
    }
}
const FormItem           = Form.Item;
const RadioGroup         = Radio.Group;
const CreateProviderForm = Form.create()(React.createClass({
 
    render(){
        let {getFieldDecorator,getFieldValue} = this.props.form;
        let {visible} =this.props;
        const formItemLayout = {
            labelCol  : {span: 5},
            wrapperCol: {span: 14},
        };
       let id =getFieldValue("pay_sp_id");
        return (
            <Modal
                footer={<div>
                   
                    <Auth replace to={CASHIER_PROVIDER_DELETE}>
                    {
                     id && <Popconfirm title="确认删除该提供方吗？" onConfirm={()=>deleteProvider(id)}>
                            <Button type="danger" className="pull-left">删除提供方</Button>
                        </Popconfirm>
                    }
                    </Auth>
                   
                    <Button onClick={()=>editorProvider(this.props.form)} type={"primary"}>确认</Button>
                    <Button onClick={()=>showModal(false,false,this.props.form)}>取消</Button>

                </div>}
                title="操作"
                onCancel={()=>showModal(false,false,this.props.form)}
                visible={visible} >
                <Form>
                    
                    <div className={"form-hide"}>
                        <FormItem  {...formItemLayout} label={"提供方ID"}>
                            {
                                getFieldDecorator('pay_sp_id', {
                                })(<Input />)
                            }
                        </FormItem>
                    </div>
                    
                    <FormItem {...formItemLayout} label={"提供方名称"}>
                        {
                            getFieldDecorator('pay_sp_name', {
                                rules: [
                                    {
                                        required: true, message: "请填提供方名称"
                                    }
                                ]
                            })(<Input/>)
                        }
                    </FormItem> <FormItem {...formItemLayout} label={"描述"}>
                    {
                        getFieldDecorator('description', {
                            rules: [
                                {
                                    required: true, message: "请填写描述"
                                }
                            ]
                        })(<Input/>)
                    }
                </FormItem> <FormItem {...formItemLayout} label={"可用状态"}>
                    {
                        getFieldDecorator('status', {
                            initialValue: 1
                        })(<RadioGroup>
                            <Radio value={1}>可用</Radio>
                            <Radio value={2}>关闭</Radio>
                        </RadioGroup>)
                    }
                </FormItem>
                </Form>
            
            </Modal>)
    }
}));


