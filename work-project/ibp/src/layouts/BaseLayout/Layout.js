import React from 'react'
import './style.scss'
import {Layout} from 'antd';

export const BaseLayout = (props) => {
    let {children} = props;
    return (
      <Layout id="app-layout-base">
          {children}
      </Layout>
    )
};

BaseLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};
export default BaseLayout