/**
 *  created by yaojun on 2017/6/6
 *
 */

import React from "react";

 class AMapPicker extends React.Component {
    id="map-picker-"+Date.now();
    static propTypes={
        onChange:React.PropTypes.func
    }
    componentWillReceiveProps(){
    
    }
    componentDidMount(){
        AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) =>{
            let map=new AMap.Map(this.id, {
                zoom: 16,
                scrollWheel: true
            })
            this.map=map;
            map.addControl( new AMap.ToolBar());
            map.addControl(new AMap.Scale());
            let infoWindow=new AMap.InfoWindow({
                content:"加载中...",  //使用默认信息窗体框样式，显示信息内容,
                offset:{
                    x:10,y:-10
                }
            })
            
           let picker= new PositionPicker({
                mode: 'dragMap',
                map: map
            });
           
            picker.on("success",(result)=>{
              let address= result.regeocode.addressComponent;
              console.log(result.position,result.position.toString())
              let desc="";
              if(address.street){
                  desc+=address.street;
              }
              if(address.streetNumber){
                  desc+=address.streetNumber
              }
                infoWindow.setContent(desc);
                infoWindow.open(map,result.position);
              this.props.onChange && this.props.onChange(desc,result);
            }).on("fail",(error)=>{
                console.log("无法获取地址信息")
            })
    
            
            console.log(infoWindow)
            
            infoWindow.open(map,map.getCenter());
            map.on("dragstart",()=>{
                infoWindow.close()
                picker.start();
            })
        })
       
    }
    
    
 
    render() {
        return (<div  style={{width:600,height:400,border:"1px solid #ececec"}} id={this.id}></div>)
    }
}

export default AMapPicker