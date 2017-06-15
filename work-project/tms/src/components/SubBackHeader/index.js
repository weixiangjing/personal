/**
 *  created by yaojun on 2017/5/18
 *
 */

import React from "react";
import {Button,Icon} from "antd"
import "./index.scss";
import {hashHistory} from "react-router"
export default class Component extends React.Component {
    render() {
        let {title,extra} = this.props;
        return (
            <div className="sub-back-header">
                <Button  onClick={()=>hashHistory.goBack()}><Icon type="left"/>返回列表</Button>
                <div className="title">{title}</div>
                <div className="pull-right">{extra}</div>
            </div>)
    }
}