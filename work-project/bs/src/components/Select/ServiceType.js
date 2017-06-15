/**
 *  created by yaojun on 2017/3/9
 *
 */
import React from "react";
import {SelectBase, CascaderBase} from "./base";
import {getService, getProduct} from "../../model/ServiceProduct";
import axios from "axios";
// 服务类型
export class ServiceType extends SelectBase {
    getOptions() {
        return [{
            label: '基础服务', value: 1
        }, {
            label: "增值服务", value: 2
        }, {
            label: "通讯服务类", value: 3
        }]
    }
}
// 服务优先级
export class ServiceWeight extends SelectBase {
    getOptions() {
        return [{
            label: '最高', value: 1
        }, {
            label: '普通', value: 2
        }, {
            label: '最低', value: 3
        }]
    }
}
export class ServiceSelect extends SelectBase {
    getOptions() {
        getService({pageSize: 199, service_status: 1}).then(res=> {
            if(this.next) {
                this.next(res.data);
            } else {
                this.setState({
                    options: [{
                        label: "请选择",
                        value: ""
                    }].concat(res.data.filter(item=>item.service_status==1).map(item=> {
                        item.label=item.service_name;
                        item.value=item.service_code;
                        return item;
                    }))
                });
            }
        })
        return [{label: "全部", value: ""}];
    }
}
export class ServiceProduct extends CascaderBase {
    getOptions() {
        getProduct({product_status: 1, pageSize: 999}).then(({data})=> {
            let options={}
            data.forEach(item=> {
                if(!options[item.service_code]) {
                    let service=options[item.service_code]={}
                    service.label=item.service_name;
                    service.value=item.service_code;
                    service.children=[];
                }
                item.label=item.product_name;
                item.value=item.product_code;
                options[item.service_code].children.push(item);
            })
            options=Object.keys(options).map(item=> {
                return options[item];
            })
            this.setState({options});
        });
        return [];
    }
}
export class Production extends SelectBase {
    static instance=null;

    constructor() {
        super()
        Production.instance=this;
    }

    static findProduct(product_code) {
        let bg=this.instance.state.options.find(item=> {
            return item.value==product_code
        })
        return Promise.resolve(bg);
    }

    getOptions() {
        getProduct({pageSize: 299, product_status: 1}).then(({data})=> {
            this.setState({
                options: data.filter(item=>item.product_status==1).map(item=> {
                    item.label=item.product_name;
                    item.value=item.product_code;
                    return item;
                })
            })
        })
        return [];
    }
}

export class DeviceSelect extends SelectBase{
    
    static propTypes={
        token:React.PropTypes.string.isRequired
    }
    static cache=null;
    getOptions(){
        if(DeviceSelect.cache) return DeviceSelect.cache;
        let {token} =this.props;
        axios.post("openApi/serviceAccount/getMcodeOrEnNoByUserToken",{
            unit_type:3
        }).then(res=>{
            let options=res.data.map(item=>{
                item.label=`${item.en} (sn:${item.sn})`;
                item.value=item.en;
                return item;
            });
            DeviceSelect.cache=options;
           this.setState({options})
        });
        return []
    }
}

export class MCodeSelect extends SelectBase{
    static cache=null;

    getOptions(){
        if(MCodeSelect.cache) return MCodeSelect.cache;
        let {token} =this.props;
        axios.post("openApi/serviceAccount/getMcodeOrEnNoByUserToken",{
            unit_type:2
        }).then(res=>{
            
            let options =res.data.map(item=>{
                item.label=`[${item.mcode}] ${item.mname}`;
                item.value=item.mcode;
                return item;
            });
            MCodeSelect.cache=options;
            this.setState({ options})
        });
        return []
    }
}

