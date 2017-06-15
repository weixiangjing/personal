import React from "react";
import {Layout, Modal, Popover, notification, Icon} from "antd";
import {hashHistory} from "react-router";
import logo from "./assets/shopping-log.png";
import User from "../../model/User";
import LoadingBar from "react-redux-loading-bar";
import "./Header.scss";
import CartUtil from "../../model/CartUtil";
const {Header} = Layout;
export class HeaderComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            selectedKeys: [],
            num         : CartUtil.getTotal(),
            loading     : false,
            change      : 0,
        }
        window.__header=this;
    }

    static contextTypes={
        router: React.PropTypes.object
    };

    componentWillReceiveProps() {
        let basePath=this.getBasePath();
        if(basePath) this.setState({selectedKeys: [basePath]});
    }

    componentDidMount() {
        let basePath=this.getBasePath();
        if(basePath) this.setState({selectedKeys: [basePath]});
    }

    handelMenuItemSelect(item) {
        if(this.context.router.location.pathname===item.key)return;
        this.context.router.push('/'+item.key);
    }

    getBasePath() {
        let parsedPath=parsePath(this.context.router.location.pathname);
        return parsedPath[0];
    }

    render() {
        return <Header className="header">
            <LoadingBar/>

            <div className="view-max-width">
            <img className="logo pull-left" src={require("./assets/market-32.png")}/>


                {
                    User.logined && <div  onClick={()=>hashHistory.push("service/buy/cart")} className="cart hover-pointer">
                        <Icon className="service-shopping-cart-icon" type="shopping-cart"/>
                        {
                            this.state.num>0&&<i className="cart-num">{this.state.num}</i>
                        }
                    </div>
                }


            {User.logined&&<i  className="fa fa-user-circle"/>}
            <div className="pull-right title">{User.logined?User.userName:""}</div>

            </div>
        </Header>
    }
}
function parsePath(path) {
    if(!path)return [];
    let arr=path.split('/');
    return arr.filter(function(item) {
        return item;
    });
}
export default HeaderComponent


