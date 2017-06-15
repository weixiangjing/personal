/**
 *  created by yaojun on 2017/4/11
 *
 */

const ReducerContainer=require("reducer-container");
const immutable       =require("immutable");
import {Table} from "../../../../components/Table"
import axios from "axios"
class Reducer extends ReducerContainer {
    store={}
    toggleStatus(status,id){
        axios.post(`account/${id}/status`,{accountId:id,status})
            .then(()=>{Table.getTableInstance().update()})
    }
    //TODO
}
export default new Reducer();