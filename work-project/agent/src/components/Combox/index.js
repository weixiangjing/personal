/**
 *  created by yaojun on 2017/4/12
 *
 */
import React from "react";
import "./index.scss"
export default class Component extends React.Component {
    render() {

        let {selects,input} =this.props;
        return (<div className="combox-select-input">
            {selects}
            {input}
        </div>)
    }
}