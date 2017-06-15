"use strict";
import ReactTestUtils from 'react-addons-test-utils'
import {connect} from 'react-redux';
import {injectReducer} from '../store/reducers';
import { hashHistory } from 'react-router'
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
            childRoutes:routeConfig.children?loadRoutes(routeConfig.children,store):[],
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
    reducer.handler.$update=(...params)=>{
        let state,value;
        if(params.length>=2 && params.length %2===0){
            state = store.getState()[routeConfig.storeKey]
            for(let i =0;i<params.length;i+=2){
                let path =params[i];
                path= Array.isArray(path)?path:[path];
                let value =params[i+1];
                state =state.updateIn(path,()=>value);
            }
        
        }else{
            state= params[0];
        }
        store.dispatch({type:routeConfig.storeKey,state});
    }
    reducer.handler.$state=(key)=>{
        let state =store.getState()[routeConfig.storeKey];
       return key ? state.get(key):state;
    }
    
    for(let action in reducer){
        if(typeof reducer[action] ==="function" && action!=="initialState" && action[0]!=="_"){
            let originFunc =reducer[action];
            let isInProcessing =false;
                reducer[action]=(...p)=> {
                    if (isInProcessing) {
                      if(process.env.NODE_ENV==="devloment"){
                         return  console.error(`[ Dispatch Error ] ${action} 尚未执行完成，请等待~~~`);
                      }
                      return ;
                      
                    }
                    isInProcessing = true;
                    let result     = originFunc(...p);
                    if (result && typeof result.then === "function" && typeof result.catch === "function") {//promise
                        result.finally((res) => {
                            isInProcessing = false;
                        })
                    }else{
                        if(result){
                            console.error("[Reducer HOOK Warning]",'must return promise or immutable object')
                        }
                        
                        isInProcessing=false;
                    }
                    
                    return result;
                }
        }
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
                return _render.call(this,this.props,comp.storeState);
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

let currentLocation = hashHistory.getCurrentLocation();
hashHistory.listen((nextLocation) => {
    if(nextLocation.action === 'PUSH' && nextLocation.pathname != currentLocation.pathname){
        resetCurrentPageStore();
    }
    currentLocation = nextLocation;
});