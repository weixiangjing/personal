/**
 *  created by yaojun on 16/12/15
 *
 */
import React from 'react';
import {Form,Input,Button,Row,Col} from "antd";
import {saveTemplate,saveForm} from "./reducer";
const FormItem= Form.Item;
export default Form.create()(React.createClass({
    componentWillMount(){
        saveForm('print',this.props.form);
    },
    render(){
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 23 },
        };
        let {getFieldDecorator,validateFields,setFieldsValue,getFieldValue} =this.props.form;
        let store =this.props.state;
        let template=store.get("info").get("pos_ticket_template");
        return (<Form className="channel-temp" >
            <FormItem >
                
                <Row gutter={24}>
                    <Col span={2}><label>打印模板</label></Col>
                    <Col span={18}>
                        {
                            getFieldDecorator('pos_ticket_template',{
                                initialValue:template
                            })(<Input style={{height:500,maxWidth:800}} type="textarea" placeholder="请输入参数模板脚本"/>)
                        }
                    </Col>
                    <Col span={4}>
                        <Button type={"primary"} onClick={()=>{
                            let temp =getFieldValue("pos_ticket_template");
                            if(!temp) return ;
                                temp= temp.trim();
                            if(temp[0]!=="[") return ;
                                temp = eval(temp);
                            setFieldsValue({
                                pos_ticket_template:JSON.stringify(temp,null,2)
                            })
                        }}>美化打印模板</Button>
                    </Col>
                </Row>
               
            </FormItem>
            
          
            
           
        </Form>)
    }
}))