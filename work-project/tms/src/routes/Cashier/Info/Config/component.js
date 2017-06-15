/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {Tabs, Button, Popconfirm} from "antd";
import FormNormal from "./form-normal";
import FormChannel from "./form-channel";
import Workable from "./form-operation";
import {Auth} from "../../../../components/ActionWithAuth";
import {handler} from "./reducer";
import {CASHIER_CHANNEL_DELETE,CASHIER_CHANNEL_UPDATE} from "../../../../config/auth_func";

import {initialChannel, nextStep, saveConf, deleteChannel} from "./reducer";
import FormPrintModel from "./form-print-model";
import "./config.scss";
export default class ChannelConf extends React.Component {
    componentWillMount() {
        let query=this.props.location.query;
        initialChannel(query.id);
        this.leaveHook = this.props.router.setRouteLeaveHook(this.props.route,()=>{
            if(handler.$state("isDirty"))return '您的操作未完成，离开后当前数据无法保存';
        });
    }
    componentWillUnmount(){
       // this.leaveHook();
        
    }
    
    render() {
        let info         =this.storeState.get("info");
        let providers    =this.storeState.get("providers");
        let types        =this.storeState.get("types");
        let step         =this.storeState.get("step");
        let loading      =this.storeState.get("loading");
        let deleteLoading=this.storeState.get("deleteLoading");
        let workable     =this.storeState.get("workable");
        let id=this.props.location.query.id;
        let infoLoading=this.storeState.get("infoLoading");
        return (
            <div className="cashier-channel-config">

                <Tabs animated={false} tabBarExtraContent={
                    <span>
                        <Auth to={CASHIER_CHANNEL_DELETE}>
                            <span>
                                 <Popconfirm title="确认要删除该通道吗？" onConfirm={()=>deleteChannel(id)}>
                        <Button type={"danger"} className="margin-right" size={"small"} loading={deleteLoading} >删除</Button>
                         </Popconfirm>
                            </span>
                        </Auth>
                        <Auth to={CASHIER_CHANNEL_UPDATE}>
                            <Button onClick={()=>saveConf(!!id)} type={"primary"} size={"small"} loading={loading} >保存</Button>
                        </Auth>
                    </span>
                } activeKey={step} onTabClick={(step)=> {
                    nextStep(step);
                }} type="card">
                    <Tabs.TabPane tab="基础信息" key="1">
                        <FormNormal payModeId={this.props.location.query.pay_mode_id} loading={infoLoading} id={id}
                                    types={types} providers={providers} info={info}/>
                    </Tabs.TabPane>
                        <Tabs.TabPane tab="业务能力配置" key="4">
                            <Workable store={workable}/>
                        </Tabs.TabPane>
                    <Tabs.TabPane tab="通道参数配置" key="2">
                        <FormChannel state={this.props[this.storeKey]}/>
                    </Tabs.TabPane>
                   

                </Tabs>

            </div>
        );
    }
}
    

