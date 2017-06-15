import React from "react";
import {Layout, Menu, Modal,Popover,notification} from "antd";
const { Header } = Layout;
import logo from "./assets/logo.png";
import userimg1 from "./assets/user1.jpg";
import userimg2 from "./assets/user2.jpg";
import User from "../../model/User";
import LoadingBar from "react-redux-loading-bar"
import './Header.scss';
import MenuMoadl from './modal';
import axios from 'axios';
const Menus = [
    {label: '收银配置', route: 'cashier'},
    {label: '交易查询', route: 'inquiry'},
    {label: '收银监控', route: 'watcher'},
    {label: '系统功能', route: 'system'}
];
export class HeaderComponent extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedKeys: [],
          loading:false,
          visible: false,
          userimg:userimg1
        }
    }

    static contextTypes = {
        router: React.PropTypes.object
    };

    componentWillReceiveProps() {
        let basePath = this.getBasePath();
        if(basePath)this.setState({ selectedKeys: [basePath] });
    }

    componentDidMount() {
        let basePath = this.getBasePath();
        if(basePath)this.setState({ selectedKeys: [basePath] });
    }

    handelMenuItemSelect(item) {
        if(this.context.router.location.pathname===item.key)return;
        this.context.router.push('/'+item.key);
    }

    getBasePath() {
        let parsedPath = parsePath(this.context.router.location.pathname);
        return parsedPath[0];
    }
    showModal(){
      this.setState({
        visible:true
      })
    }
  onCancel(){
    const form = this.form;
    form.resetFields();
    this.setState({
      visible: false,
    });
  }
  onCreate(){
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {return;}
      this.setState({loading:true})
      values.newpassword=User.getClass().signPassword(values.username,values.newpassword);
      values.oldpassword=User.getClass().signPassword(values.username,values.oldpassword);
      axios.post('user/AlterPassword',values).then((res)=>{
        notification.success({
          message: '密码修改成功',
          description: res.message,
        })
        this.setState({visible: false,loading:false});
      }).catch((err)=>{
        notification.success({
          message: '密码修改失败',
          description: err.message,
        })
        this.setState({visible: false,loading:false});
      })
      form.resetFields();
    });
  }
  saveFormRef(form){this.form=form}
  exit() {
        const login = this.context;
        Modal.confirm({
            title     : '提示',
            content   : '是否要退出？',
            okText    : '确认',
            cancelText: '取消',
            onOk() {
                login.router.push('/account/login');
                //User.logout();
            },
            onCancel() {
            },
        });
    }
  VisibleChange(visible){
    visible?this.setState({userimg:userimg2}):this.setState({userimg:userimg1})
  }
    render() {
        let topMenus = User.userMenus
        const text = <span>{User.real_name}</span>;
        const Content = (
          <div>
            <p style={{textAlign:'center'}}><a onClick={this.showModal.bind(this)}>修改密码</a></p>
            <p style={{textAlign:'center'}}><a onClick={this.exit.bind(this)}>退出登录</a></p>
          </div>
        );
        return <Header className="header">

            <LoadingBar/>

                <img   className="logo pull-left" src={logo}/>



          {User.logined&&
            <Popover arrowPointAtCenter content={Content} trigger="hover" title={text} placement="bottomRight" onVisibleChange={this.VisibleChange.bind(this)}>
              <img src={this.state.userimg} className="user_portrait"/>
            </Popover>
        }
          <Menu selectedKeys={this.state.selectedKeys} onSelect={this.handelMenuItemSelect.bind(this)}
                  className="main-nav" mode="horizontal" defaultSelectedKeys={['2']}>
                {topMenus.map(menu => {

                    return <Menu.Item key={menu.route}>{menu.name}</Menu.Item>
                })}

            </Menu>
          <MenuMoadl
            onCancel={this.onCancel.bind(this)}
            onCreate={this.onCreate.bind(this)}
            ref={this.saveFormRef.bind(this)}
            visible={this.state.visible}
            loading={this.state.loading}
            UserData={User.menus}
          />

        </Header>
    }
}
function parsePath(path) {
    if(!path)return [];
    let arr = path.split('/');
    return arr.filter(function (item) {
        return item;
    });
}

export default HeaderComponent
