import React from "react";
import immutable from "immutable";
import {Row, Col, Input, Select, Icon} from "antd";
import {OuterTypes, TransTypes} from "./conf";
import "./index.scss";
export class ProfitPackage extends React.Component {
    defaultValue(type=this.props.type) {
        let value={
            rate: "", begin_amount: "", max_amount: "", id: Math.random()
        }

        if(type=="3") {
            value.card_brand      ="VISA";
            value.card_type       ="1";
            value.rate_change_type="EDC";
        } else if(type=="2"||type=="1") {
            value.card_type="1";
        }
        return immutable.fromJS([value])
    }

    state           ={
        value: this.defaultValue()
    }
    static propTypes={
        type: React.PropTypes.string.isRequired// 1=银联境内卡，2=银联国际UPI卡，3=外卡，4=非银行卡。
    }
    componentDidMount(){
        this.props.onChange(this.state.value.toJS());
    }

    /**
     * @param e input value
     * @param name  the pathkey of the state
     * @param index index of array
     */
    set(e, name, index) {
        let targetValue=e.target ? e.target.value : e;
        if(name === "rate" && (targetValue>=100|| targetValue<0)){
            this.props.form.setFields({
                rate_service:{
                    value:this.state.value.toJS(),
                    errors:[new Error("费率值输入范围为0~100")]
                }

            })
            return ;
        }
        let value      =this.state.value.updateIn([index, name], ()=>targetValue);
        this.setState({value});
        this.superChange(value);
    }

    superChange(value) {
        value=value.toJS();
        this.props.onChange(value);
    }

    add(isBank) {
        let value=this.state.value;
        value    =value.push(this.defaultValue().get(0));
        this.setState({value})
        this.superChange(value);
    }

    deleteBy(index) {
        let value=this.state.value.delete(index)
        this.setState({value});
        this.props.onChange(value.toJS());
    }

    componentWillReceiveProps(props) {



        if(props.value&&props.value.length>0) {


            this.setState({value: immutable.fromJS(props.value)});

        } else {
            this.setState({value: this.defaultValue(props.type)});
        }

    }

