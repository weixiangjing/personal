'use strict'
import axios from 'axios';
import User from './User';
const STORE_KEY = 'uop_user_admin';

class Admin extends User{
    constructor (){
        super(STORE_KEY);
    }
    getInitialMap(){
        return {
            userId: null,
            avatar:'/img/admin-default-avatar.png',
          name:"超级管理员",
          logined:false
        }
    }
    login(params){
        return axios.post('user/adminLogin',params).then(res=>{
            this.set("logined",true);
            this.set('userId',res.data[0].user_id);
            this.storeData(this.Map);
            return res;
        });
    }
  get logged(){
    return this.get("logined");
  }
  logout(){
    super.logout();
  }
}

export default new Admin()
