import React from 'react'
import ReactDOM from 'react-dom'
import {hashHistory} from 'react-router';
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
const EventEmitter = require('wolfy87-eventemitter');
import axios from 'axios';
import Admin from './model/Admin'
import {__initStore__} from "./store/storeUtil";
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

axios.defaults.baseURL = '/api'
axios.defaults.timeout = 1000*20;
axios.event = new EventEmitter();
// do long running stuff
axios.interceptors.response.use(function (response) {
    if (response.data) {
        if (response.data.code != 0){
            let error = new Error(response.data.msg);
            error.code = response.data.code;
            error.status = response.data.status;
            error.psn = response.data.psn;
            if(response.data.code == 19){
                axios.event.emitEvent('sessionTimeOut');
              if(Admin.logged){
                Admin.logout();
                hashHistory.push({pathname:'/console/login'});
              }
            }
            return Promise.reject(error);
        }
    }
    return response.data;
}, function (error) {
    return Promise.reject(error);
});
// ========================================================
// polyfill!
// ========================================================
window.Promise.prototype.finally = Promise.prototype.finally = function (f) {
    return this.then(function (value) {
        return Promise.resolve(f(null,value)).then(function () {
            return value;
        });
    }, function (err) {
        return Promise.resolve(f(err)).then(function () {
            throw err;
        });
    });
};

// ========================================================
// Go!
// ========================================================
render();

