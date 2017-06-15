/**
 *  created by yaojun on 2017/5/25
 *
 */

import React from "react";
import ReactDOM from "react-dom"
import {Input} from "antd";
import './lib/codemirror.css';
const CodeMirror =require("./lib/codemirror");
require("./addon/edit/closetag.js");
require("./addon/fold/xml-fold.js");
require("./mode/xml/xml.js");
require("./mode/javascript/javascript.js");
require("./mode/css/css.js");
require("./mode/htmlmixed/htmlmixed.js");

export default class CodeMirrorComponent extends React.Component {
    componentDidMount(){
     let node=   ReactDOM.findDOMNode(this.refs.code);
     this.editor=   CodeMirror.fromTextArea(node,{
            mode:"text/html",
            autoCloseTags: true,
            lineNumbers: true,
        });
     this.editor.on("update",(self)=>{
         this.props.onChange(self.getValue());
     })
    }
 
    componentWillUnmount(){
        this.editor=null;
    }

    render() {
        
        return (
            <div>
                <Input style={{height:700}} value={this.props.value}  ref="code" type="textarea"/>
            </div>)
    }
}