/**
 *  created by yaojun on 2017/4/11
 *
 */

const ReducerContainer=require("reducer-container");
const immutable       =require("immutable");
import {Table} from "../../../../components/Table"
import {message} from "antd"
import axios from 'axios';
class Reducer extends ReducerContainer {
    store={}
    deleteMerchant(id){
        axios.delete(`merchant/${id}`).then(()=>{
            Table.getTableInstance().update();
            message.success("删除成功")
        });
    }
    resetPassWord(){
        axios.post(`merchant/`)
    }
    //TODO
}
export default new Reducer();