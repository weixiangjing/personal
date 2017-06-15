/**
 *  created by yaojun on 16/12/19
 *
 */
import React from "react";
import {Form, Row} from "antd";
import SearchHandler from "./AdvanceBase";
import {amountFormat} from "../../../util/helper";
import {Icon32} from "../../../components/HomeIcon";

class Search extends SearchHandler {
    query_type = 1
 
    render() {
        let stat                                            = this.state.stat;
        return (<Form  onSubmit={(e) => this.handleSubmit(e)}>
            
            
            <Row className="search-items">
                {this.channelSelect(true)}
                {this.dateSelect()}
                {this.amountControl()}
                {this.tradeTypeControl()}
                {this.tradeStatusControl()}
                {this.actionBar()}
            </Row>


            
            
            {
                this.statControl(  <div className="data-item-content">
                    <div className="data-item-txt">{stat.pay_mode_name}</div>
                    <div className="data-item-num">{stat.pay_channel_name}</div>
                </div>,1,null,stat.pay_channel_name===undefined)
           
            }
            
            
{
    this.searchResult()
}
        
        </Form>)
    }
}
export default Form.create()(Search);
