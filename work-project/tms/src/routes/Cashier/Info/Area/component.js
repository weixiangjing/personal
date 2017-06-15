/**
 *  created by yaojun on 16/12/13
 *
 */
import React from 'react';
import {Form, Radio, Input, Icon, Button,Select,Upload,message} from 'antd';

import {echoArea,echoAreaWithFirstLevel,closeUploading} from "./reducer";
import {paginationOptions,showTaskModal} from "../../../../util/helper";
import {CASHIER_AREA_UPLOAD} from "../../../../config/auth_func";
import {Auth} from "../../../../components/ActionWithAuth";
import {Table} from "../../../../components/Table";

import {getApi} from "../../../../config/api";
export default class Area extends React.Component{
    componentWillMount(){
        echoArea();
        
    }
    render(){
        return  (<CardBinForm store={this.storeState}/>);
    }
}

const CardBinForm = Form.create({
    onFieldsChange(A,field){
        let type =field.parent_area_code;
        if(type){
            echoArea({parent_area_code:type.value})
        }
    }
})(React.createClass({
    update(){
      Table.getTableInstance().reload(this.props.form.getFieldsValue());
    },
    render(){
        let {getFieldDecorator,getFieldsValue} = this.props.form;
    
        const columns = [{
            title: '行政编码',
            dataIndex: 'area_code'
          
        },{
            title:"上级行政编码",
            render:(value,col)=>(col.parent_area_code==1?"--":col.parent_area_code)
        }
        , {
            title: '地区名称',
            dataIndex: 'area_name'
          
        }, {
            title: '创建时间',
            dataIndex: 'create_time'
        }

        ];
    
       let store =this.props.store;
        let items = store.get("items");
        let list =store.get("list");
            list =list.toJS?list.toJS():list;
            items=items.toJS?items.toJS():items;
            let total =store.get("total");
            let loading =store.get("loading");
            let province= store.get("province");
            let uploading=store.get("uploading");
            let pageSize =store.get("pageSize");
     
        return ( <div  >
    
    
            <div className="over-hide margin-bottom-lg">
                    <span className="inline-input-group input-size-sm">
                        <label>行政编码</label>
                        {
                            getFieldDecorator('area_code')(
                                <Input onPressEnter={()=>{this.update()}} placeholder="精确匹配"/>
                            )
                        }
                    </span>
                <span className="inline-input-group input-size-sm margin-left-lg">
                        <label>名称</label>
                    {
                        getFieldDecorator('area_name')(
                            <Input onPressEnter={()=>{this.update()}} />
                        )
                    }
                    </span>
    
    
    
                <Button type={"primary"} className={"margin-left-lg"} onClick={()=>this.update()}>搜索</Button>
    
           
                
                
                
            
            </div>
    
            <Table
                extra={ <Auth to={CASHIER_AREA_UPLOAD}>
    
                    <Upload
                        name={"fileData"}
                        action={getApi("area/upload")}
                        data={function (file) {
                            return {
                                fileName:file.name
                            }
                        }}
                        beforeUpload={()=>{
                            closeUploading(true)
                        }}
                        onChange={({file})=>{
                            if(file.status==="done"){
                                closeUploading(false);
                                if(file.response.code==0){
                                    showTaskModal();
                                }else{
                                    message.error(file.response.msg);
                                }
                            }
                        }}
                        showUploadList={false}
                        className="pull-right">
                        <Button>
                            <Icon type={uploading?"loading":"upload"}/>
                            导入
                        </Button>
                        <span className="text margin-left text-bottom">* 请选择国家行政区划的Excel表</span>
                    </Upload>
                </Auth>}
                url="area/query"
                pageSize={10}
                rowKey={"area_code"} className={'cards-records'}
                columns={columns} />
        </div>)
    }
}))