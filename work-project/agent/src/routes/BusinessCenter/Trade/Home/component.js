/**
 *  created by yaojun on 2017/4/12
 *
 */
import React from "react";
import {Card,Input,Radio,Icon} from "antd";
import TradeTotalChart from "../../chart";
import LineChart from "../../line-chart";
import "./index.scss";
export default class Component extends React.Component {
    render() {
        return (<div className="business-center-trade">
            <Card title="交易总金额" extra={<span>
                <a>全部服务商</a>
                <span className="search-input">
                      <Icon type="search"/>
                    <Input placeholder="指定服务商查询" className="inline-block" style={{width:150}}/>

                </span>

                <Radio.Group>
                    <Radio.Button value="1">昨日</Radio.Button>
                    <Radio.Button value="2">本月</Radio.Button>
                    <Radio.Button value="3">上月</Radio.Button>
                </Radio.Group>
            </span>}>


                <TradeTotalChart pieId="chart-1-1" colId="chart-1-2"/>
            </Card>
            <Card title="参与分润交易总金额" extra={<span>
                <a>全部服务商</a>
              <span className="search-input">
                      <Icon type="search"/>
                    <Input placeholder="指定服务商查询" className="inline-block" style={{width:150}}/>

                </span>
                <Radio.Group>
                    <Radio.Button value="1">昨日</Radio.Button>
                    <Radio.Button value="2">本月</Radio.Button>
                    <Radio.Button value="3">上月</Radio.Button>
                </Radio.Group>
            </span>}>


                <TradeTotalChart pieId="chart-2-1" colId="chart-2-2"/>
            </Card>

            <Card title="交易趋势" extra={<span>
                <a>全部服务商</a>
              <span className="search-input">
                      <Icon type="search"/>
                    <Input placeholder="指定服务商查询" className="inline-block" style={{width:150}}/>

                </span>
            </span>}>


                <LineChart/>
            </Card>

        </div>)
    }
}