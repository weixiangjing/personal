/**
 *  created by yaojun on 2017/5/5
 *
 */

import React from "react";
import {Form,Input,Checkbox,Button,Tabs,Alert,Icon,Modal} from "antd";
import axios from "axios";
import ChannelSelect from "../../../../components/PaymentCascader";
import "./index.scss";

const FormItem = Form.Item;
 class Component extends React.Component {
     state={
         process:false,
         logs:[],
         active:"1",
         loading:false
     }
     view=null;
    handleSubmit(e){
        e.preventDefault();
        this.getProcess().then(({isSync})=>{
            if(isSync==false){
                let value =this.props.form.getFieldsValue();
                let send =Object.assign({},value);
                if(send.type){
                    send.type.forEach(item=>{send[item]=true});
                    delete send.type;
                }
                if(send.paychannelId && send.paychannelId.length>0){
                    send.paychannelId=send.paychannelId[1];
                }
    
                this.setState({loading:true})
                axios.post("cashConfigSync/storeCashConfigSync",send).then(res=>{
                    this.setState({active:"2",loading:false})
                    this.showProcess();
                })
            }else{
                Modal.info({title:"提示",content:"同步尚未完成~"});
            }
        })
       
    }
    
    getProcess(){
        return  axios.post("cashConfigSync/getSpeedofProgress",{showProcess:false}).then(res=>res.data[0])
    }
    showProcess(key){
       
       this.getProcess().then(res=>{
            let logs= res.speedofProgressLog;
            logs= logs.split("\n").join("<br>")
            let process = res.isSync;
            this.setState({logs:logs,process});
           
           
            if(process==true){
               this.timer= setTimeout(()=> this.showProcess(),3000);
            }
        })
    }
   
    render() {
        let {getFieldDecorator} =this.props.form;
        let layoutItem ={
            labelCol:{span:4},
            wrapperCol:{span:8}
        }
        
        return (
        <Tabs activeKey={this.state.active} onTabClick={(key)=>{
            if(key==2 && this.view==null){
                setTimeout(()=>{
                    this.view=document.querySelector("#scroll-into-view");
                  //  this.view.scrollIntoView()
                },1000);
               
               
            }
            key==2&&this.showProcess();
            this.setState({active:key})
        }}>
            <Tabs.TabPane  key="1" tab="数据同步">
                <Form onSubmit={(e)=>this.handleSubmit(e)}>
        
        
                    <FormItem {...layoutItem} label={"同步类型 "}>
                        {
                            getFieldDecorator("type")(<Checkbox.Group options={[{
                                label:"门店及设备数据",
                                value:"syncMerchantAndDevice"
                            },{
                               label:"手续费率" ,
                                value:"syncRate"
                            }]}/>
                             )
                        }
                    </FormItem>
        
                    <FormItem {...layoutItem} label={"支付通道 "}>
                        {
                            getFieldDecorator("paychannelId")(<ChannelSelect params={{status:1,pageSize:999}}/>)
                        }
                    </FormItem>
                    <FormItem {...layoutItem} label={"按最近分钟数 "}>
                        {
                            getFieldDecorator("syncMerchantConfigcycle")(<Input/>)
                        }
                    </FormItem>
        
                    <FormItem wrapperCol={{offset:4}}>
                        <Button loading={this.state.loading} htmlType={"submit"} type={"primary"}>同步</Button>
                       
        
                    </FormItem>
        
        
                  
    
                </Form>
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="进度查看">
                <div >
                    <div className="shop-data-sync-container">
                        <div dangerouslySetInnerHTML={{__html:this.state.logs}}></div>
                        <div id="scroll-into-view" style={{height:100,paddingTop:15}} ref="scrollIntoView">{this.state.process&&<span><Icon type="loading"/>数据同步中...</span>}</div>
                    </div>
                    
                    {
                        !this.state.process && <div className="text-success">数据同步完成</div>
                    }
    
                   
                </div>
            </Tabs.TabPane>
        </Tabs>
          
        )
    }
}

export default Form.create()(Component)




