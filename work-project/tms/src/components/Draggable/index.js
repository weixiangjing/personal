import React from "react";
import Icon16 from "../HomeIcon/Icon16";
import "./index.scss";
export default class Draggable extends React.Component {
    static propTypes={
        params: React.PropTypes.object.isRequired,
        label: React.PropTypes.string.isRequired
    }
    
    handleDrag(e) {
        this.props.params.classify=this.props.type;
        e.dataTransfer.setData('control', JSON.stringify(this.props.params))
    }
    
    render() {
        let type=this.props.params.type;
        let icon=this.props.icon;
        type=icon||type;
        return (
            <div onDragStart={this.handleDrag.bind(this)} className="common-draggable-item margin-right"
                 draggable={true}>
                <Icon16 className="base-drag-icon" type={type}/>
                <span className="text">{this.props.label}</span>
            
            </div>)
    }
}