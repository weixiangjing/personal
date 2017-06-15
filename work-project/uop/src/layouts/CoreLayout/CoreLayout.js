import React from 'react'
import './CoreLayout.scss'
import { Layout } from 'antd';

export const CoreLayout = (props) => {
    let {children} = props;
    return (
      <Layout style={{minHeight:'100%'}}>
        {children}
      </Layout>
    )
};
 
CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};
export default CoreLayout