/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Form, Radio, Input, Button, Row, Col,Icon,Steps,Alert} from "antd";
import {Table} from "../../../../components/Table";
import {cleanEmpty} from "../../../../util/helper";
import reducer from "./reducer";
import Captcha from "../../../../components/Captcha/index";
import AddressSelect from "../../../../components/Select/address";

const FormItem   =Form.Item;
import "./index.scss";
import AMapPicker from "../../../../components/AMapPicker/index";
import ClassifySelect from "../../../../components/Select/classify";
import ImageUploadPreview from "../../../../components/ImageUploadPreview/index";
 class Component extends React.Component {
    
    
    handleSubmit(e){
        e.preventDefault();
        Table.getTableInstance().reload(cleanEmpty(this.props.form.getFieldsValue()))
    }
    render(){
        let {getFieldDecorator,getFieldValue,setFieldsValue} =this.props.form;
        let layout ={
            labelCol:{span:4},
            wrapperCol:{span:8}
        }
        
        let currentStep = reducer.getValue("step");
        return (
            <Form className="merchant-edit" onSubmit={(e)=>this.handleSubmit(e)}>
                <Steps  current={currentStep}>
                    <Steps.Step title="基本信息"/>
                    <Steps.Step title="资质附件"/>
                    <Steps.Step title="标记地址"/>
                </Steps>
                <div style={{margin:24,height:1,background:"#ececec"}}/>
                
                    {/*step 1*/}
                    <div style={{display:currentStep===0?"block":"none"}}>
                        <FormItem {...layout}  label={"门店名称"}>
                            {
                                getFieldDecorator("name")(<Input/>)
                            }
                        </FormItem>
                        <FormItem {...layout}  label={"门店类型"}>
                            {
                                getFieldDecorator("mcode")(<ClassifySelect/>)
                            }
                        </FormItem>
                        <FormItem {...layout} label={"商户手机号"}>
                            {
                                getFieldDecorator("merMobile")(<Input  addonAfter={<Captcha action={Captcha.ACTION.OPEN_MERCHANT} phone={getFieldValue("merMobile")}/>} placeholder="请输入商户手机号"/>)
                            }
                        </FormItem>
                  
                        <FormItem {...layout} label={"验证码"}>
                            {
                                getFieldDecorator("belong")(<Input placeholder="请输入归属服务商"/>)
                            }
                        </FormItem>
                    </div>
                    <div style={{display:currentStep===1?"block":"none"}}>
                        <Alert className="margin-bottom-lg" showIcon type="warning" description="文件大小不超过500K，支持jpg、png、gif格式"/>
                        <FormItem {...layout} label={"门牌代码"}>
                            {
                                getFieldDecorator("image",{rules:[{required:true,message:"请上传门牌照片"}]})(<ImageUploadPreview/>)
                            }
                        </FormItem>
                       
                        <FormItem {...layout} label={"内景照片"}>
                            {
                                getFieldDecorator("image2")(<ImageUploadPreview/>)
                            }
                        </FormItem>
                       
                        <FormItem {...layout} label={"收银台照片"}>
                            {
                                getFieldDecorator("image3")(<ImageUploadPreview/>)
                            }
                        </FormItem>
                       
                        <FormItem {...layout} label={"门面照片"}>
                            {
                                getFieldDecorator("image4")(<ImageUploadPreview/>)
                            }
                        </FormItem>
                       

                    </div>
                    <div style={{display:currentStep===2?"block":"none"}}>
                        <FormItem {...layout} label={"门店地址"}>
                            {
                                getFieldDecorator("image4")(<AddressSelect/>)
                            }
                        </FormItem>
                        <FormItem  wrapperCol={{offset:4,span:8}}>
                            {
                                getFieldDecorator("address")(<Input extra="dfd"/>)
                            }
                        </FormItem>
                        <FormItem className="form-hide"  wrapperCol={{offset:4,span:8}}>
                            {
                                getFieldDecorator("location")(<Input extra="dfd"/>)
                            }
                        </FormItem>
    
    
                        <Row >
                            <Col offset={4}>
                                <AMapPicker onChange={(address,result)=>setFieldsValue({address,location:result.position.toString()})}/>
                            </Col>
                        </Row>
                    </div>
    
                    <FormItem wrapperCol={{offset:4}}>
                            {
                                currentStep >0 && <Button className="margin-right"  onClick={()=>reducer.changeStep(currentStep-1)} >上一步</Button>
                            }
                            {
                                currentStep<2 && <Button  onClick={()=>reducer.changeStep(currentStep+1)} type={"primary"}>下一步</Button>
                            }
                           

                    </FormItem>
                
            </Form>
        
        )
    }
}
const SearchForm=Form.create()(Component);
export default SearchForm;