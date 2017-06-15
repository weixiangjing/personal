/**
 *  created by yaojun on 2017/4/12
 *
 */
import React from "react";
import {Card,Row,Col} from "antd";
import {CardTable} from "../../../../components/Table";
import "./index.scss";
export default class Component extends React.Component {
    render() {
        return (<CardTable className={"business-protocol-master"} url="abc/dfd" renderContent={(data,table)=>{
            return (<Card title="成都微智金融服务信息有限公司" extra={
                <a>
                    <span>编辑</span> | <span>删除</span>

                </a>
            }>
                <Row className={"item"}>
                    <Col span={24}><label>纳税人识别号：</label></Col>
                    <Col span={18}><label>开户行：</label></Col>
                    <Col span={6}><label>账号：</label></Col>
                    <Col span={18}><label>地址：</label></Col>
                    <Col span={6}><label>电话：</label></Col>


                </Row>
            </Card>)
        }}/>)
    }
}