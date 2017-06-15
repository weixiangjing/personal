import React from 'react'
import ReactDOM from 'react-dom'
import {hashHistory} from 'react-router';
import {message,notification} from "antd";
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import axios from 'axios';
import moment from "moment";
import user from './model/User';
import { showLoading, hideLoading } from 'react-redux-loading-bar'


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
axios.defaults.baseURL = '/api';
axios.defaults.timeout = 1000*20;

// do long running stuff

let  process =window.p=[];
axios.defaults.transformRequest.unshift(function (data) {
    
    if(process.length===0){
        store.dispatch(showLoading())
    }
    process.push(1)
   
   
    return data;
});

axios.interceptors.response.use(function (response) {
    process.pop();
    console.log(process)
    if(process.length===0){
        console.log(process.length)
        setTimeout(()=>store.dispatch(hideLoading(),3000));
    }
    return response.data;
}, function (error) {
    
    process.pop();
    if(process.length===0){
        console.log(process.length)
        setTimeout(()=>store.dispatch(hideLoading(),3000));
    }
        if(error && error.response && error.response.data){
            let data = error.response.data;
            notification.error({message:data.message});
        }else{
            notification.error({message:error.message});
        }

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

