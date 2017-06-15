/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import "./index.scss";
export default class Component extends React.Component {
    render() {
        let {children,title,extra} =this.props;
        return (<div className="service-bordered-box">
            <div className="title-bar">
                <div className="left-title">{title}</div>
                <div className="right-extra">{extra}</div>
            </div>
            <div className="stat-group">
                {children}
            </div>
        </div>)
    }
}