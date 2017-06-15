/**
 *  created by yaojun on 2017/5/18
 *
 */
import React from "react";
import {Icon, Tooltip, Modal, message} from "antd";
import SubHeader from "../../../../../components/SubBackHeader";
import VisualPrint from "../../../../../components/VisualPrint";
import {json2xml} from "../../../../../components/VisualPrint/util";
import {
    CASHIER_PRINTER_TEMPLATE_CUSTOM_SAVE,
    CASHIER_PRINTER_TEMPLATE_CUSTOM_DELETE,
    CASHIER_PRINTER_TEMPLATE_CUSTOM_BATCH_ADD
} from "../../../../../config/auth_func";
import {Auth} from "../../../../../components/ActionWithAuth";
import ListItemDelete from "../../../../../components/listItemDelete";
import PrintPresetsModal from "../../../../../components/PrintPresetsModal";
import axios from "axios";
import "./index.scss";

export default class Component extends React.Component {
    state={
        items: [],
        activeIndex: 0,
        visible: false,
        currentSaveState: 0
    }
    timeoutTimer=0;
    
    handleDelete(index=this.state.activeIndex) {
        
        let item=this.state.items[index];
        axios.post("tprintTemplate/update", {is_delete: 2, templateId: item.templateId}).then((res)=> {
            message.success("操作成功")
            this.componentWillMount();
        })
        
    }
    
    handleSave() {
        let item=this.state.items[this.state.activeIndex];
        let content="";
        if(item.template) {// 只有发生了改变才会有该属性
            content=json2xml(item.template);
            axios.post("tprintTemplate/update", {
                templateId: item.templateId,
                content
            }).then(()=>{
                this.setState({currentSaveState:0})
                message.success("操作成功")
            })
        } else {
            message.info("当前模板内容未发生任何改变");
        }
        //
    }
    
    handleAdd(items) {
        items=items.map(item=> {
            item.pre_set=2;
            return item
        })
        
        axios.post("tprintTemplate/batchAdd", {
            print_plan_id: this.id,
            templates: items
        }).then(()=>this.componentWillMount())
    }
    
    showTips() {
        this.setState({visible: true});
        this.timeoutTimer=setTimeout(()=>this.setState({visible: false}), 4000);
    }
    
    componentWillMount() {
        
        this.id=this.props.location.query.id
        axios.post("tprintTemplate/query", {
            print_plan_id: this.id,
            pre_set: 2
        }).then(res=>this.setState({items: res.data}));
        
    }
    
    componentWillUnmount() {
        
        clearTimeout(this.timeoutTimer);
    }
    
    selectTemplate(index) {
        if(index===this.state.activeIndex) return;
        if(this.state.currentSaveState>0) {
            Modal.confirm({
                title: "保存提示",
                content: "当前修改的模板尚未保存，确认选择其它模板？",
                onOk: ()=>{
                    this.refs.visual.setState({mode:'0'});
                    this.setState({activeIndex: index, currentSaveState: 0})
                }
            })
        } else {
            this.refs.visual.setState({mode:'0'})
            this.setState({activeIndex: index})
        }
        
    }
    
    render() {
        let current=this.state.items[this.state.activeIndex]
        
        let currentTemplate=current ? current.template ? current.template : current.content : [];
        
        return (
            <div>
                <SubHeader title="方案定制"/>
                <div className="custom-container">
                    <div className="quick-select-template">
                        {
                            this.state.items.map((item, index)=><ListItemDelete
                                onClick={()=>this.selectTemplate(index)} key={item.name}
                                showDelete={false}
                                className={"margin-bottom "+(this.state.activeIndex==index ? "active" : "")}
                                title={item.type_name} desc={item.type_code}/>)
                        }
                        
                        <Tooltip visible={this.state.visible} placement={"bottom"} title="请先在这添加一个或多个打印模板">
                            <Auth to={CASHIER_PRINTER_TEMPLATE_CUSTOM_BATCH_ADD}>
                                <div
                                    onClick={()=>PrintPresetsModal.getModal().open(this.state.items.map(item=>item.type_code))}
                                    className="list-item-width-delete">
                                    <Icon type="plus"/>添加打印模板
                                </div>
                            </Auth>
                        </Tooltip>
                    
                    </div>
                    <VisualPrint
                        ref="visual"
                        showDelete={true}
                        saveAuth={CASHIER_PRINTER_TEMPLATE_CUSTOM_SAVE}
                        deleteAuth={CASHIER_PRINTER_TEMPLATE_CUSTOM_DELETE}
                        onSave={()=>this.handleSave()}
                        showTips={()=>this.showTips()}
                        isEmpty={this.state.items.length===0}
                        onChange={(newTemplate)=> {
                            
                            let item=newTemplate.toJS();
                            
                            let items=this.state.items;
                            items[this.state.activeIndex].template=item;
                            this.setState({items, currentSaveState: this.state.currentSaveState+1});
                        }}
                        onDelete={()=>this.handleDelete()}
                        printControls={currentTemplate}/>
                </div>
                <PrintPresetsModal
                    
                    onConfirm={(items)=> {
                        this.handleAdd(items);
                        
                    }}/>
            </div>)
    }
}