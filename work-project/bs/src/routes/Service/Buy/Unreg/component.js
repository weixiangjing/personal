/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import {Table,Row,Col,Input,Icon,Button,Steps} from "antd";
import {handler} from "./reducer"
import "./index.scss"

export default class Component extends React.Component {
    render() {
        let store =handler.$state();
        let current = store.get("step");
        return (<div className="service-buy-unreg">


            <div className="text-center">当前账号（138****1234）尚未开通计费账户，点击按钮立即开通</div>
                <div className="text-center action-bar">
                    <Button onClick={()=>{}} size={"large"} type={"primary"}>立即开通</Button>
                </div>




        </div>)
    }
}
