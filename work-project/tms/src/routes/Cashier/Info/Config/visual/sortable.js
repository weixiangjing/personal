/**
 *  created by yaojun on 16/12/22
 *
 */


import {SortableContainer,SortableElement,arrayMove} from 'react-sortable-hoc';
import {setInspectorWithActiveControl} from "../reducer";
import {SortableControl} from "./drop.control";
import React from "react";
const {resetControls}  = require("../reducer");

export default class SortContainer  extends React.Component{
    handleSort({oldIndex,newIndex}){
        let control =this.props.controls.get(oldIndex);
        setInspectorWithActiveControl(control.set("index",oldIndex),newIndex);
        resetControls(
            arrayMove(this.props.controls.toJS(),oldIndex,newIndex)
        )
    }
    render(){
        
        return <SortList items={this.props.controls} onSortEnd={this.handleSort.bind(this)}/>
    }
}


const SortListItem = SortableElement(({item,onIndex})=>{
   
    return (
        <SortableControl  item={item} onIndex={onIndex}/>
   )
});
const SortList = SortableContainer(({items})=>{
    
    return (<ul >
        {
            items.map((item,index)=>{
                return (<SortListItem  onIndex={index} index={index} key={item.get("id")} item={item} />)
            })
        }
    
    </ul>)
});

