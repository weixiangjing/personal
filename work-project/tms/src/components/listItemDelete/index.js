/**
 *  created by yaojun on 2017/5/18
 *
 */
import React from "react";
import {Icon, Popconfirm} from "antd";
import "./index.scss";
export default class Component extends React.Component {
    noop(){}
    render() {
        let {title, desc, className="", titleClass, desClass, onDelete=this.noop,onClick=this.noop,showDelete=true}=this.props;
        return (<div onClick={()=>onClick()} className={`list-item-width-delete ${className}`}>
            <div className={titleClass}>{title}</div>
            <div className={desClass}>{desc}</div>
            {
                showDelete &&   <Popconfirm onConfirm={()=>onDelete()} title="确认要删除吗？">
                    <div  className="delete"><Icon type="delete"/></div>
                </Popconfirm>
            }
          
        </div>)
    }
}