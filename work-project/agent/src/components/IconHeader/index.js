/**
 *  created by yaojun on 2017/6/7
 *
 */

import React from "react";
import "./index.scss";
export default class IconHeader extends React.Component {
    render() {
        let {icon="fa-user-circle",title="创建服务商",desc="请先选择待签约服务商类型及协议类型，系统会自动拉取该类型服务商的签约模板，您可以在此模板上调整、修改协议内容"} =this.props;
        return (
            <div className="common-icon-header">
                <i className={`fa ${icon}`}/>
                <div>
                    <h3>{title}</h3>
                    <div className="text-shade">{desc}</div>
                </div>
            </div>
        )
    }
}