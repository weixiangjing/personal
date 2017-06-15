import React from "react";
import {loadRoutes} from "../../util/routeUtil";
import {Layout} from "antd";
import SlideMenu from "../../components/Menu";
const route =require("./routes");
const Content =Layout.Content;
const ServiceLayout = ({children}) => (
    <Layout className="view-port-container">
        <SlideMenu items={route.menus}/>
        <Content className="view-port-content">
            {children}
        </Content>
    </Layout>
);
module.exports = (store) => ({
    path       : '/service',
    component  : ServiceLayout,
    onEnter({location}, replace){
        var key  = "/service"
        let path = location.pathname;
        if (path === key || path === key.slice(1) || path === key + "/") {
            replace({pathname: '/service/home'});
        }
    },
    childRoutes: [
        ...loadRoutes(require('./routes').routes, store),
    ]
});
