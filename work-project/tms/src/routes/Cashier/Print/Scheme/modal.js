

import React from "react"
import {Form,Input,Radio,Button,Popconfirm} from 'antd';
import  axios from "axios";
import SingleModal from "../../../../components/Modal/SingleModal";
import {Table} from "../../../../components/Table";

const mLayout={
    labelCol:{span:4},
    wrapperCol:{span:16}
}

const FormItem= Form.Item;
let mForm ;
class MForm extends  React.Component{
    static  defaultProps={
        echo:{}
    }
    componentWillMount(){
        mForm=this.props.form;
    }
    componentWillUnmount(){
        mForm=null;
    }

    componentWillUpdate(){
       
    }
    render(){
       
        let {getFieldDecorator} =this.props.form
        return (
            <Form>
                <FormItem {...mLayout} label={"方案名称"}>
                    {
                        getFieldDecorator("name",{rules:[{required:true,message:"请填写方案名称"}]})(<Input/>)
                    }
                </FormItem>
                <FormItem {...mLayout} label={"适用范围"}>
                    {
                        getFieldDecorator("scope",{initialValue:2})(
                            <Radio.Group>
                                <Radio value={2}>支付通道</Radio>
                                <Radio value={3}>门店</Radio>
                            </Radio.Group>
                        )
                    }
                </FormItem>
                <FormItem {...mLayout} label={"状态"}>
                    {
                        getFieldDecorator("status",{initialValue:1})(
                            <Radio.Group>
                                <Radio value={1}>可用</Radio>
                                <Radio value={2}>关闭</Radio>
                            </Radio.Group>
                        )
                    }
                </FormItem>
            
            
            </Form>
        )
    }
}
const BindSchemeForm = Form.create()(MForm);
export default class SchemeFormModal extends SingleModal{
    handleSubmit(){
        mForm.validateFields((error,value)=>{
            if(error) return;
            value.description="--";
            this.close();
            if(this.state.print_plan_id){
                axios.post("tprintPlan/update",Object.assign({},{print_plan_id:this.state.print_plan_id},value)).then(()=>Table.getTableInstance().reload());
            }else{
                axios.post("tprintPlan/add",value).then(()=>Table.getTableInstance().reload());
            }
            
        })
    }
    handleDelete(){
        this.close();
        axios.post("tprintPlan/update",{is_delete:2,print_plan_id:this.state.print_plan_id}).then(()=>Table.getTableInstance().reload())
    }
    getFooter(){
        return (
            <div>
                {
                 this.state.print_plan_id &&
                 <Popconfirm  onConfirm={()=>this.handleDelete()} title="确认要删除该方案吗">
                 <Button className={"pull-left"} type={"danger"}> 删除</Button>
                 </Popconfirm>
                }
                
                <Button onClick={()=>this.handleSubmit()}  type={"primary"}> 确定</Button>
            </div>
        )
    }
 
    componentDidUpdate(){
        if(this.state.print_plan_id && mForm){
            mForm.setFieldsValue(this.state)
        }else{
            
            mForm&&mForm.resetFields();
        }
       
    }
    
    getContent(){
        return (<div><BindSchemeForm /></div>)
    }
}

