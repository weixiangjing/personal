/**
 *  created by yaojun on 2017/5/18
 *
 */
import React from "react";
import {Modal, Button,Table} from "antd";
import SingleModal from "../Modal/SingleModal";
import Source from "../../config/pirnt_template_presets";
import axios from "axios";
export default class Component extends SingleModal {
    state={
        visible:false,
        items:[],
        source:[],
        origin_source:[]
      
    }
    
    componentWillMountImp(){
        axios.post("tprintTemplate/query",{pre_set:1,status:1}).then(res=>this.setState({source:res.data,origin_source:res.data}));
    }
    
    /**
     * @override
     */
    open(selected=[]){
        super.open();
        let source = this.state.origin_source.filter(item=>selected.indexOf(item.type_code)===-1);
        this.setState({source,items:[]});
        
    }
    static defaultProps={
        title:"添加打印模板"
    }
    selectedRows=[]
    getFooter(){
        let {onConfirm,selectedRows=[]}=this.props;
        return (
            <div>
                <span className="pull-left">总共 {this.state.source.length} 个 已选择 {this.state.items.length} 个</span>
                <Button onClick={()=>this.close()}>取消</Button>
                <Button onClick={()=>{
                    onConfirm(this.state.items);this.close();}} type={"primary"}>确认</Button>
    
            </div>
        )
    }
  
    getContent(){
        let {onConfirm,selectedRows=[]}=this.props;
        
        return (
            <Table
                
                dataSource={this.state.source}
                pagination={false}
                scroll={{y:240}}
                rowKey={"type_code"}
                rowSelection={{
                    onChange:(selectedRowKeys,selectedRows)=>{
                        this.setState({items:selectedRows})
                    },
                    selectedRowKeys:this.state.items.map(item=>item.type_code)
                }}
                columns={
                    [{
                        title:"模板类型名称",
                        dataIndex:"type_name"
                    },{
                        title:"类型编号",
                        dataIndex:"type_code"
                    }]} />
        )
    }
   
}