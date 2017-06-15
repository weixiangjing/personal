import React from 'react'
import {loadRoutes} from '../../util/routeUtil'
import BlankLayout from '../../layouts/BlankLayout';

module.exports = (store) => ({
    path: '/user',
    component: BlankLayout,
    ...loadRoutes(require('./routes'), store)
});
