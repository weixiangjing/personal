"use strict";
import axios from "axios";
import React from "react";
import {message, Modal} from "antd";
import {Table} from "../components/Table";
class User {
    constructor() {
        this.logined=true;
        this.username=null;
        this.userid=null;
        this.real_name=null;
        this.menus=[];
        // test data
        this.userMenus=[{
            route: "service",
            name: "服务商管理",
            children: [

                {
                    route: "/service/home",
                    name: "总览"
                }, {
                    route: "/service/device",
                    name: "设备",
                    children: [
                        {
                            route: "/service/device/basis",
                            name: "基础管理"
                        }, {
                            route: "/service/device/stat",
                            name: "新增服务商出库统计"
                        }, {
                            route: "/service/device/after",
                            name: "售后服务"
                        }, {
                            route: "/service/device/transfer",
                            name: "转售管理"
                        }

                    ]
                }, {
                    route: "/service/merchant",
                    name: "门店",
                    children: [
                        {
                            route: "/service/merchant/manage",
                            name: "门店管理"
                        }, {
                            route: "/service/merchant/claim",
                            name: "门店认领处理"
                        }
                    ]
                }, {
                    route: "/service/order",
                    name: "进件工单"
                }, {
                    route: "/service/agent",
                    name: "服务商",
                    children: [{
                        route: "/service/agent/basis",
                        name: "基础管理"
                    }, {
                        route: "/service/agent/alter",
                        name: "资料变更审核"
                    }]
                }, {
                    route: "/service/sale",
                    name: "员工管理"
                }]
        }, {
            route: "business",
            name: "业务中心",
            children: [
                {
                    route: "/business/trade",
                    name: "交易数据",
                    children: [
                        {
                            route: "/business/trade/home",
                            name: "总览"
                        }, {
                            route: "/business/trade/mcode",
                            name: "按门店查询"
                        }
                    ]
                }, {
                    route: "/business/profit",
                    name: "分润数据",
                    children: [
                        {
                            route: "/business/profit/home",
                            name: "总览"
                        }, {
                            route: "/business/profit/mcode",
                            name: "按门店查询"
                        }, {
                            route: "/business/profit/record",
                            name: "指定交易记录"
                        }

                    ]
                }, {
                    route: "/business/rewards",
                    name: "奖励数据"
                }, {
                    route: "/business/bill",
                    name: "账单"
                }, {
                    route: "/business/settle",
                    name: "结算"
                }, {
                    route: "/business/protocol",
                    name: "协议",
                    children: [{
                        route: "/business/protocol/sign",
                        name: "签约管理"
                    }, {
                        route: "/business/protocol/model",
                        name: "模板管理"
                    }, {
                        route: "/business/protocol/master",
                        name: "协议主体管理"
                    }]
                }
            ]
        }, {
            route: "system",
            name: "系统功能",
            children: [
                {
                    route: "/system/export",
                    name: "报表导出"
                }, {
                    route: "/system/pcalc",
                    name: "计算分润"
                }, {
                    route: "/system/notice",
                    name: "消息推送"
                }, {
                    route: "/system/detail",
                    name: "导出交易明细"
                }, {
                    route: "/system/sync",
                    name: "设备同步"
                }, {
                    route: "/system/package",
                    name: "套餐设置"

                }, {
                route: "/system/userams",
                name: "用户列表"
              }
            ]
        }]
        this.authMap={}
        this.actionMap={};
        //
        window.user=this;
        const cacheUser=getUserFromStore();
        if(cacheUser) this.setValue(cacheUser);
    }

    login(param) {
        // param.password = User.signPassword(param.username, param.password);
        return axios.post('/account/login', param).then(res=> {

            storeUserInfo(res);
            axios.defaults.headers['Access-Token']=res.token;

            this.info=res;
            this.logined=true;
            return res;
        })
    }

    cleanEmptyMenu(data=[]) {
        data.forEach(item=> {
            if(item.children&&item.children.length==0) {
                delete  item.children;
            } else {
                this.cleanEmptyMenu(item.children);
            }
        })
    }

    getBreadcrumbWithPath(paths) {
        if(!this.originMenus) return [];
        let parent=findParent(this.originMenus, paths.shift());
        if(!parent) return []

        function findParent(menus, path) {
            return menus.filter((item)=>item.res_url===path)[0];
        }

        let breadConf=[];
        breadConf.push({route: parent.route, label: parent.name});
        while(paths.length>0) {
            parent=findParent(parent.res_childs, paths.shift());
            if(!parent) break;
            breadConf.push({route: parent.route, label: parent.name});
        }
        return breadConf;
    }

