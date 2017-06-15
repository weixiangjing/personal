"use strict";
import axios from "axios";
class User {
    constructor() {
        this.logined   =false;
        window.user    =this;
        const cacheUser=getUserFromStore();
        if(cacheUser) this.setValue(cacheUser);
    }



    loginWithToken(token) {
        return axios.post("openApi/serviceAccount/login", {user_access_token: token}).then(res=> {
            let data=res.data[0];
          return axios.post('openApi/serviceAccount/get',{bind_customer_no:data.service_user_id}).then((res1)=>{
            const account_no=res1.data[0].account_no;
            data={...data,account_no:account_no,token}
            storeUserInfo(data);
            this.setValue(data);
            return data;
          })
        })
    }

    login(param) {
        param.password=User.signPassword(param.username, param.password);
        return axios.post('openApi/serviceAccount/login', param).then(res=> {
            let data=res.data[0];
          storeUserInfo(data);
          this.setValue(data);
          return data;
        })
    }
    newUpdate(no){
      this.account_no=no;
    }
    setValue(data) {
        this.userName=data.service_user_name;
        this.userId  =data.service_user_id;
        this.account_no  =data.account_no;
        this.phone=data.userPhone;
        this.token=data.token;
        this.logined =true;
    }

    static signPassword(username, password) {
        let hash=require("crypto").createHash("md5");
        hash.update(username+'/'+password);
        return hash.digest("hex");
    }

    logout() {
        this.logined=false;
        this.setValue({});
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
const singleInstance   =new User();
singleInstance.getClass=()=> {
    return User
};
export default singleInstance;
