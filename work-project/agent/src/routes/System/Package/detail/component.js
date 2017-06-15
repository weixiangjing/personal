/**
 *  created by yaojun on 17/2/22
 *
 */
import React from 'react';
import {echoDetail} from "./reducer";
import PaymentList from "./payment.component";
import "../index.scss";

export default class PackageDetail extends  React.Component{
    componentWillMount(){
        let params =this.props.location.query;
        this.params=params;
       
        echoDetail(params);
    }
    render(){
        let list = this.storeState.get("detail");
        return <div className="package-setting">
            <h5>套餐名称：{this.params.n}</h5>
            <PaymentList  list={list}/>
            </div>
    }
    
}