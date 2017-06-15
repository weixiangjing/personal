/**
 *  created by yaojun on 16/12/22
 *
 */


import {SortableContainer,SortableElement,arrayMove} from 'react-sortable-hoc';
import classNames from "classnames";
import React from "react";
const immutable =require("immutable");
const qrcodeImg=require("./assets/qrcode.png");
const barcodeImg=require("./assets/barcode.png");
const normalImg=require("./assets/image.png");
const gravityClass=['text-left','text-center','text-right'];
const sizeStyle =[12,14,18]
const styleClass=['font-normal',"font-bold","font-italic"]


export default class SortContainer  extends React.Component{
    handleSort({oldIndex,newIndex}){
       
        
        let controls =this.props.controls.toJS();
        let control = controls[oldIndex];
        
            if(oldIndex !== newIndex){
                controls = arrayMove(controls,oldIndex,newIndex);
            }
            
            this.props.onSortEnd(controls,control,newIndex,oldIndex)
           
        
    }
    render(){
        return <SortList inspector={this.props.printInspector} items={this.props.controls} onSortEnd={this.handleSort.bind(this)}/>
    }
}


const SortListItem = SortableElement(({item,onIndex,inspector})=>{
    let props = item.get("props").toJS();
    let isSpaceAround=props.toside==1||props.toside===true||props.toside==="true";
    let label = props.label;
   
    // to side
    if(isSpaceAround){
       label= label.split("{separator}").map((item,index)=><span className={"pull-"+(index==0?"left":"right")}>{item}</span>)
    }
    let leftLength = props.leftlength;
  
    if(leftLength!== void 0 && typeof label==="string"){
        leftLength=+leftLength;
        let cols =label.split("{separator}");
            label=cols.map((item,index)=><span style={{lineHeight:`${sizeStyle[props.size]}px`,height:sizeStyle[props.size],display:"inline-block",overflow:"hidden",width:(index===0)?leftLength*8:'auto'}}>{item.slice(0,leftLength)}</span>)
            
    }
    
    label =  getContentByType(props.type,label);
    
    if(typeof label ==="string"){
        label =getNextLineContent(label);
    }
    let activeId= inspector.get("id");
    let currentId = item.get("id");
    
    return (
       <div id={`drop-control-item-${onIndex}`}
           style={{fontSize:sizeStyle[props.size]}}
           className={
               classNames(["channel-print-drop-item over-hide",
                   gravityClass[props.gravity],
                   {"drop-active-control-item":activeId==currentId},
                    styleClass[props.style]])}>{label}
                   </div>
    )
});

function getContentByType(type,label) {
    switch(+type){
        case 0: return label;
        case 1: return <img height={72} className="qr-code" src={qrcodeImg}/>;
        case 2: return <img height={72} className="bar-code" src={barcodeImg}/>;
        case 3: return <img height={72} className="bar-code" src={label||normalImg}/>;
        case 4: return <div style={{fontSize:12}}>----------------------------------------------------</div>
        default: return label
    }
}
const SortList = SortableContainer(({items,inspector})=>{
    
    return (<div >
        {
            items.map((item,index)=>{
                return (<SortListItem inspector={inspector}  onIndex={index} index={index} key={item.get("id")} item={item} />)
            })
        }
    </div>)
});





function getNextLineContent(label){
   let list= label.split("{nextline}");
   let array=[]
   for(let i=0,j=list.length;i<j;i++){
       let item =list[i];
       if(item){
           array.push(item);
       }
       if(i!==j-1){
           array.push(<div style={{height:14}}></div>)
       }
   }
   return array;
    
}