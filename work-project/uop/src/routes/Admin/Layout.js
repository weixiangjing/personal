import React from 'react'
import {loadRoutes} from '../../util/routeUtil';
import Header from '../../components/Header';
import {Layout} from 'antd';
import Admin from '../../model/Admin';
import axios from 'axios';
import {APP_BUILD_TIME,APP_VERSION} from "../../config/app.config";
import '../../styles/adminstyle.scss'
const {Content,Footer} = Layout;

const ROOT_PATH='/console';
const DEFAULT_PATH = ROOT_PATH+'/system',
      LOGIN_PATH = ROOT_PATH+'/login';

const layout = React.createClass({
    componentWillReceiveProps(nextProps){
        const {location} = this.props;
        const {replace} = this.props.router;
        if(location.pathname!==nextProps.location.pathname)checkUserLogin(location,replace);
    },
    componentWillMount(){
        const {location} = this.props;
        const {replace} = this.props.router;
        checkUserLogin(location,replace);
    },
  componentDidMount(){
    axios.event.addListener('sessionTimeOut',()=>{
      const {location} = this.props;
      const {replace} = this.props.router;
      Admin.logout();
      console.log('session time out');
      if(location.pathname!=='/console/login'){
        console.log('接口返回登录失败,跳转到登录界面')
        replace({pathname:'/console/login'});
      }
    })
  },
    render(){
        const props = this.props;
        return <Layout>
          <Header user={Admin} router={props.router}/>
            <Content className="page-content">{props.children}</Content>
            <Footer className="page-footer">
              <div className="pull-right company-right">
                <div className="company-logo-desc">
                  <img src={require("../../layouts/CoreLayout/assets/wangPOS2.png")}/>
                  <div>
                    <span className="font-small ">@2016-2017</span>
                    <div><strong>北京微智全景信息技术有限公司</strong></div>
                    <div style={{marginTop:24}}><span className="text-info">UOP v{APP_VERSION} </span>build {APP_BUILD_TIME}</div>
                  </div>
                </div>

              </div>
            </Footer>
        </Layout>
    }
})

module.exports = (store) => ({
    path: ROOT_PATH,
    component: layout,
    childRoutes: loadRoutes(require('./routes'),store)
});
function checkUserLogin (location,replace) {
    if(location.pathname===LOGIN_PATH)return;
    if(location.pathname===ROOT_PATH){
        replace({pathname:DEFAULT_PATH});
    }else {
        console.log('user status：',Admin.logged);
        if(!Admin.logged){
            replace({pathname:LOGIN_PATH})
        }
    }
}
