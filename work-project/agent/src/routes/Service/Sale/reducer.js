/**
 *  created by yaojun on 2017/6/7
 *
 */

const ReducerContainer=require("reducer-container");
const immutable=require("immutable");
import {cleanEmpty} from "../../../util/helper";
import {Table} from "../../../components/Table";
import axios from "axios";
import {message} from "antd"
class Reducer extends ReducerContainer {
    
    store={
        visible:false
    }
    
    submit(form){
        form.validateFields((error,value)=>{
            if(error) return ;
            let url = value._id?`sales/${value._id}`:"sales";
            axios.post(url,cleanEmpty(value)).then(()=>{
                if(value._id){
                    Table.getTableInstance().update()
                }else{
                    Table.getTableInstance().reload()
                }
                this.update("visible",false)
                
                message.success("操作成功");
            });
        })
    }
    //TODO
    
}

export default new Reducer();