    convertActionMap(menus, parent) {
        for(let i=0; i<menus.length; i++) {
            let menu=menus[i];
            if(menu.status!==undefined&&menu.status!=1)continue;
            let key=menu.res_url;
            key=key[0]==="/" ? key.slice(1) : key;
            if(menu.res_type=="Menu") {
                if(parent) {
                    key=parent.res_url+"/"+menu.res_url;
                    key=key[0]==="/" ? key.slice(1) : key;
                    menu.res_url=key;
                }
                this.authMap[key]=1;
            } else {
                this.actionMap[key]={
                    res_url: menu.res_url,
                    res_name: menu.res_name
                };
            }
            if(menu.res_childs.length>0) {
                this.convertActionMap(menu.res_childs, menu);
            }
        }
    }

    convertMenuKey(menus, parent) {
        for(let i=0; i<menus.length; i++) {
            let menu=menus[i];
            if(menu.status!==undefined&&menu.status!=1)continue;
            if(menu.res_type=="Action") {
                menus.splice(i, 1);
                i--;
                continue;
            }
            menu.name=menu.res_name;
            menu.route=menu.res_url;
            if(parent) {
                menu.route=parent.route+"/"+menu.res_url;
            }
            menu.id=menu.res_id;
            if(menu.res_childs&&menu.res_childs.length>0) {
                menu.children=menu.res_childs;
                this.convertMenuKey(menu.children, menu);
            }
        }
    }

    // 暂时这样做
    convertOrigin(menus, parent) {
        for(let i=0; i<menus.length; i++) {
            let menu=menus[i];
            if(menu.status!==undefined&&menu.status!=1)continue;

            menu.name=menu.res_name;
            menu.route=menu.res_url;
            if(parent) {
                menu.route=parent.route+"/"+menu.res_url;
            }
            menu.id=menu.res_id;
            if(menu.res_childs&&menu.res_childs.length>0) {
                menu.children=menu.res_childs;
                this.convertOrigin(menu.children, menu);
            }
        }
    }

    getFirstRouteByRoot(route) {
        if(!route)return null;
        route=route.replace(/^\//, '');
        for(let i=0; i<this.userMenus.length; i++) {
            let menu=this.userMenus[i];
            if(menu.route==route) {
                return findChild(menu);
            }
        }
        function findChild(r) {
            if(!r.children|| !r.children.length)return null;
            const first=r.children[0];
            if(first.children)return findChild(first);
            return first.route;
        }
    }

    toggleStatus(id, status) {
        Modal.confirm({
            title: "确认",
            content: "确认要"+(status==0 ? "解冻" : "冻结")+"该账户吗",
            onOk: ()=>
                axios.post(`account/${id}/status`, {
                    status: status==1?0:1
                }).then(()=> {
                    Table.getTableInstance().update();
                    message.success("操作成功")
                })
        });

    }

    setValue(data) {
        if(data) {
            this.logined=true;
            this.info=data;
            axios.defaults.headers['Access-Token']=data.token;
        }

    }

    static signPassword(username, password) {
        let hash=require("crypto").createHash("md5");
        hash.update(username+'/'+password);
        return hash.digest("hex");
    }

    getSecondMenus() {
        let secKey=location.hash.split("/")[1];
        for(let i=0; i<this.userMenus.length; i++) {
            let menu=this.userMenus[i];
            if(menu.route==secKey) {
                return menu.children;
            }
        }
    }

    logout() {
        this.logined=false;
        this.username=null;
        this.userid=null;
        this.real_name=null;
        this.menus=[];
        this.userMenus=null;
        this.authMap={};
        storeUserInfo(null);
    }
}
User.STORE_KEY='cashier_user';
function storeUserInfo(user) {
    if(user) {
        sessionStorage.setItem(User.STORE_KEY, window.JSON.stringify(user));
    } else {
        sessionStorage.removeItem(User.STORE_KEY);
    }
}
function getUserFromStore() {
    let user=sessionStorage.getItem(User.STORE_KEY);
    if(!user)return null;
    return window.JSON.parse(user);
}
const singleInstance=new User();
singleInstance.getClass=()=> {
    return User
};
export default singleInstance;
