/**
 *  created by yaojun on 17/2/21
 *
 */
import React from "react";
import classNames from "classnames";
import {Card, Input, Radio, Icon} from "antd";
import {addReward, subReward, updateControl} from "./reducer";
const RadioGroup  = Radio.Group;
const PaymentItem = ({payment, index, isShop}) => {
    let rewards = payment.get("subsection");
    let path    = ['payments', index, 'subsection']
    return (
        <div className="margin-top-lg">
            {
                isBank(payment) && (<div>{payment.get("payModeName")} {
                    (isBank(payment) && !isShop) &&
                    <a className="margin-left-lg" onClick={() => addReward(path)}>添加奖励</a>
                }</div>)
            }
            
            {
                payment.get("channels").map((channel, i) => {
                    return <ChannelItem isShop={isShop} key={channel.get("payChannelId")} paymentIndex={index} index={i}
                                        channel={channel}/>
                })
            }
            {/*银行卡奖励，只有银行卡才有,如果通道全部不分润，则关闭*/}
            {
                (isBank(payment) && payment.get("status") == 1) &&
                <RewardsContainer isShop={isShop} path={path} rewards={rewards}/>
            }
        </div>)
}
const ChannelItem = ({channel, index, paymentIndex, isShop}) => {
    let rewards    = channel.get("subsection");
    let path       = ['payments', paymentIndex, "channels", index, "subsection"];
    let bank       = isBank(channel);
    let status     = channel.get("status");
    let showBorder = ((bank || status != 1) );
    showBorder     = isShop || showBorder;
    return (
        <Card className={classNames(["margin-top-lg", {"card-body-none": showBorder}])} title={<div>
            <label className="margin-right-lg pay-channel-name">{channel.get("payChannelName")}</label>
            
            {/*通道分润比例设置*/}
            <ProfitOfChannel channel={channel} status={status} isBank={bank} path={path.slice(0, -1)}/>
            
            <span span={6}>
        
               
                <RadioGroup
                    onChange={({target}) => updateControl(["payments", paymentIndex, "channels", index, "status"], target.value, true)}
                    value={channel.get("status") + ""} className="margin-left ">
                    <Radio value={"1"}>分润</Radio>
                    <Radio value={"0"}>不分润</Radio>
                </RadioGroup>
                {
                    (!bank && status == 1 && !isShop) &&
                    <a onClick={() => addReward(path)} style={{fontSize: 12}}>添加奖励</a>
                }
               
    
            </span>
        </div>}>
            
            {/*通道奖励,只有通道开启了分润才有奖励*/}
            <RewardsContainer status={status} isShop={isShop} path={path} rewards={rewards}/>
        
        </Card>
    
    )
}
const RewardsContainer = ({rewards, path, isShop, status}) => {
    if (!rewards || isShop || status != 1) return null;
    return <div>
        {
            rewards.map((item, index) => {
                return <RewardItem key={item.get("id")} path={[...path, index]} item={item}/>
            })
        }
    </div>
}
const RewardItem       = ({item, path}) => {
    return <div className="margin-v-lg">
        月累计金额（含）：<Input onChange={({target}) => updateControl([...path, 'minSubsection'], target.value)}
                        value={item.get("minSubsection")} className={"small-control"}/>
        {" "} - <Input onChange={({target}) => updateControl([...path, "maxSubsection"], target.value)}
                       value={item.get("maxSubsection")} className={"small-control"}/> 万元<label
        className="margin-right"> </label> 奖励总交易金额的
        {" "}<Input onChange={({target}) => updateControl([...path, "ratio"], target.value)} value={item.get("ratio")}
                    className={"small-control"}/> %
        <Icon onClick={() => subReward(path)} type="close-circle-o" className="text-danger margin-left-lg"/>
    </div>
}
function isBank(item) {
    return item.get("payModeId") == 1006;
}
const ProfitOfChannel = ({isBank, path, status, channel}) => {
    if (status == 0) return null;
    console.log(path)
    function update(key, e) {
        let _path = path.slice();
        _path.push(key);
        updateControl(_path, e.target.value);
    }
    
    if (isBank) {
        return <span className="small">
           借记： <Input onChange={(e) => update("ratio", e)} value={channel.get("ratio")} className={"small-control"}
                      placeholder="分润比例 "/> %
            {" "}封顶： <Input onChange={(e) => update("cap", e)} value={channel.get("cap")} className={"small-control"}/> 元
            {" "}贷记： <Input onChange={(e) => update("djkRatio", e)} value={channel.get("djkRatio")}
                            className={"small-control"} placeholder="分润比例 %"/> %
        </span>
    }
    return <span>
        <Input onChange={(e) => update("ratio", e)} value={channel.get("ratio")} className={"small-control"}
               placeholder="分润比例 %"/>
    </span>
}
//  所有支付方式，及支付通道，下的奖励
export default({list, isShop, isEmpty}) => {
    if (list.size == 0) return null;
    if (isEmpty && isShop) return null;
    return <div>
        {
            list.map((payment, index) => {
                return <PaymentItem isShop={isShop} key={payment.get("payModeId")} index={index} payment={payment}/>
            }).toArray()
        }
    </div>
}

