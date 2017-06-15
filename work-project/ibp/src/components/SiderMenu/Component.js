'use strict';
import React from 'react'
import {Menu,Layout} from 'antd'
const {Sider} = Layout;
const { SubMenu } = Menu;
require('./style.scss');
import classNames from 'classnames';
import User from '../../model/User';

export class SiderMenuComponent extends React.Component {
    state = {
        selectedKeys: []
    };
    static contextTypes = {
        router: React.PropTypes.object
    };
    componentWillReceiveProps(nextProps) {
       this.selectByRoutes(nextProps.routes);
    }
    componentDidMount() {
       this.selectByRoutes(this.props.routes);
    }
    selectByRoutes(routes){
        const isAction = (path)=>{
            const actionMap = User.get('actionMap');
            return !!actionMap[path];
        };
        let selectedKey = '';
        routes.forEach(route=>{
            if(route.path && route.path!=='/'){
                let appendPath = selectedKey + ('/') +route.path;
                appendPath = appendPath.replace(/^\//,'');
                if(!isAction(appendPath))selectedKey = appendPath;
            }
        });
        this.setState({ selectedKeys: [selectedKey] });
    }
    handelMenuItemSelect(item) {
        this.context.router.push('/'+item.key);
    }
    render () {
        const {className,id} = this.props;
        const menu = User.get('menus');
        return <Sider className={classNames('app-comp-sider-menu',className)} id={id}>
            <Menu mode="inline"
                  defaultOpenKeys={this.state.openKeys}
                  selectedKeys={this.state.selectedKeys}
                  onSelect={this.handelMenuItemSelect.bind(this)}
                  style={{ height: '100%' }}
            >
                {menu.map((menu)=> {
                    let children = menu.children;
                    if(children && children.length){
                        return <SubMenu key={menu.name} title={<span>{menu.icon&&<Icon type={menu.icon}/>}{menu.name}</span>}>
                            {children.map(item=>{
                                return <Menu.Item key={item.route}>{item.name}</Menu.Item>
                            })}
                        </SubMenu>
                    }else {
                        return <Menu.Item className="final" key={menu.route}>{menu.icon&&<Icon type={menu.icon}/>}{menu.name}</Menu.Item>
                    }
                })}
            </Menu>
        </Sider>
    }
}
export default SiderMenuComponent
