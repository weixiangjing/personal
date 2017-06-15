'use strict'
import axios from 'axios';
import User from './User';
const STORE_KEY = 'uop_user_operator';

class Operator extends User{
    constructor (){
        super(STORE_KEY);
    }
    getInitialMap(){
        return {
            username: null,
            password: null,
            name:null,
            phone: null,
            createTime: null,
            email: null,
            systems: [],
            status: 0,
            userId: null,
            avatar:'/img/operator-default-avatar.png'
        }
    }
    _applyAttrs(userData){
        this.set('username',userData['login_account']);
        this.set('userId',userData['user_id']);
        this.set('name',userData['name']);
        this.set('status',userData['status']);
        this.set('systems',userData['outerSystems']);
        this.set('email',userData['email']);
        this.set('createTime',userData['create_time']);
        this.set('phone',userData['contact_phone']);
        if(userData['avatar'])this.set('avatar',userData['avatar']);
        this.storeData(this.Map);
    }
    login(params){
        return axios.post('user/userLogin',params).then(res=>{
            this.set('password',params['login_pwd']);
            this._applyAttrs(res.data[0]);
            this.event.emitEvent('login');
            return res;
        });
    }
    logout(logoutByHttp){
        if(logoutByHttp === true){
            return axios.post('user/loginOut').then(res=>{
                super.logout();
                return res;
            });
        }else {
            return new Promise((resolve,reject)=>{
                try{
                    super.logout();
                    resolve();
                }catch (e){
                    reject(e);
                }
            })
        }
    }
    syncInfo(){
        console.log('sync user info');
        return axios.post('user/getUserInfo').then(res=>{
            const user = res.data[0];
            if(!this.logged){
                this._applyAttrs(user);
                this.event.emitEvent('login');
            }
            return user;
        });
    }
}

export default new Operator()