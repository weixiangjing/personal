import React from 'react'
import ReactDOM from 'react-dom'
import {message,notification} from "antd";
import {hashHistory} from "react-router";
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import axios from 'axios';
import moment from "moment";
import user from './model/User';
import {BASE_URL} from "./config/api";
import { showLoading, hideLoading } from 'react-redux-loading-bar';

moment.locale('zh-cn');
import {__initStore__} from "./store/storeUtil";
moment.ago=function (day=1) {
    let date =new Date;
        date.setDate(date.getDate()-day);
        return moment(date);
}
// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__
export const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

__initStore__(store);

let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  window.$store = store;
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// init ajax axios util!
// ========================================================

axios.defaults.baseURL = BASE_URL
axios.defaults.timeout = 1000*20;

// do long running stuff

let  process =window.p=[];
axios.defaults.transformRequest.unshift(function (data={}) {

    if(typeof data == 'object' && !data.user_id){
        data.user_id = user.userid;
    }

    if(data.hideLoading!==true){
        store.dispatch(showLoading())
        process.push(1);
    }
    
    return str2Int(data)
});
axios.interceptors.response.use(function (response) {


    let send =response.config.data;
    
        
    setTimeout(()=> store.dispatch(hideLoading()),100);
    let data={};
    if(send && typeof  send ==="string"){
             data=  window.JSON.parse(send);
      
            if(data._msg && response.data && response.data.code=="0"){
                message.success(data._msg==1?"操作成功":data._msg);
            }
    }
    if (response.data) {
        if (response.data.code != '0'){
            let error = new Error(response.data.msg);
            error.code = response.data.code;
            error.status = response.data.status;
            error.psn = response.data.psn;
           
            
            
            if(response.data.code =="19"){
               // TODO
                user.logout();
                hashHistory.push("account/login");
                
            }else{
                notification.error({
                    message:"错误提示",
                    description:response.data.msg
                })
            }
          
            return Promise.reject(error);
        }
    }
    response.data.date= moment(new Date(response.headers.date));
    return response.data;
}, function (error) {
    store.dispatch(hideLoading())
    return Promise.reject(error);
});
// ========================================================
// polyfill!
// ========================================================
window.Promise.prototype.finally = Promise.prototype.finally = function (f) {
    return this.then(function (value) {
        return Promise.resolve(f()).then(function () {
            return value;
        });
    }, function (err) {
        return Promise.resolve(f()).then(function () {
            throw err;
        });
    });
};

// ========================================================
// Go!
// ========================================================
render();
export const appRender=render;
function isArray(obj){
    return Object.prototype.toString.call(obj)==="[object Array]";
}
function str2Int(send){
    for(let field in send){
        if(typeof send[field] ==="number"){
            send[field]+='';
        }
        if(isArray(send[field])){
            for(let i =0;i<send[field].length;i++){
                str2Int(send[field][i]);
            }
        }
    }
    return send;
}