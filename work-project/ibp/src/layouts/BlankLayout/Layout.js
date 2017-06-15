"use strict";
import React from 'react'
import { Layout } from 'antd';
const { Content } = Layout;
import HeaderComponent from '../../components/Header';

export const BlankLayout = (props) => {
    let {children} = props;
    return (
      <Layout id="app-root" style={{backgroundColor:'#fff'}}>
          <HeaderComponent id="app-header"/>
          <Content id="app-container" className="center-wrapper">
              <Layout id="app-body">
                  <Content id="app-content">{children}</Content>
              </Layout>
          </Content>
      </Layout>
    )
};

BlankLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};
export default BlankLayout