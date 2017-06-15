import React from "react";
import {Layout, Menu, Modal, Popover, notification,Tooltip} from "antd";
import {Link,hashHistory} from "react-router";
import userimg1 from "./assets/user1.jpg";
import userimg2 from "./assets/user2.jpg";
import User from "../../model/User";
import LoadingBar from "react-redux-loading-bar";
import "./Header.scss";
import MenuMoadl from "./modal";
import axios from "axios";
const {Header} = Layout;

const Menus=[
    {label: '收银配置', route: 'cashier'},
    {label: '交易查询', route: 'inquiry'},
    {label: '收银监控', route: 'watcher'},
    {label: '系统功能', route: 'system'}
];
export class HeaderComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            selectedKeys: [],
            loading: false,
            visible: false,
            userimg: userimg1,
            taskNum: 0,
            taskVisible: false
        }
    }

    static contextTypes={
        router: React.PropTypes.object
    };
    taskTimer=0
    showTaskTips() {
        this.setState({taskVisible: true});
        clearTimeout(this.taskTimer);
        this.taskTimer=setTimeout(()=>this.setState({taskVisible: false}), 4000);
    }

    componentWillReceiveProps() {
        let basePath=this.getBasePath();
        if(basePath) this.setState({selectedKeys: [basePath]});
    }

    componentDidMount() {
        window.__header=this;
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

    showModal() {
        this.setState({
            visible: true
        })
    }

    onCancel() {
        const form=this.form;
        form.resetFields();
        this.setState({
            visible: false,
        });
    }

    onCreate() {
        const form=this.form;
        form.validateFields((err, values)=> {
            if(err) {return;}
            this.setState({loading: true})
            for(let key in values) {if(values[key]&&typeof (values[key]!='number'))values[key]=values[key].trim()};
            values.newpassword=User.getClass().signPassword(values.username, values.newpassword);
            values.oldpassword=User.getClass().signPassword(values.username, values.oldpassword);
            axios.post('user/AlterPassword', values).then((res)=> {
                notification.success({
                    message: '密码修改成功',
                    description: res.message,
                })
                this.setState({visible: false, loading: false});
            }).catch((err)=> {
                notification.success({
                    message: '密码修改失败',
                    description: err.message,
                })
                this.setState({visible: false, loading: false});
            })
            form.resetFields();
        });
    }

    saveFormRef(form) {this.form=form}

    exit() {
        const login=this.context;
        Modal.confirm({
            title: '提示',
            content: '是否要退出？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                if(User.token) {
                    User.logout();
                    window.close();
                } else {
                    login.router.push('/account/login');
                    User.logout();
                }
            },
            onCancel() {
            },
        });
    }

    VisibleChange(visible) {
        visible ? this.setState({userimg: userimg2}) : this.setState({userimg: userimg1})
    }

    render() {
        let topMenus=User.userMenus||[];
        const text=<span>{User.real_name}</span>;
      const location = hashHistory.getCurrentLocation();
      const isLoginPage=location.pathname=="/account/login";
      const Content=(
            <div>
                {!User.token&&<p style={{textAlign: 'center'}}><a onClick={this.showModal.bind(this)}>修改密码</a></p>}
                <p style={{textAlign: 'center'}}><a onClick={this.exit.bind(this)}>{User.token ? "退出系统" : "退出登录"}</a>
                </p>
            </div>
        );
        return <Header className="header">

            <LoadingBar/>
            <div className="view-max-width">

                <img className="logo pull-left" src={require("./assets/tms-32.png")}/>

                {User.logined&&!isLoginPage&&
                <Popover arrowPointAtCenter content={Content} trigger="hover" title={text} placement="bottomRight"
                         onVisibleChange={this.VisibleChange.bind(this)}>
                    <img src={this.state.userimg} className="user_portrait"/>
                </Popover>
                }
                {
                    User.logined&&!isLoginPage&&

                    <Tooltip visible={this.state.taskVisible} placement={"bottom"} title={"已加入任务管理，点击可查看任务状态"}>
                       <i  onClick={()=>hashHistory.push("task/download")} className="fa fa-download notice"></i>
                    </Tooltip>
                }
              {!isLoginPage&&<Menu selectedKeys={this.state.selectedKeys} onSelect={this.handelMenuItemSelect.bind(this)}
                      className="main-nav" mode="horizontal" defaultSelectedKeys={['2']}>
                    {topMenus.map(menu=> {

                        return <Menu.Item key={menu.route}>{menu.name}</Menu.Item>
                    })}

                </Menu>}
                <MenuMoadl
                    onCancel={this.onCancel.bind(this)}
                    onCreate={this.onCreate.bind(this)}
                    ref={this.saveFormRef.bind(this)}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    UserData={User.menus}
                />
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
