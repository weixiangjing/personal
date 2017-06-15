"use strict";
import axios from 'axios';
const Immutable = require('immutable');

exports.initialState = ()=>{
    return Immutable.Map({
        formData:null,
        pending:false,
        list:[],
        pagination: {
            showSizeChanger:true,
            showQuickJumper:true,
            size:'small',
            pageSizeOptions:['15','25','35','45'],
            pageSize:25,
            current:1,
            total:0
        },
        sort:null
    });
};
export const handler = {};

export const search = (params) => {
    const uri = '/tmsStorePaychannel/getMerchantByPaychannelConfig';
    const pagination = exports.state.get('pagination');
    Object.assign(params,{pageSize:pagination.pageSize,pageNum:pagination.current});
    const sort = exports.state.get('sort');
    if(sort&&sort.order){
        const sortType = sort.order==='descend'?2:1;
        let orderKey;
        switch (sort.columnKey){
            case 'mcode':orderKey = 1;
                break;
            case 'update_time':orderKey = 2;
                break;
        }
        Object.assign(params,{orderByField:orderKey,ascOrDesc:sortType})
    }
    let state = exports.state;
    handler.$update(state.set('pending',true));
    return axios.post(uri,params).then((res)=>{
        if(params.export === 1)return res;
        let pagination = state.get('pagination');
        pagination.total = res.total;
        state = state.set('pagination',pagination).set('list',res.data);
        handler.$update(state);
        return res;
    }).finally(()=>{
        handler.$update(state.set('pending',false));
    });
};
export const reset = (isResetPage)=>{
    if(isResetPage===true)resetPage();
    handler.$update(exports.state.set('list',[]).set('formData',null));
};
export const setPagination = (param)=>{
    const state = exports.state;
    let pagination = state.get('pagination');
    pagination.current = param.current;
    pagination.pageSize = param.pageSize;
    handler.$update(state.set('pagination',pagination));
};
export const resetPage = ()=>{
    const state = exports.state;
    const defaultPagination = exports.initialState().get('pagination');
    handler.$update(state.set('pagination',defaultPagination));
};
export const setSort = (sort)=>{
    handler.$update(exports.state.set('sort',sort));
};
export const cacheFormData = (params)=>{
    handler.$update(exports.state.set('formData',params))
};