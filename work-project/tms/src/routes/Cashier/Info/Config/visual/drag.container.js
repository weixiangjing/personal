/**
 *  created by yaojun on 16/12/22
 *
 */
import React from "react";
import StoreParamsPresets from "../../../../../config/store_params_preset";
import TerminalPresets from "../../../../../config/terminal_params_presets";
import BaseControls from "../../../../../config/base_presets";
import {Button,Modal} from "antd";
import {getChannel} from "../../../../../model/PayChannel"
import {PayChannelSelect} from "../../../../../components/PayChannelSelect";
import Draggable from "./dragable";

import {_getStoreParams,setStoreParams,_getControlsLength,ChannelConf} from "../reducer";

export default class DragContainer extends React.Component {
    state={
        importChannel:null,
        loading:false
    }
    render() {
        return ( <div className="control-prefabs">
            <div className="padding-v">商户预设控件</div>
            {
                StoreParamsPresets.map((item, index)=> {
                    return (<Draggable icon="store" key={index} {...item}/>)
                })
            }
            <div className="padding-v">终端预设控件</div>
            {
                TerminalPresets.map((item, index)=> {
                    return (<Draggable icon="terminal" key={index} {...item}/>)
                })
            }
            <div className="padding-v">基础控件</div>
            {
                BaseControls.map((item, index)=> {
                    return (<Draggable key={index} {...item}/>)
                })
            }
            <div className="import-exist-channel">
                <div className="padding-v">按通道导入</div>
                <PayChannelSelect placeholder="选择支付通道" value={this.state.importChannel} style={{width:200}} clean pay_mode_id={ChannelConf['normal'].getFieldValue("pay_mode_id")} onChange={(channel)=>{
                  this.setState({importChannel:channel,ascOrDesc:"1"})
                }} />
                <Button loading={this.state.loading} onClick={()=>{
                    this.setState({loading:true});
                    getChannel({pay_channel_id:this.state.importChannel}).then(res=>{
                        let detail = res.data[0];
                        let controls =_getStoreParams(detail);
                        if(_getControlsLength()>0){
                            Modal.confirm({
                                title:'提示',
                                content:"导入的通道模板将覆盖现有参数，确认继续？",
                                onOk:()=>{
                                    setStoreParams(controls);
                                   }
                            })
                        }else{
                            setStoreParams(controls);
                        }
                        this.setState({loading:false})
                       
                    })
                }} disabled={!this.state.importChannel} type={"primary margin-left"}>导入</Button>
            </div>
        </div>);
    }
}
    