

import {SelectBase} from "./base";

export default class TradeTypeSelect extends  SelectBase{
    getOptions(){
        return  [
            {label:"全部",value:""},
            {label:"商户联",value:"1"},
            {label:"持卡人联",value:"2"},
            {label:"银行存根联",value:"3"}]
    }
}