import axios from 'axios';
import {notification} from 'antd';
const Immutable = require('immutable');
export const SETPERMISSIONS_TREE = 'SYSTEM_SETPERMISSIONS_TREE';
module.exports = class {

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
          if(res.data.length==0){call([{description:'', icon_url:'',
            parent_id:-1, id:111, res_name:'无数据,需手动添加',
            res_type: "Menu", res_url:'', sort_num:0,
            status:1, res_childs:[]}])
          }else {
            call(res.data)
          };
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
};
