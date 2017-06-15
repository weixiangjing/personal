/**
 *  created by yaojun on 16/12/13
 *
 */




"use strict";
import React from "react";
import {getCard} from "../../../../model/CardBind";
import {cleanEmpty,showTaskModal} from "../../../../util/helper";

import axios from "axios"
const Immutable = require('immutable');
export const  initialState=()=> {
    return Immutable.fromJS({
       
    })
}
export const  handler = {}
