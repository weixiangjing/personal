"use strict";
const Immutable = require('immutable');
import * as OrderModel from '../../../model/Order';

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
        }
    });
};
export const handler = {};

export const search = (params) => {
    let state = exports.state;
    const pagination = state.get('pagination');
    Object.assign(params,{pageSize:pagination.pageSize,pageNum:pagination.current});
    handler.$update(state.set('pending',true));
    return OrderModel.getList(params).then((res)=>{
        let pagination = state.get('pagination');
        pagination.total = res.total;
        state = state.set('pagination',pagination).set('list',res.data);
        return handler.$update(state);
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
export const cacheFormData = (params)=>{
    handler.$update(exports.state.set('formData',params))
};