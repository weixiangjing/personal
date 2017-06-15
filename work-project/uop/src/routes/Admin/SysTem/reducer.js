import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({

  });
}
export const addSys=(params)=>{
  return axios.post('outerSys/addSys',params)
}
export const updateSys=(params)=>{
  return axios.post('outerSys/updateSys',params)
}
export const deleteSys=(params)=>{
  return axios.post('outerSys/deleteSys',params)
}
