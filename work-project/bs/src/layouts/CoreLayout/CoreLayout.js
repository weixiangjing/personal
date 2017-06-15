import React from 'react'
import HeaderComponent from '../../components/Header';
import './CoreLayout.scss'
import { Layout, Breadcrumb} from 'antd';
import {getBreadcrumb} from "../../routes/Service/routes";
import {APP_BUILD_TIME,APP_VERSION} from "../../config/app.config";
const { Content,Footer } = Layout;

export const CoreLayout = (props) => {
    let {children,location} = props;


    let paths = location.pathname.split('/').filter(item=>item);
    let breadcrumb =getBreadcrumb(paths);

    console.log(breadcrumb)



    return (
    <Layout>
        <HeaderComponent/>
     
       
       
     
        <Content style={{ padding: '0 50px'}}>
            <div className="view-max-width">
            <Breadcrumb>
                {
                    breadcrumb.map(item=> <Breadcrumb.Item key={item.route}>{item.label}</Breadcrumb.Item>)
                }
    
            </Breadcrumb>
            {children}
            </div>
        </Content>

        
        <Footer className="tms-footer text-center" >
                <span className="font-small ">@2016-2017 </span>
                <strong> 北京微智全景信息技术有限公司 | </strong>
                <span className="text-info"> MARKET v{APP_VERSION} </span>build {APP_BUILD_TIME}
            

        </Footer>
    </Layout>
    )
};
 
CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};
export default CoreLayout
