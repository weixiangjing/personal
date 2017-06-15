/**
 *  created by yaojun on 2017/5/19
 *
 */

import React from "react";
import {Modal} from "antd"
export default class Component extends React.Component {
    state={
        visible:false,
        modalWidth:600
    }
    static getModal (){
        return Component.instance;
    }
    static instance;
    componentWillMount(){
        Component.instance=this;
        this.componentWillMountImp();
    }
    componentWillMountImp(){
        
    }
    close(state={}){
        this.setState(Object.assign({visible:false},state));
    }
    open(state={}){
        this.setState(Object.assign({visible:true,items:[]},state))
    }
    getFooter(){
        return null;
    }
    getContent(){
        return null;
    }
    render() {
        let {title} =this.props;
        let width =this.state.modalWidth||600;
        let props={
            visible:this.state.visible,
            title,
            width,
            onCancel:()=>this.close(),
        };
        let footer =this.getFooter();
        if(footer) props.footer=footer;
            
        return (
            <div><Modal  {...props}>
                {this.getContent()}
            </Modal></div>
            
        )
    }
}