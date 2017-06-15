'use strict';
import React from 'react'
import { Menu, Dropdown, Icon, Layout} from 'antd'
import { Link } from 'react-router'
const {Header} = Layout;
import classNames from 'classnames';
import User from '../../model/User';
import {Modal} from 'antd';
require('./style.scss');

export class HeaderComponent extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    };
    logout(){
        Modal.confirm({
            content:'退出登录？',
            onOk:()=>{
                User.logout()
            }
        })
    }
    goHome(){
        this.context.router.replace({pathname: User.logged?'/':'/sign'});
    }
    render () {
        const menu = (
            <Menu>
                <Menu.Item key="0"><Link to="/user/modifyPassword">修改密码</Link></Menu.Item>
                <Menu.Item key="1"><a onClick={this.logout.bind(this)}>退出登录</a></Menu.Item>
            </Menu>
        );
        const {className,id} = this.props;
        return <Header className={classNames('app-comp-header',className)} id={id}>
            <div className="header-content center-wrapper">
                <span role="button" className="logo" onClick={this.goHome.bind(this)}>
                    <img src="/img/logo.png"/>
                    <h1>代理商分期收款系统</h1>
                </span>
                {User.logged && <div className="right-tool">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div className="user-info">
                            <span className="avatar" style={{backgroundImage: `url('${User.get('avatar')}')`}}/>
                            <label className="user-name" role="button">{User.get('real_name')}</label>
                            <Icon type="down" className="gutter-left"/>
                        </div>
                    </Dropdown>
                </div>}
            </div>
        </Header>
    }
}
export default HeaderComponent
