/**
 *  created by yaojun on 17/1/12
 *
 */
import React from "react";
import {Form,Checkbox,Button} from "antd";
import {echoWorkable,selectWork,submitWorks,selectAll} from "./reducer";
const FormItem = Form.Item;
export default class Channel extends React.Component {
    componentWillMount() {
        echoWorkable();
    }
    
    render() {
        let group = this.props.store;
      console.log(group.toJS())
        return (
            <div className="channel-workable">
                {
                    group.map((item,index) => (
                        <div className="workable-item">
                            <div className="item-title">{item.get('title')} <Checkbox style={{margin:'0 24px'}} checked={item.get("checked")}  onChange={(e)=>{
                                selectAll(index,e.target.checked)
                            }}>全选</Checkbox></div>
                            <div className="item-attr">
                                {
                                    item.get('items').map((item,i) => (
                                        <Checkbox checked={item.get('checked')}  onChange={({target})=>{
                                           selectWork(target.checked,target.name,index,i);
                                        }}  >{item.get('attr_name')}</Checkbox>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
                
                
                
            </div>
        )
    }
}