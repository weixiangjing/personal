/**
 *  created by yaojun on 17/1/23
 *
 */
  


    
import ajax from "axios";
import {cleanEmpty} from "../../../util/helper"

export default  function fetch(context,value,listOnly=false){
    
    if(listOnly===false){
        ajax.post("trade/queryCountEx", cleanEmpty(value)).then(res => context.setState({stat: res.data[0]}));
    }
    ajax.post("trade/queryListEx", cleanEmpty(value)).then(res => context.setState({
        list    : res,
        spinning: false
    }));
    
}