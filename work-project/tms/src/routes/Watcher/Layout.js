import React from 'react'
import {loadRoutes} from '../../util/routeUtil'

const Layout = ({ children }) => (
    <div className='container text-center'>
        <h1>Menu</h1>
        <div className='core-layout__viewport'>
            {children}
        </div>
    </div>
);

module.exports = (store) => ({
    path: '/cashier',
    component: Layout,
    // indexRoute: Home,
    childRoutes: [
        ...loadRoutes(require('./routes'),store),
    ]
});
