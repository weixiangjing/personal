import axios from 'axios';
import user from "../../../../model/User";
const crypto =require('crypto');
const Immutable                 = require('immutable');

export const handler           = {}
export const initialState       = ()=>{
    return Immutable.fromJS({
        step:0,
        item:{},
        account:{},
        password:"",
        list:[],
        refresh:false
    });
}
/**
 * 获取订单产品详情
 * @param id
 */
export function getOrderDetail(id) {

    axios.post("openApi/serviceBill/getDetail",{
        order_no:id
    }).then(res=>{
        axios.post("openApi/serviceBill/getList",{
            order_no:id
        }).then(resp=>{
            let info =resp.data[0];
            let detail =res.data[0];

            let item =Object.assign({},info,detail);
            handler.$update("item",Immutable.fromJS(item),"list",Immutable.List(res.data));
        })
    });
}


export function pay(id){
  
    let pay_pwd=exports.state.get("password");
    let account_no=exports.state.get("account").get("account_no");
    let password =`${account_no}/${pay_pwd}`;
    let md5 = crypto.createHash("md5");
        md5.update(password);
     let pwd=md5.digest("hex");
    axios.post("openApi/serviceBill/payBill",{
        order_no:id,
        account_no,
        pay_pwd:pwd.toUpperCase()
    }).then(res=>{
       handler.$update("step",2);
       getAccountInfo()
    })
}
export function getAccountInfo(){
    handler.$update("refresh",true)
    axios.post("openApi/serviceAccount/get",{
        bind_customer_no:user.userId
    }).then(res=>{
            handler.$update("account",Immutable.Map(res.data[0]),"refresh",false)
    })
}