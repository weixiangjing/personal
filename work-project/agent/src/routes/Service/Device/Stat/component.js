/**
 *  created by yaojun on 2017/4/11
 *
 */
import React from "react";
import reducer from "./reducer";
export default class Component extends React.Component {
    render() {
        let state = reducer.getState();
        let count=state.get("count");
        return (<div>{count}
        <button onClick={()=>reducer.update("count",count+1)}>increment</button>
        </div>)
    }
}