import axios from 'axios';
import {notification} from 'antd';
const Immutable = require('immutable');
export const SETPERMISSIONS_TREE = 'SYSTEM_SETPERMISSIONS_TREE';

export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    list:[],
    loading:true
  });
}
export const getList=()=>{
  /*const state = exports.initialState();
  const arr=[{res_name:'2222',res_type:'5555',res_url:'kkkk',status:1}];
  const newState = state.set('list',Immutable.fromJS(arr)).set('loading',false);

  handler.$update(newState)*/
  axios.get('/role/resource').then((res)=>{
    const state = exports.initialState();
    const newState = state.set('list',Immutable.fromJS(res.data)).set('loading',false);;
    handler.$update(newState)
  }).catch((err)=>{
    notification.error({
      message: '数据加载失败',
      description: err.message,
    })
  })
};
export const ResourceNew=(params)=>{
  const state = exports.state;
  let list=state.get('list');
  const newState = state.set('list',Immutable.fromJS(list.push(params)));
  handler.$update(newState)

  /*axios.post('url').then((res)=>{
    const state = exports.state;
    let list=state.get('list');
    const newState = state.set('list',Immutable.fromJS(list.push(params)));
    handler.$update(newState)
  }).catch((err)=>{
    notification.error({
      message: '数据加载失败',
      description: err.message,
    })
  })*/
}
export const EditResource=(text,index)=>{
  const state = exports.state;
  let list=state.get('list');
  const newState = state.set('list',Immutable.fromJS(list.setIn([index],text)));
  handler.$update(newState)

  /*axios.post('url').then((res)=>{
    const state = exports.state;
    let list=state.get('list');
    const newState = state.set('list',Immutable.fromJS(list.setIn([index],text)));
    handler.$update(newState)
  }).catch((err)=>{
    notification.error({
      message: '数据加载失败',
      description: err.message,
    })
  })*/
}
export const Swicth=(text,index)=>{
  console.log(text,index)
  text.status=text.status==1?2:1;
  const state = exports.state;
  let list=state.get('list');
  const newState = state.set('list',Immutable.fromJS(list.setIn([index],text)));
  handler.$update(newState)

  /*axios.post('url').then((res)=>{
    const state = exports.state;
    let list=state.get('list');
    const newState = state.set('list',Immutable.fromJS(list.setIn([index],text)));
    handler.$update(newState)
  }).catch((err)=>{
    notification.error({
      message: '数据加载失败',
      description: err.message,
    })
  })*/
}

/*module.exports = class {

  initialState(){
    return Immutable.fromJS({
      treedata:[]
    })
  }

  mapDispatchToProps = {
    getResourceList:(call)=>{
      return (dispatch) => {
        return axios.post('resource/ResourceList').then((res)=>{
          dispatch({
            type: SETPERMISSIONS_TREE,
            treedata: res.data
          })
          call(res.data)
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },
    ResourceNew:(data)=>{
      return (dispatch) => {
        return axios.post('resource/ResourceEditSave',data).then((res)=>{
          notification.success({
            message: '保存成功',
            description: res.info,
          })
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },
    DeleteResource:(data)=>{
      return (dispatch) => {
        return axios.post('resource/ResourceDelete',data).then((res)=>{
          notification.success({
            message: '删除成功',
            description: res.info,
          })
        }).catch((err)=>{
          notification.error({
            message: '该资源在使用中，不能删除',
            description: err.message,
          })
        });
      }
    },
  };

  handler = {
    [SETPERMISSIONS_TREE](state, action){return state.set('treedata',Immutable.List(action.treedata));},

  }
};*/
