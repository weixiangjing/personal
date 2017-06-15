/**
 *  created by yaojun on 16/12/22
 *
 */
  


    

import React from "react";
import className from "classnames";

import SortableControl from "./sortable";
const  {toggleEnterClass,
           pushControlToDisplay}= require( "../reducer");
export default class DropContainer extends React.Component{
    
    findIndex(ele){
        if(ele.id && ele.id.indexOf("drop-control-item")>-1){
            return Number(ele.id.replace("drop-control-item-",""));
        }else {
            return ele.parentNode?this.findIndex(ele.parentNode):-1;
        }
    }
    handleDrop(e){
        let transferData=e.dataTransfer.getData('control')
        let data =JSON.parse(transferData);
            data.id=Math.random();
            data.active=true;
        let dropElement = e.target;
        let className= dropElement.className;
        
          if(className==="controls-display"){//root
              pushControlToDisplay(data);
          }else{
             let insertIndex= this.findIndex(dropElement);
              pushControlToDisplay(data,insertIndex);
          }
    }
    render(){
        let controls =this.props.controls;
        return (<div onDrop={this.handleDrop.bind(this)}
                     onDragEnter={()=>{toggleEnterClass(true)}}
                     onDragLeave={()=>{toggleEnterClass(false)}}
                     onDragOver={(e)=>e.preventDefault()}
                     className={className(["controls-display",{'drag-enter':this.props.isEnter}])}>
          
           
            <SortableControl controls={controls}/>
        </div>)
    }
}
