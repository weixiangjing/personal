import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
      step:0,
      step1Data:'',
      step2Data:'',
      step3Data:'',
  });
}
export const nextStep=(params)=>{
  const step=exports.state.get('step');
  handler.$update(exports.state.set('step',step+1)
    .set(step==0?"step1Data":step==1?"step2Data":"step3Data",Immutable.fromJS(params))
  )
}
export const prevStep=()=>{
  const state=exports.state
  handler.$update(state.set('step',state.get('step')-1))
}
export const createUser=(params)=>{
  return axios.post('user/createUser',params)
}
export const resetState = ()=>{
  handler.$update(exports.initialState())
};
export const getStep1Data=()=>{
  const data=exports.state.get('step1Data')?exports.state.get('step1Data').toJS():exports.state.get('step1Data');
  return data;
}
export const getStep2Data=()=>{
  const data=exports.state.get('step2Data')?exports.state.get('step2Data').toJS():exports.state.get('step2Data');
  return data;
}
export const getStep3Data=()=>{
  const data=exports.state.get('step3Data')?exports.state.get('step3Data').toJS():exports.state.get('step3Data');
  return data;
}
export const getSysList=()=>{
  return axios.post('outerSys/getSys')
}
export const saveAcessCode=(params)=>{
  return axios.post('user/saveAcessCode',params)
}
