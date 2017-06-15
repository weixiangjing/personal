import React from "react";
import PaymentList from "./payment.component";
import {Button, Input,Alert} from "antd";
import "../index.scss";
import {submit, echoPayments,updateControl} from "./reducer";
export default class PackageSetting extends React.Component {
    componentWillMount() {
        let params = this.props.location.query;
        if(params.mcode){
            echoPayments(undefined,params);
        }else{
            
            echoPayments(params.id?params:undefined);
        }
        
    }
    render() {
        let payments = this.storeState.get("payments");
        let isShop   = this.storeState.get("isShop");
        let name =this.storeState.get("packageName");
        let isEmpty=this.storeState.get("isEmpty");
        console.log(isShop)
        return (
            <div className="package-setting">
                {
                    !isShop &&<span>
                        套餐名称：<Input  value={name} onChange={({target})=>updateControl(['packageName'],target.value,false,true)} placeholder="请输入分润套餐名称" className="margin-right-lg" style={{width: 200}}/>
                    </span>
                }
                {
                    !isEmpty&&<Button  onClick={() => submit()}>提交</Button>
                }
                {
                    (isEmpty && isShop) &&    <Alert  type="warning" message={<div>该门店还没有设置分润，点击此处设置分润套餐<Button className={"margin-left-lg"} onClick={()=>updateControl(['isEmpty'],false,true)}>新增</Button></div>}/>
                }
                
                
                    <PaymentList isEmpty={isEmpty} isShop={isShop} list={payments}/>
                
            </div>)
    }
}

