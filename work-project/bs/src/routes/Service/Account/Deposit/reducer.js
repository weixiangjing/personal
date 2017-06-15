import axios from 'axios';
import {notification} from 'antd';
import moment from "moment";

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    suggestions:[],
  });
}
export const getSuggestions=(params)=>{
  handler.$update(exports.initialState().set('suggestions',Immutable.List(params)))

}
