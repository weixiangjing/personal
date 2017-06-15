/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import {Form, Radio} from "antd";
import IconHeader from "../../../../../components/IconHeader/index";
const RadioGroup=Radio.Group;
const RadioButton=Radio.Button;
const FormItem=Form.Item;
import axios from "axios";
export default class Component extends React.Component {
    componentWillMount(){
        axios.get("")
    }
    render() {
        return (
            <div>
                <IconHeader icon="fa-wrench" title="232323" desc={`设备维修中|申请时间2017-03-28 12：32：31`}/>
            </div>
        );
    }
    
}
