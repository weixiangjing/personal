import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    step:0,
    stepData:[],
    step2Data:[]
  });
}
export const nextStep=(data)=>{
  const state=exports.state
  const step=state.get('step');
  handler.$update(state.set('step',step+1)
    .set(step==0?"stepData":"step2Data",Immutable.List(data)))

}
export const prevStep=()=>{
  const state=exports.state
  handler.$update(state.set('step',state.get('step')-1))
}
export const getStepData=()=>{
  const data=exports.state.get('stepData').toJS();
  return data;
}
export const getSysList=()=>{
  return axios.post('outerSys/getSys')
}
export const getSysBinding=(params)=>{
  return axios.post('outerSys/getAccountBindingSys',params)
}
export const resetState = ()=>{
  handler.$update(exports.initialState())
};
export const saveAcessCode=(params)=>{
  return axios.post('user/saveAcessCode',params)
}
export const getStep2Data=()=>{
  const data=exports.state.get('step2Data').toJS();
  return data;
}
