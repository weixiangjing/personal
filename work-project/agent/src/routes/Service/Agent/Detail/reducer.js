/**
 *  created by yaojun on 2017/6/2
 *
 */

import ReducerContainer from "reducer-container";
import axios from "axios";
import user from "../../../../model/User"
const immutable=require("immutable");
import moment from "moment"
const DATE_FORMAT="YYYY-MM-DD HH:mm:ss";
class Reducer extends ReducerContainer {
    
    store={
        step:0,
        detail:{
        
        }
    }
    changeStep(step){this.update("step",step)}
    getProtocol(){
        axios.get("agreement/template").then(res=>{
            console.log(res)
            this.update("protocol",immutable.fromJS(res.data))
        });
    }
    query(id){
        if(id)
        axios.get('agent/'+id).then(res=> this.update("detail",immutable.fromJS(res)));
    }
    submit(form){
        form.validateFields((error,object)=>{
            let value = immutable.fromJS(object).toJS();
            let eff_time=value.frameworkAgreement.effectiveTime;
            let exp_time=value.frameworkAgreement.expirationTime;
            if(value.authorZone){
                value.authorZone=value.authorZone.join('-');
            }
            if(eff_time){
                value.frameworkAgreement.effectiveTime=moment(eff_time).format(DATE_FORMAT);
            }
            if(exp_time){
                value.frameworkAgreement.expirationTime=moment(exp_time).format(DATE_FORMAT);
            }
            if(user.info.isAdmin){
                value.level=1;
            }else{
                value.level=2;
            }
            console.log(value);
            axios.post("agent",value)
            
           
        })
        
    }
    //TODO
    
}

export default new Reducer();