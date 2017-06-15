/**
 *  created by yaojun on 16/11/15
 *
 */


import React from "react";
import {message} from "antd";
export default class ReactMap  extends React.Component{




  

    static propTypes={
        latitude:React.PropTypes.string.isRequired,
        longitude:React.PropTypes.string.isRequired
    }
  
    componentWillMount(){
        this.mapId=(Math.random()+"").slice(2);
    }

    componentDidMount(){
        let {latitude,longitude} = this.props;
        let center =[latitude,longitude];
        let opts ={
            resizeEnable:true,
    
            zoom:13
        }
        if(latitude && longitude){
            opts.center=center;
        }else{
            opts.center=[116.405467, 39.907761]
        }
        let map = new AMap.Map(this.mapId,opts);
    
    
        new AMap.Marker({
            map: map,
            position: opts.center
        });

    }

    render(){

        return (<div style={this.props.style} id={this.mapId}>

        </div>)
    }
}



    

