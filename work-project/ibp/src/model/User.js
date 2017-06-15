'use strict';
const Storage = sessionStorage;
const EventEmitter = require('wolfy87-eventemitter');
import axios from 'axios';
import Immutable from 'immutable';

export class User {
    constructor(storeKey) {
        this.storeKey = storeKey;
        this.Map = this.getInitialMap();
        this.setAll(this.getDataFromStore());
        this.event = new EventEmitter();
    }

    getInitialMap() {
        return {
            email: null,
            last_login_time: null,
            real_name: null,
            role_name: null,
            status: null,
            tel_phone: null,
            user_id: null,
            username: null,
            avatar: '/img/avatar.png',
            menus: [],
            res_ids: [],
            actionMap: {},
            authMap: {},
            menuMap: {}
        };
    }

    storeData(data) {
        if (null === data) {
            Storage.removeItem(this.storeKey);
        } else {
            Storage.setItem(this.storeKey, window.JSON.stringify(data));
        }
    }

    getDataFromStore() {
        console.log('get user from storage', this.storeKey);
        let user = Storage.getItem(this.storeKey);
        if (!user)return null;
        return window.JSON.parse(user);
    }

    login(params) {
        params.password = signPassword(params.username, params.password);
        return axios.post('/user/UserLogin', params).then(res => {
            let data = res.data[0];
            const userInfo = data.userMap;
            this.set('email', userInfo['email']);
            this.set('last_login_time', userInfo['last_login_time']);
            this.set('real_name', userInfo['real_name']);
            this.set('role_name', userInfo['role_name']);
            this.set('status', userInfo['status']);
            this.set('tel_phone', userInfo['tel_phone']);
            this.set('user_id', userInfo['user_id']);
            this.set('username', userInfo['username']);
            this.set('menus', data['userMenus'] || []);
            const menus = this.get('menus'),
                im = Immutable.fromJS(menus);
            this.convertMenuKey(menus);
            this.convertActionMap(im.toJS());
            this.pushResIds(im.toJS());
            this.storeData(this.Map);
            this.event.emitEvent('login');
            return data;
        });
    }
  pushResIds(menus){
    const res_ids = this.get('res_ids');
    for (let i = 0; i < menus.length; i++) {
      let menu = menus[i];
      res_ids.push(menu.res_id)
      if (menu.res_childs) {
        this.pushResIds(menu.res_childs);
      }
    }
    this.set('res_ids',res_ids);
  }
    convertMenuKey(menus, parent) {
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            if (menu.status !== undefined && menu.status != 1)continue;
            if (menu.res_type == "Action") {
                menus.splice(i, 1);
                i--;
                continue;
            }
            menu.name  = menu.res_name;
            menu.route = menu.res_url;
            menu.icon = menu.icon_url;
            if (parent) {
                menu.route = parent.route + "/" + menu.res_url;
            }
            menu.id = menu.res_id || Date.now();
            if (menu.res_childs) {
                menu.children = menu.res_childs;
                delete menu.res_childs;
                this.convertMenuKey(menu.children, menu);
            }
        }
    }

    convertActionMap(menus, parent) {
        const menuMap = this.get('menuMap'),authMap = this.get('authMap'), actionMap = this.get('actionMap');
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            if (menu.status !== undefined && menu.status != 1)continue;
            let key = menu.res_url;
            key = key[0] === "/" ? key.slice(1) : key;
            if (menu.res_type == "Menu") {
                if (parent) {
                    key = parent.res_url + "/" + menu.res_url;
                    key = key[0] === "/" ? key.slice(1) : key;
                    menu.res_url = key;
                }
                authMap[key] = 1;
            } else {
                if (parent) {
                    key = parent.res_url + "/" + menu.res_url;
                    key = key[0] === "/" ? key.slice(1) : key;
                    menu.res_url = key;
                }
                actionMap[key] = {
                    res_url: key,
                    res_name: menu.res_name
                };
            }
            menuMap[key] = {
                res_url: key,
                res_name: menu.res_name
            };
            if (menu.res_childs.length > 0) {
                this.convertActionMap(menu.res_childs, menu);
            }
        }
        this.set('menuMap', menuMap);
        this.set('authMap', authMap);
        this.set('actionMap', actionMap)
    }

    logout() {
        this.storeData(null);
        this.Map = this.getInitialMap();
        this.event.emitEvent('logout');
    }

    get logged() {
        return !!(this.get('user_id'));
    }

    set(key, value) {
        this.Map[key] = value;
    }

    get(key) {
        return this.Map[key];
    }

    setAll(attrs) {
        if (!attrs)return;
        Object.assign(this.Map, attrs);
    }

    getAll() {
        return this.Map;
    }
}

function signPassword(username, password) {
    let hash = require("crypto").createHash("md5");
    hash.update(username + '/' + password);
    return hash.digest("hex");
}

export default new User('aisom-user');
