"use strict";
import React from 'react'
import { Layout } from 'antd';
const { Content } = Layout;
import HeaderComponent from '../../components/Header';
import SiderMenuComponent from '../../components/SiderMenu';
import FooterComponent from '../../components/Footer';
import BreadcrumbComponent from '../../components/Breadcrumb';

export const CommonLayout = (props) => {
    let {children,routes,params} = props;
    return (
      <div>
          <HeaderComponent id="app-header"/>
          <Content id="app-container" className="center-wrapper">
              <BreadcrumbComponent routes={routes} params={params} id="app-breadcrumb"/>
              <Layout id="app-body">
                  <SiderMenuComponent routes={routes} params={params} id="app-sider-menu"/>
                  <Content id="app-content">{children}</Content>
              </Layout>
          </Content>
          <FooterComponent id="app-footer"/>
      </div>
    )
};

CommonLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};
export default CommonLayout