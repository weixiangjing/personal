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
    store={
        step:0
    }
    changeStep(current){
        this.update("step",current);
    }
    //TODO
}
export default new Reducer();