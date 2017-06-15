/**
 *  created by yaojun on 2017/5/17
 *
 */
import React from "react";
import {Form, Row, Col,Alert} from "antd";
import {handler, getDetail, displayTemplate} from "./reducer";
import classNames from "classnames";
import PaymentSelect from "../../../../components/Select/payment";
import TradeTypeSelect from "../../../../components/Select/trade_type";
import PrintTypeSelect from "../../../../components/Select/print_type";
import "./index.scss";
import {SearchItemWithInput, SearchGroupBorder} from "../../../../components/SearchGroupBorder";
const qrcodeImg=require("./assets/qrcode.png");
const barcodeImg=require("./assets/barcode.png");
const normalImg=require("./assets/image.png");
const gravityClass=['text-left', 'text-center', 'text-right'];
const sizeStyle=[12, 14, 18]
const styleClass=['font-normal', "font-bold", "font-italic"]
const FormItem=Form.Item;
let mForm;
class SearchGroupForm extends React.Component {
    
    render() {
        let form=this.props.form;
        mForm=form;
        let {getFieldDecorator}=form;
        
        return (<Form >
            <SearchGroupBorder>
                
                <SearchItemWithInput onChange={()=>getDetail(mForm.getFieldsValue())} title="MCODE" name="apply_id"
                                     placeholder="输入关键字查询"
                                     getFieldDecorator={form.getFieldDecorator}/>
            </SearchGroupBorder>
            <div className="inline-form-item">
            <FormItem>
                {
                    getFieldDecorator("pay_mode_id")(<PaymentSelect defaultAll={true}/>)
                }
            </FormItem>
            <FormItem>
                {
                    getFieldDecorator("trade_type")(<TradeTypeSelect/>)
                }
            </FormItem>
            <FormItem>
                {
                    getFieldDecorator("print_format_type")(<PrintTypeSelect/>)
                }
            </FormItem>
            </div>
        
        </Form>)
    }
}
const BindSearchForm=Form.create(
    {
        onFieldsChange(props, fields){
            if(fields.apply_id) {
                return;
            }
            let value=mForm.getFieldsValue()
            if(value.apply_id) {
                getDetail(value);
            }
            
        }
    })(SearchGroupForm);
export default class Component extends React.Component {
    
    render() {
        let template=handler.$state("template");
        let list=handler.$state("list");
        let activeIndex=handler.$state("activeIndex");
        
        return (<div className="print-manager-preview">
            
            <BindSearchForm/>
            <Row className="margin-top-lg" gutter={24}>
                <Col lg={12} md={6}>
                    
                    <ul className="print-template-items">
                        {
                            list.map((item, index)=>(
                                <li onClick={()=>displayTemplate(item.get("content"), index)} className={classNames([{
                                    "custom": item.get("pre_set")==2,
                                    selected: index===activeIndex
                                }])} key={item.get("templateId")}>
                                    <div>{item.get("type_name")}</div>
                                    <div>{item.get("type_code")}</div>
                                </li>))
                        }
                    
                    
                    </ul>
                </Col>
                <Col lg={12} md={18}>
                    {
                        template.size>0&&(
                            <div className="preview-container">
                                
                                <div className="preview-wrapper">
                                    {
                                        template.map(item=><PrintItem key={item.get("id")} item={item}/>)
                                    }
                                   
                                
                                </div>
                            </div>)
                    }
                
                </Col>
            
            
            </Row>
        </div>)
    }
}

const PrintItem=(({item})=> {
    let props=item ? item.get("props").toJS() : {}
    let isSpaceAround=props.toside==1||props.toside===true||props.toside==="true";
    let label=props.label;
    
    // to side
    if(isSpaceAround) {
        label=label.split("{separator}").map((item, index)=><span
            className={"pull-"+(index==0 ? "left" : "right")}>{item}</span>)
    }
    let leftLength=props.leftlength;
    
    if(leftLength!== void 0&&typeof label==="string") {
        leftLength= +leftLength;
        let cols=label.split("{separator}");
        label=cols.map((item, index)=><span style={{
            lineHeight: `${sizeStyle[props.size]}px`,
            height: sizeStyle[props.size],
            display: "inline-block",
            overflow: "hidden",
            width: (index===0) ? leftLength*8 : 'auto'
        }}>{item.slice(0, leftLength)}</span>)
        
    }
    
    label=getContentByType(props.type, label);
    
    if(typeof label ==="string"){
       label= getNextLineContent(label);
       
    }
    
    return (
        <div style={{fontSize: sizeStyle[props.size]}}
             className={
                 classNames(["channel-print-drop-item over-hide",
                     gravityClass[props.gravity],
                     styleClass[props.style]])}>{label}
        </div>
    )
});

function getContentByType(type, label) {
    switch(+type) {
        case 0:
            return label;
        case 1:
            return <img className="qr-code" src={qrcodeImg}/>;
        case 2:
            return <img className="bar-code" src={barcodeImg}/>;
        case 3:
            return <img className="bar-code" src={normalImg}/>;
        case 4:
            return <div style={{fontSize: 12}}>----------------------------------------------------</div>
        default:
            return label
    }
}


function getNextLineContent(label){
    let list= label.split("{nextline}");
    let array=[]
    for(let i=0,j=list.length;i<j;i++){
        let item =list[i];
        if(item){
            array.push(item);
        }
        if(i!==j-1){
            array.push(<div style={{height:14}}></div>)
        }
    }
    return array;
    
}