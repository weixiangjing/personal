/**
 *  created by yaojun on 16/12/21
 *
 */




"use strict";
const Immutable = require('immutable');
const INITIAL_TRADE_LIST = "INQUIRY_RULE_INITIAL_TRADE_LIST";
module.exports           = class {
    initialState() {
        return Immutable.fromJS({list: [], total: 0})
    }
    
    mapDispatchToProps = {
        initialTradeList: (res) => ({type: INITIAL_TRADE_LIST, res})
    };
    handler            = {
        [INITIAL_TRADE_LIST](state, action){
            return state.set('list', action.res.data)
                        .set('total', action.res.total);
        }
    }
};
