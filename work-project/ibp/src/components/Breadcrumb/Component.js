'use strict';
import React from 'react'
import {Breadcrumb} from 'antd'
import classNames from 'classnames';
import {Link} from 'react-router';
import User from '../../model/User';
let recordPath = '';

export class BreadcrumbComponent extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    };
    componentWillReceiveProps(nextProps){
        if(this.props.routes !== nextProps.routes)recordPath = '';
    }
    componentWillUnmount(){
        recordPath = '';
    }
    itemRender(route, params, routes, paths){
        const getPathname = (path)=> {
            recordPath += recordPath?'/'+path:path;
            const menuMap = User.get('menuMap');
            const menu = menuMap[recordPath];
            if(!menu)return path;
            return menu.res_name;
        };
        const last = routes.indexOf(route) === routes.length - 1;
        const isMenuRoot = route.childRoutes.length>0 && (typeof route.indexRoute) !== 'object';
        return last || isMenuRoot ? <span>{getPathname(route.path)}</span> : <Link to={'/'+paths.join('/')}>{getPathname(route.path)}</Link>;
    }
    render () {
        const {className,id,routes,params} = this.props;
        const filteredRoutes = routes.filter((route)=>{
            return route.path != null && route.path !== '' && route.path !== '/';
        });
        return <div className={classNames('app-comp-breadcrumb',className)} id={id}>
            <Breadcrumb routes={filteredRoutes} params={params} itemRender={this.itemRender} />
        </div>
    }
}
export default BreadcrumbComponent
