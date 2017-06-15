/**
 *  created by yaojun on 16/12/23
 *
 */

import React from "react";
import {Input,Button,Radio} from "antd";
import {ImageUpload} from "../ImageUpload"

//size:1,//0,1,2,3
//    gravity:0,//0：左，1：居中，2：右
//    style:0,//0:普通,1:加粗，2：斜体
//    leftLength:16,// 左边长度,SMALL：24、MEDIUM：16、EXTRALARGE：8、LARGE：12
//    toSide:1,//将文本打印的到左右两边
//    type:3,//0 ：文本，1：二维码，2：条形码,3:图片，4：分隔线
//    label:"营业员"//{separator} 分隔，{newline}换行


class Control extends React.Component{
    static lang={
        size:"字号",
        style:"字体",
        toside:"多列",
        type:"类型",
        label:"文本",
        gravity:"格式",
        leftlength:"字数",
        upload:"文件"
    }

    render(){
        let opts=this.props.enum;
        let value=this.props.value;
        let onChange=this.props.onChange;
        return (<Radio.Group onChange={(e)=>onChange(e.target.value)} value={String(value)}>
            {
                opts.map(item=> <Radio.Button key={item.value} value={String(item.value)}>{item.label}</Radio.Button>)
            }
           
        </Radio.Group>)
    }
}




export default class InspectorForm extends React.Component{
    
    
  
    handleImage(base64){
     if(base64) this.props.onChange("label",base64);
        
    }
    
    render(){
        
        let control =this.props.printInspector;
        if(control.size==0) return null;
        let props =control.get("props");
        if(!props) return null;
        let _props=props.toJS()
        return ( <div>
            {
                Object.keys(_props).map((item,index)=>{
                  
                    return <div className="print-inspector-item" key={control.get("id")+index}>
                        <label>{Control.lang[item]}:</label>
                       <DynamicControl item={item} value={_props[item]} onChange={(v,b)=>{
                           if(b==="image-upload"){this.handleImage(v);return;}
                           this.props.onChange(item,v)
                       }}/>
                    </div>
                })
            }
            <Button style={{marginLeft:50,marginTop:24}} onClick={()=>this.props.onDeleteControl()} type="danger">删除</Button>
        </div>)
    }
}


class DynamicControl extends React.Component{
    render(){
        let {item,onChange,value} =this.props;
        switch (item){
            case "type" :return     <Control value={value} onChange={onChange} enum={[{value:0,label:"文本"},{value:1,label:"二维码"},{value:2,label:"条形码"},{value:3,label:"图片"},{value:4,label:"分隔线"}]}/>
            case "size" :return     <Control value={value} onChange={onChange} enum={[{value:0,label:"小号"},{value:1,label:"标准"},{value:2,label:"大号"}]}/>
            case "leftlength":return <Control value={value} onChange={onChange} enum={[{value:"8",label:"8"},{value:"12",label:"12"},{value:"16",label:"16"},{value:"24",label:"24"}]}/>
            case "toside":return    <Control value={value} onChange={onChange} enum={[{value:true,label:"两列"},{value:0,label:"单列"}]}/>
            case "gravity":return   <Control value={value} onChange={onChange} enum={[{value:0,label:"左"},{value:1,label:"中"},{value:2,label:"右"}]}/>
            case "style":return     <Control value={value} onChange={onChange} enum={[{value:0,label:"普通"},{value:1,label:"加粗"},{value:2,label:"斜体"}]}/>
            case "label":return     <Input style={{width:247,height:120}} type={"textarea"} value={value} onChange={({target})=>{onChange(target.value)}}/>
            case "upload":return    <ImageUpload size={200} onFileRead={(result)=>onChange(result,"image-upload")}/>
        }
        return null;
    }
}
