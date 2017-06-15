const conf={}
const env= require("./env");
// prod
if(env.PROD){
    // 商户平台
    conf.MERCHANT_JUMP_URL="http://mp.wangpos.com/wmp/account/userIndex";
    // 充值
    conf.RECHARGE_JUMP_URL="http://h5.market.chinafintech.com.cn/recharge/index.html"
   
}else{
    
    conf.MERCHANT_JUMP_URL="http://18.weipass.cn/wmp/account/userIndex";
    conf.RECHARGE_JUMP_URL="http://h5.market.chinafintech.com.cn/recharge/index.html"
}
module.exports=conf;