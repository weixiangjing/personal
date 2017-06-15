/**
 *  created by yaojun on 16/12/19
 *
 */
import React from 'react';
import RuleForm from "./ruleForm";
import ajax from 'axios';
import "./rule.scss";
module.exports = React.createClass({
        render(){
            return (
                <RuleForm {...this.props} state={this.storeState}/>
            )
        }
    }
);
    

