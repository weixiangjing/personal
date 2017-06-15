/**
 *  created by yaojun on 16/12/22
 *
 */


import {SortableContainer,SortableElement,arrayMove} from 'react-sortable-hoc';
import classNames from "classnames";
import React from "react";
const immutable =require("immutable");
const {handler} =require("./reducer");
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
            controls = arrayMove(controls,oldIndex,newIndex);
            handler.$update("printControls",immutable.fromJS(controls),"printInspector",immutable.fromJS(control).set('index',newIndex));
        
    }
    render(){
        
        return <SortList items={this.props.controls} onSortEnd={this.handleSort.bind(this)}/>
    }
}


const SortListItem = SortableElement(({item,onIndex})=>{
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
    let activeId= handler.$state("printInspector").get("id");
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
        case 1: return <img className="qr-code" src={qrcodeImg}/>;
        case 2: return <img className="bar-code" src={barcodeImg}/>;
        case 3: return <img className="bar-code" src={normalImg}/>;
        case 4: return <div style={{fontSize:12}}>----------------------------------------------------</div>
        default: return label
    }
}
const SortList = SortableContainer(({items})=>{
    return (<div >
        {
            items.map((item,index)=>{
                return (<SortListItem  onIndex={index} index={index} key={item.get("id")} item={item} />)
            })
        }
    </div>)
});



