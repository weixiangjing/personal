
import {CascaderBase} from "./base";
import axios from "axios";

export default class AddressSelect extends CascaderBase{
    getOptions(){
        axios.get("basic/address").then(res=>{
            let options =[];
            convertOptions(res,options);
            this.setState({options});
        })
        return [];
    }
}

function convertOptions(array=[],options=[]){
    for(let i=0;i<array.length;i++){
        let item = array[i];
        let option ={}
        if(item.name){
            if(!item.children)item.children=[]
            option.label=item.name;
            option.value=item.name;
            option.children=[];
            options.push(option);
            convertOptions(item.city||item.county,option.children);
        }else{
            option.label=item;
            option.value=item;
            options.push(option);
        }
        
    }
}