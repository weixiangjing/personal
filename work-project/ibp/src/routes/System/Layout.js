"use strict";
import React from 'react'
import {loadRoutes} from '../../util/routeUtil'
import CommonLayout from '../../layouts/CommonLayout';

module.exports = (store) => ({
    path: 'system',
    component: CommonLayout,
    ...loadRoutes(require('./routes'), store)
});
