

import React from "react";
import {Select} from "antd";
import {getChannel} from "../../model/PayChannel";

export  class PayChannelSelect extends React.Component{
    static  propTypes={
        pay_mode_id:React.PropTypes.string.isRequired
    }
    state={
        options:[]
    }
    componentWillMount(){
        let id =this.props.pay_mode_id;
        if(id){
            this.fetchChannel(id);
        }
    }
    componentWillReceiveProps(nextProps){
      
        let id =nextProps.pay_mode_id
        if(id && id!==this.props.pay_mode_id){
           
            this.fetchChannel(nextProps.pay_mode_id,true);
        }
    }
    fetchChannel(id,clear){
     
       let  clean = this.props.clean;
       let  header =clean?[]:[{pay_channel_name:"（不限）",pay_channel_id:""}];
        getChannel({pay_mode_id:id,pageSize:999,status:1}).then(res=>{
            this.setState({options:header.concat(res.data)})
            let index=res.data.findIndex(item=>item.pay_channel_id==this.props.value);
            if(index==-1)this.props.onChange("") // 当前值不在options数组当中，清空
        });
    }
    
    handleChange(e){
     this.props.onChange(e);
    }
   
    render(){
        let {value,style,placeholder="请选择通道"}= this.props;
        let options =this.state.options;
        return (
            <Select allowClear filterOption={(val,options)=>options.props.children.indexOf(val)>-1} showSearch notFoundContent={"无匹配通道"} placeholder={placeholder} style={style} value={value?value+"":""} onChange={(e)=>this.handleChange(e)}>
                {
                    options.map(item=>{
                        return <Select.Option key={item.pay_channel_id} value={String(item.pay_channel_id)}>{item.pay_channel_name}</Select.Option>
                    })
                }
            </Select>
        )
    }
}