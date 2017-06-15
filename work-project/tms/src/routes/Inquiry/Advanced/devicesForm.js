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
import SearchHandler from "./AdvanceBase";
import {Icon32} from "../../../components/HomeIcon";
const FormItem = Form.Item;
const formItemLayout={
    labelCol:{span:6},
    wrapperCol:{span:18}
}
class Device extends SearchHandler {
    query_type = 3
    
    render() {
        let {getFieldDecorator} =this.props.form;
        let stat                = this.state.stat;
        let deviceAddressNum = stat.trade_address?stat.trade_address.length:0;
        return (<Form className="device-search"  onSubmit={(e) => this.handleSubmit(e)}>
            
            <Row className="search-items">
                <Col  lg={8} md={12} sm={12} xs={24}>
                    <FormItem {...formItemLayout} label={"设备en"}>
                        {
                            getFieldDecorator('device_en', {
                                rules: [{required: true, message: "必须输入设备en", type: "string"}]
                            })(<Input/>)
                        }
                    </FormItem>
                </Col>
                {this.dateSelect(3,1)}
                {this.channelSelect(false)}

                {this.tradeTypeControl()}
                
                {this.tradeStatusControl()}

                {this.amountControl()}

            </Row>
            
            
            <Row className="over-hide margin-v-lg">
                {this.actionBar()}
            </Row>
            
            {this.statControl(
                <div className="data-item-content">
                    <div className="data-item-txt">EN号:{stat.device_en}</div>
                </div>, 3,
                void 0
                ,stat.device_en===void 0
            )}
            
            
            {
                this.searchResult()
            }
        
        </Form>)
    }
}
export default Form.create()(Device)
function getDayAgo(num = 1, date = new Date) {
    return date.setDate(date.getDate() - num), date;
}

{/*<div className="data-group-item">*/}
    {/*<Icon32 type="address" className="data-item-icon"/>*/}
    {/*<div className="data-item-content">*/}
        {/*<div className="data-item-txt">交易地点分布</div>*/}
        {/*<div className="data-item-num">位置{deviceAddressNum} 个</div>*/}
    {/*</div>*/}
{/*</div>*/}