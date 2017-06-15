/**
 *  created by yaojun on 2017/5/11
 *
 */
import React from "react";
import {Alert, Anchor, Button, Icon, Input, Popconfirm, Radio} from "antd";
import {Auth} from "../../components/ActionWithAuth";
import Draggable from "../Draggable";
import DropContainer from "./print-model-sort";
import InspectorContainer from "./print-model-inspector";
import {json2xml, xml2json} from "./util";
import "./index.scss";
import CodeMirrorComponent from "./codeMirror/index";
const data=require("../../config/print_presets");
const templates=require("../../config/pirnt_template_presets");
import "./codeMirror/lib/codemirror.css";
const CodeMirror =require("./codeMirror/lib/codemirror");
const Immutable=require("immutable");
export default class Component extends React.Component {
   
    state={
        mode: "0",
        sourceCode: "",
        printControls: [],
        printInspector: [],
        templateName: "",
        responderIndex: 0
        
    }
    isResetInspector=true;
  
    componentWillMount() {
        let controls=this.props.printControls;
        this.refresh(controls);
    }
 
    refresh(controls, reset,name="") {
        if(typeof controls==="string") {
            controls=xml2json(controls).template;
        }
        if(reset) {
            let _controls=Immutable.fromJS(controls||[]);
            let inspector={
                printInspector: _controls.get(0)||Immutable.List([]),
                responderIndex: 0
            }
            let printControls={printControls: _controls};
            if(this.isResetInspector) {
                Object.assign(printControls, inspector,{templateName:name});
            }
           
            this.setState(printControls)
        } else {
            this.state.templateName=name
            this.state.printControls=Immutable.fromJS(controls||[]);
            this.state.printInspector=this.state.printControls.get(0)||Immutable.List([])
        }
    }
    
    componentWillReceiveProps(props) {
        if(this.props.printControls!==props.printControls) {
            this.refresh(props.printControls,true, props.templateName);
        }
    }
    
    handleDrop(e) {
        let transferData=e.dataTransfer.getData('control')
        let data=JSON.parse(transferData);
        data.id=Math.random();
        data.active=true;
        let dropElement=e.target;
        let className=dropElement.className;
        
        if(className.indexOf("drop-items")> -1) {//root
            this.dragControlToDisplay(data);
        } else {
            let insertIndex=this.findIndex(dropElement);
            this.dragControlToDisplay(data, insertIndex);
        }
    }
    
    findIndex(ele) {
        if(ele.id&&ele.id.indexOf("drop-control-item")> -1) {
            return Number(ele.id.replace("drop-control-item-", ""));
        } else {
            return ele.parentNode ? this.findIndex(ele.parentNode) : -1;
        }
    }
    
    dragControlToDisplay(data, index) {
        
        let controls=this.state.printControls;
        let resIndex=0;
        controls=controls.map(item=>item.set("active", false));
        if(index!==(void 0)&&index> -1) {
            controls=controls.splice(index, 0, Immutable.fromJS(data));
            resIndex=index;
        } else {
            controls=controls.push(Immutable.fromJS(data))
            resIndex=controls.size;
        }
        this.setState({
            printControls: controls,
            isDragEnter: false,
            responderIndex: resIndex,
            printInspector: Immutable.fromJS(data).set("index", index)
        }, ()=>this.notifyChanged())
        
    }
    
    handleInspectorChanged(item, value, index) {
        let inspect=this.state.printInspector.updateIn(['props', item], ()=>value);
        let chaneIndex=this.state.printControls.findIndex(item=>item.get("id")==inspect.get("id"));
        this.setState({
            printControls: this.state.printControls.set(chaneIndex, inspect),
            printInspector: inspect
        }, ()=>this.notifyChanged())
        
    }
    
    reloadFromXmlCode(xml) {
        this.setState({sourceCode: xml});
        let object=xml2json(xml);
        let name=object.name;
        let template=object.template;
        let _tem=Immutable.fromJS(template);
        this.setState({
            printControls: _tem,
            printInspector: _tem.get(0)||Immutable.fromJS({}),
            templateName:name
        }, ()=>this.notifyChanged(true, name));
        
    }
    
