"use strict";
import {Icon,Layout,Menu} from "antd";
const {Sider} = Layout;
const { SubMenu } = Menu;
import React from "react";
import './menu.scss';

class MenuComponent extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedKeys: [],
            openKeys:[]
        }
    }
    static contextTypes = {
        router: React.PropTypes.object
    };
    componentWillReceiveProps() {
        this.setState({ selectedKeys: [this.context.router.location.pathname] });
    }
    componentDidMount() {
        this.setState({ selectedKeys: [this.context.router.location.pathname] });
    }
    componentWillMount(){
        
        let openKeys = [];
        let items = this.props.items||[];
        if(items.length==0){
            throw  new Error("无权访问");
        }
        items.map(item=>{
            if(item.children)openKeys.push(item.name);
        });
        this.state.openKeys = openKeys;
    }
    handelMenuItemSelect(item) {
        this.context.router.push(item.key);
    }
    render(){
        let menu      = this.props.items||[]
        let menuClass = this.props.menuClass || "";
        return <Sider className="slide-bar">
            <Menu  mode="inline" defaultOpenKeys={this.state.openKeys} selectedKeys={this.state.selectedKeys} onSelect={this.handelMenuItemSelect.bind(this)} className={menuClass}>
                {menu.map((menu)=> {
                    let children = menu.children;
                    if(children){
                        return <SubMenu key={menu.name} title={<span>{menu.icon?<Icon type={menu.icon}/>:''}{menu.name}</span>}>
                            {children.map(item=>{
                                return <Menu.Item key={item.route}>{item.name}</Menu.Item>
                            })}
                        </SubMenu>
                    }else {
                        return <Menu.Item className="final" key={menu.route}><Icon type={menu.icon}/>{menu.name}</Menu.Item>
                    }
                })}
            </Menu>
        </Sider>
    }
}
export default MenuComponent;