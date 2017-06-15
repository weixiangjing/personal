

import {SelectBase} from "./base";

export default class TradeTypeSelect extends  SelectBase{
    getOptions(){
        return   [
            {label:"全部",value:""},
            {label:"消费",value:"1"},
            {label:"消费撤销",value:"2"},
            {label:"退款",value:"3"},
            {label:"预授权",value:"5"},
            {label:"预授权撤销",value:"6"},
            {label:"预授权完成",value:"7"},
            {label:"预授权完成撤销",value:"9"}]
    }
}