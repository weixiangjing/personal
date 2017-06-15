import React from 'react'
import {loadRoutes} from '../../util/routeUtil'
import BlankLayout from '../../layouts/BlankLayout';

const ROOT_PATH = 'sign';
module.exports = (store) => ({
    path: ROOT_PATH,
    component: BlankLayout,
    ...loadRoutes(require('./routes'), store)
});
