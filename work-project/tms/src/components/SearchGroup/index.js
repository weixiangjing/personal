/**
 *  created by yaojun on 2017/4/12
 *
 */
import React from "react";
import "./index.scss";
import {Icon} from "antd";

class Accordion extends React.Component{

    toggleClass=['','accordion-up'];
    toggle(){
        let status= !this.state.status;
        this.setState({status});
        this.props.onExpand(status);
    }
    state={
        status:false
    }

    static propsTypes={
        onExpand:React.PropTypes.func.isRequired
    }
    render(){
        let {children} =this.props;

        return <div className="accordion-wrapper">
            {children}
            <span className={`fold-icon`} onClick={()=>this.toggle()}>
                <Icon className={`${this.toggleClass[Number(this.state.status)]}`} type="down" /> {this.state.status?"收起":"展开"}
            </span>

        </div>
    }
}

export class SearchGroupBordered extends React.Component {
    static Accordion =Accordion;
    static propTypes={
        group:React.PropTypes.array.isRequired
    }
    render() {
        let {group=[]}=this.props;
        return (
            <div className="search-group-bordered">
                {
                    group.map(item=> {
                        return <div key={item.title} className="row-item">
                            <label className="col-item">{item.title}:</label>
                            <div className="col-item">{item.content}</div>
                        </div>
                    })
                }
            </div>
        )
    }
}

