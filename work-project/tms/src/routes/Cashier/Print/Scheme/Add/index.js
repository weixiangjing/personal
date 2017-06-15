/**
 *  created by yaojun on 2017/5/18
 *
 */
import React from "react";
import {Button, Col, Icon, Input, message, Popconfirm, Row} from "antd";
import SubHeader from "../../../../../components/SubBackHeader";
import MCODEModal from "../../../../../components/Modal/MCODEModal";
import axios from "axios";
import PaymentCascader from "../../../../../components/PaymentCascader";
import {CardTable} from "../../../../../components/Table";
import "./index.scss";
import {
    CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_CHANNEL,
    CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_CHANNEL_DELETE,
    CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_M_CODE,
    CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_M_CODE_DELETE
} from "../../../../../config/auth_func";
import {Auth} from "../../../../../components/ActionWithAuth";
export default class Component extends React.Component {
    
    name="channel-table"
    searchValue="";
    
    handleChannelSelected(arg) {
        this.channelId=arg[1];
        
    }
    
    handleDelete(item) {
        axios.post("tprintPlanApply/update", {is_delete: 2, print_plan_apply_id: item.print_plan_apply_id}).then(()=> {
            message.success("操作成功");
            CardTable.getTableInstance(this.name).reload()
        })
    }
    
    addByChannel(arg) {
        
        return axios.post("tprintPlanApply/add", {
            print_plan_id: this.props.location.query.id,
            scope: "2",
            apply_id: this.channelId
        })
    }
    
    add(value, type) {
        let result;
        if(!value||value.length===0) return
        if(type==1) {
            if(!this.channelId) return;
            result=this.addByChannel()
        } else {
            result=this.addByMerchant(value);
        }
        result.then(()=> {
            this.channelId=null;
            CardTable.getTableInstance(this.name).reload()
        })
    }
    
    addByMerchant(codes) {
        return axios.post("tprintPlanApply/add", {
            print_plan_id: this.props.location.query.id,
            scope: "3",
            apply_id: codes.map(item=>item.mcode).join(",")
        })
    }
    
    render() {
        let isChannel=this.props.location.query.type==1;
        let query={print_plan_id: this.props.location.query.id}
        query.scope=isChannel ? "2" : "3";
        
        return (
            <div className="scheme-add-by-channel-merchant">
                <SubHeader title={this.props.location.query.name}/>
                {
                    isChannel ? (
                        
                        <div>
                            <PaymentCascader onChannelChange={(arg)=>this.handleChannelSelected(arg)}
                                             params={{status: "1"}}/>
                            <Auth to={CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_CHANNEL}>
                                <Button className="margin-left" onClick={(arg)=>this.add(arg, 1)}
                                        type="primary">添加</Button> </Auth>
                        </div>
                    ) : <div className="add-by-merchant">
                        <Input onChange={(e)=>this.searchValue=e.target.value} placeholder="门店名称/MCODE"/>
                        <Button
                            onClick={()=>CardTable.getTableInstance(this.name).reload({mcode: this.searchValue})}
                            type="primary" className="margin-left-lg">搜索</Button>
                    </div>
                }
                
                <CardTable name={this.name} fixedParams={query} url="tprintPlanApply/query"
                           renderContent={(types)=>
                               <Row gutter={24} className="margin-top-lg ">
                                   {types.map(item=>(
                                       <Col key={item.apply_id} className="scheme-add-item" lg={8} md={12}>
                                           <div>
                                               <div className="text-shade text-ellipsis">{item.apply_id}</div>
                                               <div className="sec_title text-ellipsis">{item.apply_name}</div>
                                               <div className="delete">
                                                   <Auth
                                                       to={isChannel ? CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_CHANNEL_DELETE : CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_M_CODE_DELETE}>
                                                       <Popconfirm onConfirm={()=>this.handleDelete(item)}
                                                                   title="确认删除该方案吗？">
                                                
                                                           <Icon type="delete"/>
                                            
                                                       </Popconfirm>
                                                   </Auth>
                                               </div>
                                           </div>
                                       </Col>))}
                        
                        
                                   {
                                       !isChannel&&<Col className="scheme-add-item" lg={8} md={8}>
                                           <Auth replace to={CASHIER_PRINTER_TEMPLATE_CUSTOM_ADD_M_CODE}>
                                               <div onClick={()=>MCODEModal.getModal().open()} className="text-center">
                                                   <Icon className="plus text-shade" type="plus"/>
                                               </div>
                                           </Auth>
                                       </Col>
                                   }
                    
                    
                               </Row>}/>
                <MCODEModal onConfirm={(a)=>this.add(a)} title="添加打印方案"/>
            </div>)
    }
}


