/**
 *  created by yaojun on 2017/3/8
 *
 */


import React from "react";
import {Upload,Button,Icon,message} from 'antd';
import {BASE_URL} from "../../config/api"
import {ImageUpload} from "../ImageUpload";


export default class ImageUploadPreview extends ImageUpload{
    
    componentWillMount(){
        this.state.result=""
    }
    /**
     * @override
     */
    getContent(){
        return (
            <span>
                {
                    this.state.pending?<Icon type="loading"/>:this.state.result?<img src={this.state.result}/>:<Icon type="plus"/>
                }
            </span>)
    }
}
