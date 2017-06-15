/**
 *  created by yaojun on 16/12/20
 *
 */
/**
 *  created by yaojun on 16/12/19
 *
 */
import React from "react";
import {Form, Input, Row, Col} from "antd";
import {amountFormat} from "../../../util/helper";
import {Icon32} from "../../../components/HomeIcon";
import SearchHandler from "./AdvanceBase";
const FormItem = Form.Item;
const formItemLayout={
    labelCol:{span:6},
    wrapperCol:{span:18}
}
class Merchant extends SearchHandler {
    query_type = 2
    
    render() {
        let {getFieldDecorator } =this.props.form;
        let stat                                            = this.state.stat;
        return (<Form onSubmit={(e) => this.handleSubmit(e)}>
            
            <Row className="search-items">
                <Col  lg={8} md={12} sm={12} xs={24}>
                    <FormItem {...formItemLayout} label={"MCODE"} >
                        {
                            getFieldDecorator('mcode', {
                                rules: [{required: true, message: "必须输入mcode", type: "string"}]
                            })(<Input/>)
                        }
                    </FormItem>
                </Col>
                {this.dateSelect(3,1)}
                {this.channelSelect(false)}

                {this.tradeTypeControl()}
                
                {this.tradeStatusControl()}

                {this.amountControl()}
                {this.actionBar()}

            </Row>
            
            <Row className="over-hide margin-v-lg">
            </Row>
            {
                this.statControl(<div className="data-item-content">
                    <div className="data-item-txt text-ellipsis">{stat.store_name||"--"}</div>
                    <div className="data-item-num">{stat.mcode}</div>
                </div>,2,null,stat.mcode===undefined)}
              
            {
                this.searchResult()
            }
        </Form>)
    }
}
export default Form.create()(Merchant)
function getDayAgo(num = 1, date = new Date) {
    return date.setDate(date.getDate() - num), date;
}