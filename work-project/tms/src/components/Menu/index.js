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
        let name =this.context.router.location.pathname
            name =name.split('/').slice(0,4).join('/');
        
        this.setState({ selectedKeys: [name] });
    }
    componentDidMount() {
        let name =this.context.router.location.pathname
        name =name.split('/').slice(0,4).join('/');
       
        this.setState({ selectedKeys: [name] });
    }
    onTitleClick(e) {
      
        let fullPath=this.context.router.getCurrentLocation().pathname
        let key=e.key;
        if(key!==fullPath&&fullPath.indexOf(key)===0) {

            this.context.router.goBack();
        }
       
    }
    componentWillMount(){
        
       
        let items = this.props.items||[];
        if(items.length==0){
            throw  new Error("无权访问");
        }
    
        let path = this.context.router.location.pathname;
        path =path[0]==="/"?path.slice(1):path;
       let openKeys=
       this.state.openKeys=this.findDefaultOpenKeys(items,path.split('/').slice(0,2).join('/'));
    }
    findDefaultOpenKeys(items,path){
     
        for(let i=0;i<items.length;i++){
            let item =items[i];
            if(item.route===path) return [item.name]
        }
        return []
       
       
        
    }
    handelMenuItemSelect(item) {
        this.context.router.push(item.key);
    }
    handleOpenChange(openkeys){
        if(openkeys.length>0){
            this.setState({openKeys:openkeys.slice(-1)})
        }else{
            this.setState({openKeys:[]})
        }
        
       
    }
    render(){
        let menu      = this.props.items||[]
        let menuClass = this.props.menuClass || "";
        return <Sider className="slide-bar">
            <Menu onOpenChange={(e)=>this.handleOpenChange(e)} onClick={(e)=>this.onTitleClick(e)}   mode="inline" openKeys={this.state.openKeys} selectedKeys={this.state.selectedKeys} onSelect={this.handelMenuItemSelect.bind(this)} className={menuClass}>
                {menu.map((menu)=> {
                    let children = menu.children;
                    if(children){
                        return <SubMenu key={menu.name} title={<span>{menu.icon?<Icon type={menu.icon}/>:''}{menu.name}</span>}>
                            {children.map(item=>{
                                return <Menu.Item key={"/"+item.route}>{item.name}</Menu.Item>
                            })}
                        </SubMenu>
                    }else {
                        return <Menu.Item className="final" key={"/"+menu.route}><Icon type={menu.icon}/>{menu.name}</Menu.Item>
                    }
                })}
            </Menu>
        </Sider>
    }
}
export default MenuComponent;