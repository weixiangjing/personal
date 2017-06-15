/**
 *  created by yaojun on 16/12/19
 *
 */
import React from "react";
import {Form, Select, DatePicker, Row, Button, Col} from "antd";
import moment from "moment";
import {amountFormat,numberFormat} from "../../../util/helper";
import {Icon32} from "../../../components/HomeIcon";
import SearchHandler from "./AdvanceBase";
const MonthFormat = "YYYY-MM";
const DateFormat  = MonthFormat + "-DD";
class TradeDate extends SearchHandler {
    query_type = 0
    
    render() {
        let {getFieldDecorator} =this.props.form;
        let stat                = this.state.stat;
        return (<Form  onSubmit={(e) => this.handleSubmit(e)}>



            
            <Row>
                

                {this.dateSelect(1,1,undefined,false)}
                {this.tradeTypeControl()}

                {this.tradeStatusControl()}
                {this.amountControl()}
                {this.actionBar()}
            
            </Row>
            
            {
                stat.total_trade_num!==undefined&&<Row className="data-group">
                    <Col  span={7} className="data-group-item">
                        <Icon32 type="stat" className="data-item-icon"/>
                        <div className="data-item-content">
                            <div className="data-item-txt">交易总笔数</div>
                            <div className="data-item-num">{numberFormat(stat.total_trade_num)}</div>
                        </div>
                    </Col>
                    
                    <Col  span={7}  className="data-group-item">
                        <Icon32 type="amount" className="data-item-icon"/>
                        <div className="data-item-content">
                            <div className="data-item-txt">订单总金额（元）</div>
                            <div className="data-item-num">￥{amountFormat(stat.total_order_amount / 100)}</div>
                        </div>
                    </Col>
                    
                    
                    <Col span={7} className="data-group-item">
                        <Icon32 type="amount-o" className="data-item-icon"/>
                        <div className="data-item-content">
                            <div className="data-item-txt">交易总金额（元）</div>
                            <div className="data-item-num">￥{amountFormat(stat.total_trade_amount / 100)}</div>
                        </div>
                    </Col>
                    
                    <Col span={3} className="text-right">
                    {
                        this.exportControl(0)
                    }
                    </Col>
                
                
                </Row>
            }
            
            
            {this.searchResult()}
        
        </Form>)
    }
}
export default Form.create()(TradeDate);
