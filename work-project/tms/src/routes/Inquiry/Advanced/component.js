/**
 *  created by yaojun on 16/12/19
 *
 */
import React from 'react';
import {Tabs} from "antd";
import ChannelSearchForm from "./searchForm";
import MerchantSearchForm from "./merForm";
import DevicesSearchForm from "./devicesForm";
import TimeForm from "./timeForm";
import "./index.scss";
const Pane =Tabs.TabPane;

export default class AdvancedSearch extends React.Component {
    
    state={
        channels:[]
    }
    render(){
        let children=this.props.children;
        return (
            <div className="advanced-container">
                {children}
            <div style={{display:children?"none":"block"}}>
            <Tabs animated={false} type="card"  className="inquiry-advanced">
    
            
            <Pane tab="通道" key={"1"} >
                <ChannelSearchForm  channels={this.state.channels}/>

            </Pane>
            <Pane tab="门店" key={"2"} >
                <MerchantSearchForm   channels={this.state.channels}/>
             
            </Pane>
            <Pane tab="设备" key={"3"} >
                <DevicesSearchForm  channels={this.state.channels}/>
               
            </Pane>
            <Pane tab="交易日" key={"0"} >
                <TimeForm   channels={this.state.channels}/>
    
            </Pane>

        </Tabs>
            </div>
            </div>)
    }
}
 

    

