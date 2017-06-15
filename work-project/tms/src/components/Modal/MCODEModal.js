/**
 *  created by yaojun on 2017/5/19
 *
 */

import React from "react";
import {Table,Input,Row,Col,Button} from "antd";
import axios from 'axios';
import SelectionModal from "../PrintPresetsModal";

export default class Component extends SelectionModal {
    state={
        visible:false,
        source:[],
        items:[],
        modalWidth:720,
        origin_source:[],
        value:""
    }
    handleChange(value){
        if(!value.trim()) return;
        let mcode =value.split(/\n/).filter(item=>item).join(',');
        axios.post("tprintPlan/getMerChantByMcode",{mcode}).then(res=>{
            this.setState({source:res.data,items:[],origin_source:res.data});
        })
    }
    open(){
        this.setState({visible:true,source:[],items:[],origin_source:[],value:""});
    }
    
    /**
     * @override
     */
    componentWillMountImp(){
        
    }
    
    getContent(){
        return (
            <Row gutter={24}>
                <Col span={8}>
                        <Input value={this.state.value} onChange={(e)=>this.setState({value:e.target.value})} type="textarea" rows={12}/>
                    <div className="over-hide margin-top">
                    <Button className="pull-right" onClick={()=>this.handleChange(this.state.value)}>导入门店</Button>
                    </div>
                </Col>
                <Col span={16}>
                    <Table dataSource={this.state.source}
                           rowKey={"mcode"}
                           pagination={false}
                           scroll={{y:240}}
                           rowSelection={{
                               onChange:(selectedRowKeys,selectedRows)=>{
                                   console.log(selectedRowKeys)
                                   this.setState({items:selectedRows})
                               },
                               selectedRowKeys:this.state.items.map(item=>item.mcode)
                           }}
                           columns={[{
                               title:"门店名称",
                               render:(a,col)=><span>【{col.mcode}】{col.store_name}</span>
                           }]}/>
                </Col>

            </Row>)
    }
}