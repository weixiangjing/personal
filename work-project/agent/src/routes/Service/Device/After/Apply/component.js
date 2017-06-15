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
export default class Component extends React.Component {
    render() {
        return (
            <div>
                <IconHeader icon="fa-wrench" title="申请售后服务" desc={`提交售后申请时，请将维修或退货的问题及原因描述清楚，为了帮助您更好的解决问题，请上传图片。最多可上传2张图片，每张图片大小不超过5M，
支持bmp,gif,jpg,png,jpeg格式文件`}/>
            </div>
        );
    }
    
}
