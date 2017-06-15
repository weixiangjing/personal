"use strict";
import ReactTestUtils from 'react-addons-test-utils'
import {connect} from 'react-redux';
import {injectReducer} from '../store/reducers';
import { browserHistory } from 'react-router'
import {dispatch} from '../store/storeUtil';
import {showLoading,hideLoading} from "react-redux-loading-bar";
const Containers = {};
export const RESET_PAGE_STORE = 'RESET_PAGE_STORE';

export function loadRoutes(routeConfigList,store) {
    let routes = [];
    const groupKey = generateRandom();
    routeConfigList.forEach(function (routeConfig) {
        const uniKey = groupKey+'-'+routeConfig.path;
        routes.push({
            path: routeConfig.path,
            childRoutes:routeConfig.children||[],
            getComponent (nextState, cb) {
                store.dispatch(showLoading());
                require.ensure([], (require) => {
                    if(!routeConfig.path)throw new Error('route path can not be null');
                    let reducer = null;
                    if(routeConfig.storeKey && routeConfig.reducer){
                        const Reducer = require('../routes/'+routeConfig.reducer);
                        reducer = initReducer(store,routeConfig,Reducer);
                    }
                    // container缓存起来，不能重复每次路由刷新就创建
                    let conn = Containers[uniKey];
                    if(!conn){
                        let Component = require('../routes/'+routeConfig.component);
                        conn = createContainer(store,routeConfig.storeKey,Component,reducer);
                        Containers[uniKey] = conn;
                    }
                    setTimeout(()=>store.dispatch(hideLoading()),100)
                    cb(null,conn);
                });
            }
        })
    });
    return routes;
}

function generateRandom() {
    return String(Math.random()).substr(3);
}

function initReducer(store,routeConfig,Reducer) {
    let reducer ;
    if(typeof Reducer ==="function"){
        reducer= new Reducer();
    }else{
        reducer =Reducer;
    }
    reducer.handler[routeConfig.storeKey]=(state,action)=>{
        return action.state;
    }
    reducer.handler.$update=(state)=>{
        store.dispatch({type:routeConfig.storeKey,state});
    }
    
    function createReducer(state = reducer.initialState(),action) {
        //清除所在页面的state
        if(routeConfig.keepAlive !== true && action.type===RESET_PAGE_STORE)return reducer.initialState();
        const handler = reducer.handler[action.type];
        return handler ? handler(state, action) : state
    }
    injectReducer(store, { key: routeConfig.storeKey, reducer:createReducer });
    return reducer;
}

function createContainer(store,storeKey,Component,reducer) {
    let stateGetter = {
        get : function(){
            return store.getState()[storeKey];
        },
        enumerable : true,
        configurable : true
    };
    let component = (props)=>{
        if(reducer)Object.defineProperty(reducer, "state",stateGetter);
        Component = Component.default || Component;
        if(ReactTestUtils.isCompositeComponent(Component.prototype)){
            let comp = new Component(props);
            Object.defineProperty(comp, "storeState",stateGetter);
            comp.storeKey = storeKey;
            let _render = comp.render;
            comp.render = function () {
                return _render.call(this,comp.storeState,this.props);
            };
            return comp;
        }else {
            return Component(props,stateGetter.get());
        }
    };
    const createMapStateToProps = (key)=>{
        return (state) => ({
            [key]: state[key]
        });
    };
    let conn = null;
    if(reducer){
        conn = connect(createMapStateToProps(storeKey), reducer.mapDispatchToProps)(component);
    }else {
        conn = component
    }
    return conn;
}

export const resetCurrentPageStore = ()=>{
    return dispatch({
        type:RESET_PAGE_STORE
    })
};

let currentLocation = browserHistory.getCurrentLocation();
browserHistory.listen((nextLocation) => {
    if(nextLocation.action === 'PUSH' && nextLocation.pathname !== currentLocation.pathname){
        resetCurrentPageStore();
    }
    currentLocation = nextLocation;
});