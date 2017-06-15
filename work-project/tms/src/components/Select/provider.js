

import {SelectBase} from "./base";
import {getProvider} from "../../model/PayProvider";
/**
 * @description
 * @class ProviderSelect
 */
export default class ProviderSelect extends SelectBase{
    getOptions(){
        getProvider({status:1}).then(({data})=>data.map(item=>({label:item.pay_sp_name,value:item.pay_sp_id}))).then(r=>this.setState({options:r}));
        return [];
    }
}