"use strict";
import React from 'react';
import {Form,Spin,Radio,Checkbox,Button,Switch,Select,Modal} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const reducer = require('../reducer');
const formItemLayout = {labelCol: {span: 6},wrapperCol: {span: 18}};
import DynamicForm from '../../../../../components/DynamicForm';

const SettingForm = Form.create()(React.createClass({
    getConfigField(type){
        const {getFieldDecorator} = this.props.form;
        switch (type){
            case 'cashier':
                return <FormItem {...formItemLayout} label="通道收银功能">
                    {getFieldDecorator('isOpen', {
                        initialValue:true,
                        valuePropName:'checked'
                    })(
                        <Switch checkedChildren='开' unCheckedChildren='关'/>
                    )}
                </FormItem>;
            case 'operator':
                return <FormItem {...formItemLayout} label="通道运营类型">
                    {getFieldDecorator('operation_mode', {
                        initialValue:'1'
                    })(
                        <RadioGroup>
                            <Radio value='1'>自营</Radio>
                            <Radio value='2'>自有</Radio>
                        </RadioGroup>
                    )}
                </FormItem>;
            case 'rate':
                let rate = this.props.rate||[];
                return <FormItem {...formItemLayout} label="交易手续费率">
                    {getFieldDecorator('rate_id', {
                    })(
                        <Select placeholder='请选择' notFoundContent="没有配置费率" showSearch
                                filterOption={(input, option)=>option.props.children.indexOf(input)>=0}>
                            {rate.map(item=>{
                                let id = String(item.rate_id);
                                return <Option key={id} value={id}>{item.rate_name}</Option>
                            })}
                        </Select>
                    )}
                    <div className="desc text-muted">商户签约支付通道的手续费率，银行卡方式下须分借贷记</div>
                </FormItem>;
            case 'biz':
                return <FormItem {...formItemLayout} label="业务能力设置">
                    {getFieldDecorator('biz', {
                    })(
                        <BizSetting/>
                    )}
                </FormItem>;
            default :return null;
        }
    },
    render(){
        return (<Form className="form">
            {this.props.configItems.map(item=>{
                return <span key={item}>{this.getConfigField(item)}</span>;
            })}
        </Form>)
    }
}));
const BizSetting  = React.createClass({
    getInitialState(){
        return {biz:[],bizOptions:[],pending:false,error:null}
    },
    componentDidMount(){
        this.setState({pending:true});
        reducer.getBzAblity().then(res=>{
            let biz = res.data,
                options = [];
            biz.map(item=>{
                options.push({label:item.attr_name,value:item.bz_ability_id})
            });
            this.setState({biz:biz,bizOptions:options});
        },err=>{
            this.setState({error:err.message});
        }).finally(()=>{
            this.setState({pending:false});
        })
    },
    render(){
        return <Spin spinning={this.state.pending}>
            <CheckboxGroup options={this.state.bizOptions} value={this.props.value} onChange={this.props.onChange}/>
        </Spin>
    }
});

export default React.createClass({
    getInitialState(){
        return {configItems:reducer.getFormData(0).configItems || [],
            busy:false,channel:null,rate:null}
    },
    componentDidMount(){
        this.setState({busy:true});
        Promise.all([
            reducer.getChannel(),
            reducer.getPayRate()
        ]).then(res=>{
            let channel = res[0];
            let rate = res[1].data;
            this.setState({channel,rate});
        },err=>{
            Modal.error({
                title:'数据加载错误',
                content:err.message
            })
        }).finally(()=>{
            this.setState({busy:false});
        });
    },
    prev(){
        reducer.storeFormData(null);
        reducer.preStep();
    },
    next(){
        chainedValidate(this.refs.settingForm,this.refs.paramForm).then(values=>{
            reducer.storeFormData({settings:values[0],params:values[1]});
            reducer.nextStep();
        });

        function chainedValidate() {
            let chain = Array.prototype.slice.call(arguments);
            chain = chain.filter(item=>{
                return item;
            });
            let index = 0,
                size = chain.length,
                formValues = [];
            return new Promise((resolve,reject)=>{
                recursion();
                function recursion() {
                    if(index<size){
                        let form = chain[index];
                        form.validateFields((err,values)=>{
                            if(err)return reject(err);
                            formValues.push(values);
                            index++;
                            recursion();
                        })
                    }else {
                        resolve(formValues)
                    }
                }
            })
        }
    },
    render(){
        let paramForm = null;
        if(this.state.channel && this.state.configItems.indexOf('params') != -1){
            paramForm = <DynamicForm ref="paramForm" {...formItemLayout} items={this.state.channel.pay_channel_store_params}/>;
        }
        return (<Spin spinning={this.state.busy}>
            <div className="step step3">
                <SettingForm configItems={this.state.configItems} ref="settingForm" rate={this.state.rate}/>
                <hr/>
                <div className="form gutter-v">
                    {paramForm}
                </div>
                <div className="footer text-center">
                    <Button onClick={this.prev} type='primary'>上一步</Button>
                    <Button onClick={this.next} type='primary'>下一步</Button>
                </div>
            </div>
        </Spin>)
    }
})