    handleDeleteControl() {
        let deleteIndex=this.state.printControls.findIndex(item=>item.get("id")===this.state.printInspector.get("id"));
        let controls=this.state.printControls.delete(deleteIndex)
        this.setState({
            printControls: controls,
            printInspector: controls.get(0)||Immutable.List([])
        }, ()=>this.notifyChanged(true))
        
    }
    
    /**
     *
     * @param isRestInspector 只有删除操作才会重置 Inspector
     */
    notifyChanged(isRestInspector=false, templateName) {
        this.isResetInspector=isRestInspector;
        this.props.onChange(this.state.printControls, templateName);
    }
    
    handleSortEnd(controls, control, newIndex, oldIndex) {
        this.setState({
            printControls: Immutable.fromJS(controls),
            printInspector: Immutable.fromJS(control).set('index', newIndex),
            responderIndex: newIndex
        }, ()=> {
            if(oldIndex!==newIndex) {
                this.notifyChanged();
            }
        });
        
    }
    
    displaySourceCode(e){
        let value =e.target.value;
        this.setState({
            mode: e.target.value,
            sourceCode: value==1 ? json2xml(this.state.printControls.toJS(), this.state.templateName,'\n') : ""
        })
    }
    
    render() {
        
        let controls=this.state.printControls;
        let {isEmpty, onSave, onDelete, saveAuth, deleteAuth,showDelete,showSave=true}=this.props;
        
        return (<div className="common-print-model-visual">
            
            <div className="margin-bottom visual-header-bar">
                
                <Radio.Group value={this.state.mode} onChange={(e)=> this.displaySourceCode(e)}>
                    <Radio.Button value="0">可视化</Radio.Button>
                    <Radio.Button value="1">源码查看</Radio.Button>
                </Radio.Group>
                {
                   showDelete && <Auth to={deleteAuth}>
                        <Popconfirm onConfirm={()=>onDelete()} title="确认要删除该模板吗">
        
                            <Button className={"pull-right margin-left"} type={"danger"}><Icon
                                type="delete"/>删除</Button>
                        </Popconfirm>
                    </Auth>
                }
                {
                   showSave && <Auth to={saveAuth}>
                        <Button onClick={()=>onSave(this.state.printControls)} className="pull-right "
                                type={"primary"}><Icon
                            type="save"/>保存</Button>
                    </Auth>
                }
                
            </div>
            <div className="visual-container">
                <div className={`drag-items pull-left mode-${this.state.mode}`}>
                    {
                        data.map(item=> {
                            return (<Draggable params={item} label={item.type}/>)
                        })
                    }
                </div>
                <div onDrop={(e)=>this.handleDrop(e)}
                     onDragOver={(e)=>e.preventDefault()}
                     className={"drop-items pull-left mode-"+this.state.mode}>
                    {
                        this.state.mode=="0" ?
                            (this.state.printControls.size==0 ?
                                <Alert type="info" showIcon description="将左边预设文本控件拖到此处"/> :
                                <DropContainer printInspector={this.state.printInspector}
                                               onSortEnd={(controls, control, newIndex, oldIndex)=>this.handleSortEnd(controls, control, newIndex, oldIndex)}
                                               controls={controls}/> ) :
                            <CodeMirrorComponent value={this.state.sourceCode} onChange={(v)=>this.reloadFromXmlCode(v)}/>
                           
                    }
                
                </div>
                
                {
                    this.state.mode=="0"&&<div className="inspect-items pull-left">
                        <Anchor>
                            <InspectorContainer onDeleteControl={()=>this.handleDeleteControl()}
                                                onChange={(item, value, index)=>this.handleInspectorChanged(item, value, index)}
                                                printInspector={this.state.printInspector}/>
                        </Anchor>
                    </div>
                }
                {
                    isEmpty&&<div onMouseDown={()=>this.props.showTips()} className="disabled-layer"></div>
                }
            </div>
        
        
        </div>)
    }
}


