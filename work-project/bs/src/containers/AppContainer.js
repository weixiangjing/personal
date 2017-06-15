import React, {Component, PropTypes} from "react";
import {hashHistory, Router} from "react-router";
import {Provider} from "react-redux";
import ReactDOM from "react-dom";
import {MOUNT_NODE} from "../common/AutoCompleteAsync";

import user from "../model/User";
class AppContainer extends Component {
    static propTypes = {
        routes: PropTypes.object.isRequired,
        store : PropTypes.object.isRequired
    }
    
    shouldComponentUpdate() {
        return false
    }
    
    render() {
        const {routes, store} = this.props
        return (
            <Provider store={store}>
                <div onClick={()=>{

                    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
                }} style={{height: '100%'}}>

                 
                    <Router history={hashHistory} children={routes}/>
                </div>
            </Provider>
        )
    }
}
checkUserLogin(hashHistory.getCurrentLocation());
hashHistory.listen((nextLocation) => {
        if(nextLocation.action =="PUSH"){
            checkUserLogin(nextLocation);
        }
});
function checkUserLogin(location) {
    const LoginPath='/account/login';
    if(user.logined==false&&location.pathname!=LoginPath){
        console.log('not login');

        hashHistory.replace({pathname: LoginPath});
    }
}
export default AppContainer