    render() {
        let {type}           = this.props;
        let value            =this.state.value;
        let normal           =value.get(0);
        return (
            <div className="package-form-group">
                {
                    type=="4"&&<Row gutter={12}>
                        <Col span={4}/>
                        <Col span={4}>费率（%）</Col>
                        <Col span={4}>手续费封顶（元）</Col>
                        <Col span={12}>起扣金额（元）</Col>
                        <Col className={"text-right"} span={4}><font className="text-danger">*</font>商户签约:</Col>
                        <Col span={4}>
                            <Input max={100} value={normal.get("rate")} type="number" onChange={(e)=>this.set(e, "rate", 0)}/>

                        </Col>
                        <Col span={4}> <Input value={normal.get("max_amount")} type="number"
                                              onChange={(e)=>this.set(e, "max_amount", 0)}/></Col>
                        <Col span={4}> <Input value={normal.get("begin_amount")} type="number"
                                              onChange={(e)=>this.set(e, "begin_amount", 0)}/></Col>
                    </Row>
                }
                {
                    type=="3"&&<div className={"profit-package-bordered"}>
                        <Row >
                            {/* Header */}

                            <Col span={4}>卡品牌</Col>
                            <Col span={3}>汇率转换</Col>
                            <Col span={3}>卡种</Col>
                            <Col span={3}>费率（%）</Col>
                            <Col span={4}>手续费封顶（元）</Col>
                            <Col span={4}>起扣金额（元）</Col>
                        </Row>
                        {/* Body */}


                        {
                            value.map((item, index)=> {
                                return (
                                    <Row key={item.get("id")} gutter={12}
                                         span={4}>
                                        <Col span={4}>
                                            <Select onChange={(e)=>this.set(e, 'card_brand', index)}
                                                    value={item.get("card_brand")}>
                                                {
                                                    OuterTypes.map(item=><Select.Option key={item}
                                                                                        value={item}>{item}</Select.Option>)
                                                }
                                            </Select>
                                        </Col>
                                        <Col span={3}>
                                            <Select onChange={(e)=>this.set(e, 'rate_change_type', index)}
                                                    value={item.get("rate_change_type")}>
                                                {
                                                    TransTypes.map(item=><Select.Option key={item}
                                                                                        value={item}>{item}</Select.Option>)
                                                }
                                            </Select>
                                        </Col>
                                        <Col span={3}>
                                            <Select onChange={(e)=>this.set(e, 'card_type', index)}
                                                    value={String(item.get("card_type"))}>
                                                <Select.Option key={"1"} value={"1"}>借记卡</Select.Option>
                                                <Select.Option key={"2"} value={"2"}>贷记卡</Select.Option>
                                            </Select>
                                        </Col>
                                        <Col span={3}>
                                            <Input value={item.get("rate")} type="number"
                                                   onChange={(e)=>this.set(e, "rate", index)}/>

                                        </Col>
                                        <Col span={4}> <Input value={item.get("max_amount")} type="number"
                                                              onChange={(e)=>this.set(e, "max_amount", index)}/></Col>
                                        <Col span={4}> <Input value={item.get("begin_amount")} type="number"
                                                              onChange={(e)=>this.set(e, "begin_amount", index)}/></Col>
                                        <Col span={3}>
                                            {
                                                value.size>1&&
                                                <Icon onClick={()=>this.deleteBy(index)} type="minus-circle-o"
                                                      className="font-lg text-shade margin-right"/>
                                            }

                                            {
                                                index===value.size-1&&
                                                <Icon onClick={()=>this.add(true)} type="plus-circle-o"
                                                      className="font-lg text-shade "/>
                                            }

                                        </Col>

                                    </Row>
                                )
                            }).toArray()

                        }


                    </div>
                }

                {
                    (type=="2"||type=="1")&&<div className={"profit-package-bordered"}>
                        <Row >
                            {/* Header */}


                            <Col span={5}>卡种</Col>
                            <Col span={5}>费率（%）</Col>
                            <Col span={5}>手续费封顶（元）</Col>
                            <Col span={5}>起扣金额（元）</Col>
                        </Row>
                        {/* Body */}


                        {
                            value.map((item, index)=> {
                                return (
                                    <Row key={item.get("id")} gutter={12} span={4}>
                                        <Col span={5}>
                                            <Select onChange={(e)=>this.set(e, 'card_type', index)}
                                                    value={String(item.get("card_type"))}>
                                                <Select.Option key={"1"} value={"1"}>借记卡</Select.Option>
                                                <Select.Option key={"2"} value={"2"}>贷记卡</Select.Option>
                                            </Select>
                                        </Col>
                                        <Col span={5}>
                                            <Input value={item.get("rate")} type="number"
                                                   onChange={(e)=>this.set(e, "rate", index)}/>
                                        </Col>
                                        <Col span={5}> <Input min={0} value={item.get("max_amount")} type="number"
                                                              onChange={(e)=>this.set(e, "max_amount", index)}/></Col>
                                        <Col span={5}> <Input min={0} value={item.get("begin_amount")} type="number"
                                                              onChange={(e)=>this.set(e, "begin_amount", index)}/></Col>


                                        <Col span={3}>
                                            {
                                                value.size>1&&
                                                <Icon onClick={()=>this.deleteBy(index, true)} type="minus-circle-o"
                                                      className="font-lg text-shade margin-right "/>
                                            }

                                            {
                                                index===value.size-1&&
                                                <Icon onClick={()=>this.add(true)} type="plus-circle-o"
                                                      className="font-lg text-shade "/>
                                            }
                                        </Col>

                                    </Row>
                                )
                            }).toArray()

                        }


                    </div>
                }
            </div>
        )
    }
}