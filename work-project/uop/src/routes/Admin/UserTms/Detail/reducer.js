import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    user:[],
    loading:false
  });
}
export const userList=(params)=>{
  axios.post('user/getUsers',params).then((res)=>{
    handler.$update(exports.state.set('user',Immutable.List(res.data)).set('loading',true))
  }).catch((err)=>{
    notification.error({message: err.message})
  })
}
export const resetPassword=(id)=>{
  axios.post('user/resetPassword',{userId:id}).then(()=>{
    notification.success({message: '修改成功'})
  }).catch((err)=>{
    notification.error({message: '修改失败',description: err.message})
  })
}
export const deleteSys=(id,userid)=>{
  return axios.post('outerSys/removeSys',{sys_id:id,userId:userid}).then(()=>{
    notification.success({message: '删除成功'})
  }).catch((err)=>{
    notification.error({message: '删除失败',description: err.message})
  });
}
export const deleteUser=(params)=>{
  return axios.post('user/updateUser',params);
}
export const resetState = ()=>{
  handler.$update(exports.initialState())
};
