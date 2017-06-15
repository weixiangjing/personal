/**
 *  created by yaojun on 2017/5/11
 *
 */
import React from "react";
import {Radio,Input,Button,Select,Icon,Anchor} from "antd"
import Draggable from "./visual/dragable";
import DropContainer from "./print-model-sort";
import InspectorContainer from "./print-model-inspector";


import {handler,pushPrintControlToDisplay,setDropControls,xml2json,_json2xml} from "./reducer"
const data=require("../../../../config/print_presets");
const templates=require("../../../../config/pirnt_template_presets");

const Immutable =require("immutable");
export default class Component extends React.Component {
    state={
        mode:"0",
        sourceCode:""
    }
    handleDrop(e){
        let transferData=e.dataTransfer.getData('control')
        let data =JSON.parse(transferData);
        data.id=Math.random();
        data.active=true;
        let dropElement = e.target;
        let className= dropElement.className;
    
        if(className.indexOf("controls-display")>-1){//root
            pushPrintControlToDisplay(data);
        }else{
            let insertIndex= this.findIndex(dropElement);
            pushPrintControlToDisplay(data,insertIndex);
        }
    }
    findIndex(ele){
        if(ele.id && ele.id.indexOf("drop-control-item")>-1){
            return Number(ele.id.replace("drop-control-item-",""));
        }else {
            return ele.parentNode?this.findIndex(ele.parentNode):-1;
        }
    }
    getSourceCodeFromView(){
        let sourceCode = handler.$state("printControls").toJS();
        let root= document.createElement("div");
        let row = document.createElement("row");
        for(let i=0;i<sourceCode.length;i++){
            let item = sourceCode[i].props;
            for(let prop in item){
                if(prop!=="label"){
                    row.setAttribute(prop,item[prop]);
                }
            }
            row.innerText=item.label||"";
                root.appendChild(row.cloneNode(true));
            
        }
           return "<Template>"+root.innerHTML+"</Template>";
    }
    getViewFromSourceCode(e){
        let sourceCode=this.state.sourceCode
        let root =document.createElement("div");
            root.innerHTML=sourceCode;
        let row =root.children[0].content.children;
        let array=[]
        for(let i=0;i<row.length;i++) {
            let object={}
            let item=row[i];
            let attributes=item.attributes;
            object.id=Math.random();
            object.classify="";
            let props=object.props={}
            for(let j=0; j<attributes.length; j++) {
                let attr=attributes[j];
                props[attr.name]=attr.value;
            }
            props.label=item.textContent;
            array.push(object);
        }
        setDropControls(array)
    }
    quickSelectTemplate(nameIndex){
        let item = templates[nameIndex];
       setDropControls(item.template,item.name);
    }
    render() {
        
        let store=handler.$state();
        let controls=store.get("printControls");
      
        return (<div className="print-model-visual">
            
            <div className="margin-bottom">
                <Select onChange={(name)=>this.quickSelectTemplate(name)} placeholder="快速选择打印模板" style={{width:200}} className="margin-right">
                    {
                       templates.map((item,index)=><Select.Option key={item.name} value={index}>{item.alias}</Select.Option>
                       )
                    }
                </Select>
                <Radio.Group style={{marginLeft:291}} defaultValue="0" onChange={(e)=>{
                    this.setState({mode:e.target.value,sourceCode:e.target.value==1?_json2xml():""})
                }}>
                    <Radio.Button value="0">可视化</Radio.Button>
                    <Radio.Button value="1">源码查看</Radio.Button>
                </Radio.Group>
               
            </div>
            <div className="print-model-drag-area">
                {
                    data.map(item=> {
                        return (<Draggable params={item} label={item.type}/>)
                     
                    })
                }
            </div>
            <div onDrop={(e)=>this.handleDrop(e)}
                 onDragOver={(e)=>e.preventDefault()}
                 className={"print-model-drop-area controls-display mode-"+this.state.mode}>
                {
                    this.state.mode=="0"? <DropContainer controls={controls}/>:<Input onChange={(e)=>{
                        this.setState({sourceCode:e.target.value});
                        xml2json(e.target.value)
                        }} style={{height:700}} value={this.state.sourceCode} type={"textarea"}/>
                }
               
            </div>
          
            {
             this.state.mode=="0" && <div  className="print-model-inspect-area">
                 <Anchor>
                     <InspectorContainer controls={controls}/>
                 </Anchor>
             </div>
            }
            
        </div>)
    }
}

