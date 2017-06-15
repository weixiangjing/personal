import React from 'react'
import {loadRoutes} from '../../util/routeUtil';
import {Layout,Modal} from 'antd';
import Operator from '../../model/Operator';
import className from 'classnames';
import PageNav from '../../components/PageNav';
import PaperFooter from '../../components/PaperFooter';
import axios from 'axios';
let $store;
require('./layout.scss');

const ROOT_PATH='';
const DEFAULT_PATH = ROOT_PATH+'/system',
      LOGIN_PATH = ROOT_PATH+'/login';

const layout = React.createClass({
    getInitialState(){
        return {
            menuFold:Operator.logged
        }
    },
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
        Operator.event.addListener('login',()=>{
            setTimeout(()=>{
                this.setState({menuFold:true})
            },10)
        })
        Operator.event.addListener('logout',()=>{
            setTimeout(()=>{
                this.setState({menuFold:false});
                if(this.props.location.pathname!=='/login')this.props.router.push({pathname:'/login'})
            },10)
        })
        axios.event.addListener('sessionTimeOut',()=>{
            Operator.logout();
        })
        window.addEventListener('focus',this.checkUserTimeout);
    },
    componentWillUnmount(){
        window.removeEventListener('focus',this.checkUserTimeout);
    },
    checkUserTimeout(){
        // console.log('window focus');
        // Operator.syncInfo();
    },
    logout(){
        Modal.confirm({
            content:'退出登录？',
            onOk:()=>{
                Operator.logout(true);
            }
        })
    },
    render(){
        const props = this.props;
        return <Layout className="page-operator bg-dark">
            <div className={className('page-center-content',{'fold':Operator.logged})}>
                <div className="page-nav">
                    <PageNav logout={this.logout}/>
                </div>
                <div className="page-paper">
                    <div className="page-body x-scroll">{props.children}</div>
                    <PaperFooter/>
                </div>
            </div>
        </Layout>
    }
})

module.exports = (store) => {
    $store = store;
    return {
        path: ROOT_PATH,
        component: layout,
        childRoutes: loadRoutes(require('./routes'),store)
    }
};

function checkUserLogin (location,replace) {
    if(location.pathname===LOGIN_PATH)return;
    if(location.pathname===ROOT_PATH){
        replace({pathname:DEFAULT_PATH});
    }else {
        console.log('user status：',Operator.logged);
        if(!Operator.logged){
            replace({pathname:LOGIN_PATH,query:location.query,hash:location.hash})
        }
    }
}
