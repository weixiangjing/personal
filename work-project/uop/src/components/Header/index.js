'use strict'
import React from 'react'
import { Menu, Dropdown, Icon, Layout, Modal } from 'antd'
import { Link } from 'react-router'
const {Header} = Layout
require('./style.scss')

export class HeaderComponent extends React.Component {

    constructor (props, context) {
        super(props, context)
        this.state = {
            selectedKeys: [],
            loading: false,
        }
    }

    static contextTypes = {
        router: React.PropTypes.object
    }
  componentWillReceiveProps() {
    let basePath =this.context.router.location.pathname;
    if(basePath)this.setState({ selectedKeys: [basePath] });
  }
  componentDidMount() {
    let basePath = this.context.router.location.pathname;
    if(basePath)this.setState({ selectedKeys: [basePath] });
  }
    logout () {
        Modal.confirm({
            content: '退出登录？',
            onOk: () => {
                this.props.user.logout()
                this.context.router.push({pathname: '/console/login'})
            }
        })
    }

    handelMenuItemSelect (item) {
        if (this.context.router.location.pathname === item.key)return
        this.context.router.push(item.key);
      this.setState({selectedKeys:[item.key]})
    }
    render () {
      const router_name=this.context.router.location.pathname;
        const menu = (
            <Menu>
                <Menu.Item key="0"><Link to={`${this.props.user.storeKey=="uop_user_admin"?"/console/modifyPassword":"/modifyPassword"}`}>修改密码</Link></Menu.Item>
                <Menu.Item key="1"><a onClick={this.logout.bind(this)}>退出登录</a></Menu.Item>
            </Menu>
        )
        return <Header className="page-header">
            <img src="/img/logo.png"/>
            {this.props.user.logged &&router_name!='/console/login'&& <div className="user-nav">
              {this.props.user.storeKey=="uop_user_admin"?<Menu mode="horizontal"
                      selectedKeys={this.state.selectedKeys}
                      onSelect={this.handelMenuItemSelect.bind(this)}
                >
                    <Menu.Item key="/console/user">用户管理</Menu.Item>
                    <Menu.Item key="/console/system">系统管理</Menu.Item>
                </Menu>:""}
                <Dropdown overlay={menu} trigger={['click']}>
                    <div className="user-info">
                        <span className="avatar" style={{backgroundImage: `url(${this.props.user.get('avatar')})`}}/>
                        <label className="user-name">{this.props.user.get('name')}</label>
                        <Icon type="down" className="gutter-left"/>
                    </div>
                </Dropdown>
            </div>}
        </Header>
    }
}
export default HeaderComponent
