/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Form, Radio, Input, Button, Row, Col,Modal} from "antd";
import {Table} from "../../../components/Table";
import "./index.scss";
import {cleanEmpty} from "../../../util/helper";
import user from "../../../model/User";
import reducer from "./reducer";
const FormItem   =Form.Item;
const layout ={
    labelCol:{span:6},
    wrapperCol:{span:18}
}
const sLayout={
    labelCol:{span:4},
    wrapperCol:{span:16}
}
var mForm ;
class ModalForm extends React.Component{
    render(){
        let {getFieldDecorator}=this.props.form;
        let visible = reducer.getValue("visible");
        mForm=this.props.form;
        return (
            <Modal
                onOk={()=>reducer.submit(this.props.form)}
                onCancel={()=>reducer.update("visible",false)}
                visible={visible} title={"编辑"}>
                
                <Form onSubmit={()=>{}}>
                    <FormItem  className="form-hide" label={"姓名"}>
                        {
                            getFieldDecorator("_id")(<Input/>)
                        }
                    </FormItem>
    
                    <FormItem {...sLayout}  label={"姓名"}>
                        {
                            getFieldDecorator("name")(<Input/>)
                        }
                    </FormItem>
                    <FormItem {...sLayout} label={"电话"}>
                        {
                            getFieldDecorator("phone")(<Input/>)
                        }
                    </FormItem>
                    <FormItem {...sLayout} label={"工作"}>
                        {
                            getFieldDecorator("job")(<Input/>)
                        }
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
const BindModalForm =Form.create()(ModalForm);
export default class Component extends React.Component {
    render() {
        return (<div>
            <SearchForm/>
            
            <BindModalForm/>
            <Table extra={<span><Button onClick={()=>{
                reducer.update("visible",true);
                mForm.resetFields()
            }}  type={"primary"}>新增员工</Button></span>}
                   url="sales" rowKey="_id" columns={[{
                title: "工号", dataIndex: "jobNum"
            }, {
                title: "姓名", dataIndex: "name"
            }, {
                title: "手机号", dataIndex: "phone"
            }, {
                title: "职位", dataIndex: "job"
            }, {
                title: "操作", render: (a,col)=>(
                    <span>
                        
                        <a onClick={()=>{
                            reducer.update("visible",true);
                            setTimeout(()=>mForm.setFieldsValue(col))
                        }}>编辑</a>
                        <a onClick={()=>user.toggleStatus(col.account._id,col.account.status)} className="margin-left">
                            {col.account.status==1?'冻结':"解冻"}
                        </a>
                        
                    </span>)
            }]}/>
        </div>)
    }
}
const SearchForm=Form.create()(React.createClass({
    render(){
        let {getFieldDecorator} =this.props.form;
        
        return (
            <Form layout={"inline"} onSubmit={(e)=>{e.preventDefault();Table.getTableInstance().reload(cleanEmpty(this.props.form.getFieldsValue()))}}>
                <Row className={"service-merchant"}>
                        <FormItem   label={"姓名"}>
                            {
                                getFieldDecorator("name")(<Input />)
                            }
                        </FormItem>
                   
                        <FormItem label={"手机号"}>
                            {
                                getFieldDecorator("phone")(<Input/>)
                            }
                        </FormItem>
                        <FormItem  label={"职位"}>
                            {
                                getFieldDecorator("job")(<Input />)
                            }
                        </FormItem>
                        <FormItem className={'search-bar'}>
                            <Button htmlType={"submit"} type={"primary"}>搜索</Button>
                            <Button onClick={()=>this.props.form.resetFields()} className={"margin-left"}>清除</Button>
                        </FormItem>
                    
                </Row>
            </Form>

        )
    }
}))

