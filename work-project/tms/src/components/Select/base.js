/**
 *  created by yaojun on 2017/3/9
 *
 */
import React from "react";
import {Select, Cascader} from "antd";
import axios from "axios";
export class SelectBase extends React.Component {
    
    static  propTypes = {
        inForm: React.PropTypes.bool, // 默认在表单中使用，单独使用时 为false,
        labelKey:React.PropTypes.string,//
        valueKey:React.PropTypes.string,
        url:React.PropTypes.string,
        filter:React.PropTypes.func
    }
            state     = {
                options: this.getOptions()
            }
    
    /**
     * @abstract
     * @returns {Array}
     */
    getOptions() {
        return [];
    }
    componentWillMount(){
        if(this.props.url){
            this.fetchOptions(this.props.url,this.props.params);
        }
    }
    handleChange(e) {
        this.props.onChange && this.props.onChange(e,this.state.options.find((item=>e==item.value)));
    }
    fetchOptions(url,params={}){
        axios.post(url,params)
            .then(({data})=>data.map(item=>({label:item[this.props.labelKey],value:item[this.props.valueKey]})))
            .then(options=>this.setState({options}));
    }
  
    
    render() {
        let {onChange, value, inForm = true,disable=false,autoWidth=false} = this.props;
        let options                  = this.state.options;
        let valueProps               = {};
        if (inForm) {
            valueProps.value = value === undefined ? '' : value + '';
        } else {
            valueProps.defaultValue = value === undefined ? '' : value + '';
        }
       
       
        
        let styleObj ={};
        if(autoWidth){
            styleObj.display="block";
        }else{
            styleObj.width=200;
        }
        styleObj.verticalAlign="middle";
        return (
            <Select showSearch
                    disabled={disable}
                    size={"large"}
                    filterOption={this.props.filter||((input, opt) =>( opt.props.children.indexOf(input) > -1))}
                    style={styleObj} {...valueProps}
                    notFoundContent={''}
                    onChange={(e) => this.handleChange(e)}>
                {
                    options.map(item => {
                        if (typeof item === "object") {
                            return <Select.Option value={String(item.value)}
                                                  key={item.value}>{item.label}</Select.Option>
                        }
                        return (<Select.Option value={item} key={item}>{item}</Select.Option>);
                    })
                }
            
            </Select>
        )
    }
}
export class CascaderBase extends SelectBase {
    
    loadData() {
    }
    render() {
        let { value, inForm = true} = this.props;
        let valueProps               = {};
        if (inForm) {
            valueProps.value = value === undefined ? [] : value ;
        } else {
            valueProps.defaultValue = value === undefined ? [] : value ;
        }
        return (
            <Cascader
                size="large"
                changeOnSelect
                placeholder=""
                showSearch
                notFoundContent=""
                onChange={(e)=>this.handleChange(e)}
                loadData={(data) => this.loadData(data)}
                options={this.state.options}
                style={{minWidth: 200, verticalAlign: "middle"}}
                {...valueProps}
              >
            </Cascader>
        )
    }
}
