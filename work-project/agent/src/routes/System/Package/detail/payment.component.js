/**
 *  created by yaojun on 17/2/21
 *
 */
import React from "react";
import classNames from "classnames";
import {Card,Row,Col,Input,Radio,Icon} from "antd";

const RadioGroup =Radio.Group;
const PaymentItem = ({payment,index}) => {
    let rewards =payment.get("subsection");
    let path =['payments',index,'subsection'];
    let hide =payment.get("hideRewards") // 银行卡下所有通道都不分润时为true
  
    return (
        <div className="margin-top-lg" >
            {
                payment.get("channels").map((channel,i)=>{
                    return <ChannelItem name={payment.get("payModeName")} key={channel.get("payChannelId")} paymentIndex={index} index={i}  channel={channel}/>
                })
            }
            {/*银行卡奖励，只有银行卡才有,如果通道全部不分润，则关闭*/}
            <div className={classNames([{"bank-reward":isBank(payment)}])}>
            {
                (isBank(payment) && !hide)&& <RewardsContainer path={path} rewards={rewards}/>
            }
            </div>
        </div>)
}


const ChannelItem = ({channel,index,paymentIndex,name})=>{
    
  
    let rewards = channel.get("subsection");
   
    let path =['payments',paymentIndex,"channels",index,"subsection"];
    let bank = isBank(channel);
    let status = channel.get("status");
    let showBorder =(channel.get("payModeId")==1006||status!=1);
   
    return (
        <Card className={classNames(["margin-top-lg",{"card-body-none":showBorder}])} title={<div>
            <label  className="margin-right-lg pay-channel-name">{name} - {channel.get("payChannelName")}</label>
            
            {/*通道分润比例设置*/}
            <ProfitOfChannel channel={channel} status={status} isBank={bank} path={path.slice(0,-1)}/>
        
         
        </div>}>
            
            {/*通道奖励,只有通道开启了分润才有奖励*/}
            {
                channel.get("status")==1 &&<RewardsContainer path={path} rewards={rewards}/>
            }
        </Card>
      
    )
}

const RewardsContainer = ({rewards,path})=>{

    if(!rewards) return null;
    return  <div>
        {
            rewards.map((item,index)=>{
                return <RewardItem  key={item.get("id")} path={[...path,index]} item={item}/>
            })
        }
    </div>
}
const RewardItem = ({item,path})=>{
    return <div className="margin-v-lg">
        月累计金额（含）：<strong>{item.get("minSubsection")}</strong>
        {" "} - <strong>{item.get("maxSubsection")}  万元</strong><label className="margin-right"> </label> 奖励总交易金额的
        {" "}<strong> {item.get("ratio")}   %</strong>
       
    </div>
}


function isBank(item){
    
   
    return item.get("payModeId")==1006;
}


const ProfitOfChannel =({isBank,path,status,channel})=>{
    
    if(status!=1) return <span className="text-danger small">无分润</span>
    
 
    
    if(isBank){
        return <span className="small">
           借记： <strong>{channel.get("ratio")}  %</strong>
            {" "} 封顶： <strong>{channel.get("cap")}  元</strong>
            {" "}贷记：<strong>{channel.get("djkRatio")}  %</strong>
        </span>
    }
    return <span>
        <strong>{channel.get("ratio")}  %</strong>
    </span>
}



//  所有支付方式，及支付通道，下的奖励
export default({list}) => {
    
    if(list.size==0) return  null;
    console.log(list.toJS())
    return <div>
        {
            list.map((payment ,index)=> {
                return <PaymentItem key={payment.get("payModeId")} index={index}  payment={payment}/>
            }).toArray()
        }
    </div>
}

