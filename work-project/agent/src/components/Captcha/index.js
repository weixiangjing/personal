/**
 *  created by yaojun on 2017/6/6
 *
 */

import React from "react";
import axios from "axios";
import {Button} from "antd";
/**
 * @constructor Captcha
 */
class Captcha extends React.Component {
    static ACTION={
        OPEN_MERCHANT:"openMerchant",
        RETRIEVE_PASSWORD:"retrievePassword"
    }
    static propTypes={
        phone:React.PropTypes.number.isRequired,
        action:React.PropTypes.string.isRequired
    }
    static  defaultProps={
        phone:""
    }
    state={count:5,running:false,loading:false}
    timeoutId=0;
    send(){
        if(this.props.phone.toString().trim().length!==11) return ;
        this.setState({loading:true});
        axios.get("utils/sms?phone="+this.props.phone+"&action="+this.props.action)
            .then(()=>this.startTimer())
            .finally(()=>  this.setState({loading:false}))
    }
    
    startTimer(){
        if(this.state.count===0) return clearTimeout(this.timeoutId);
        this.setState({count:this.state.count-1});
        this.timeoutId= setTimeout(()=>this.startTimer(),1000);
    }
    componentWillUnmount(){
        clearTimeout(this.timeoutId);
    }
    render() {
        return (<Button style={{background:"none",border:0}} size={"small"} onClick={()=>this.send()} disabled={this.state.running} loading={this.state.loading}>{this.state.running?this.state.count+"秒":"获取验证码"}</Button>)
    }
}


export default Captcha;