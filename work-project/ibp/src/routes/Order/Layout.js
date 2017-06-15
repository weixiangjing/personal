import React from 'react'
import {loadRoutes} from '../../util/routeUtil'
import CommonLayout from '../../layouts/CommonLayout';

module.exports = (store) => ({
    path: 'order',
    component: CommonLayout,
    ...loadRoutes(require('./routes'), store)
});
