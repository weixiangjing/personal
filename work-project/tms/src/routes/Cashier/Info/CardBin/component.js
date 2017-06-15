/**
 *  created by yaojun on 16/12/13
 *
 */
import React from 'react';
import {Form,Radio,Input, Icon, Button,Select,Upload,message,Modal,Row,Col} from 'antd';

import {SearchGroupBorder, SearchItemWithRadio,SearchItemWithInput} from "../../../../components/SearchGroupBorder";
import "./index.scss"
import {toggleLoadingWithPath,exportCards,toggleDetailModal} from "./reducer";

import {CASHIER_CARD_BIN_UPLOAD,CASHIER_CARD_BIN_EXPORT} from "../../../../config/auth_func";
import {Auth} from "../../../../components/ActionWithAuth";
import {SearchGroupBordered} from "../../../../components/SearchGroup";

import {Table} from "../../../../components/Table";
import {amountFormat,showTaskModal} from "../../../../util/helper"

import {getApi} from "../../../../config/api";
let gTemBins={"1.1":"quankabin.xls","1.2":"quankabin.xls","3.1":"xiaoemianqian.xls","3.2":"xiaoemianqian.xls"}
let gForm;
let gCardClass="1.2"

const CardTypes=["借记卡","贷记卡","预付费卡"];
export default class CardBin extends React.Component{
    state={change:0}
   
    render(){
        
        
        const columns = [{
            title: '卡BIN',
            render:(a,col)=><a onClick={()=>toggleDetailModal(col)}>{col.card_bin}</a>,
            width: 100,
        },{
            title: '卡BIN位数',
            dataIndex: 'card_bin_len',
            width: 80,
        }, {
            title: '卡号位数',
            dataIndex: 'card_len',
            width:100
        }, {
            title: '卡类型',
            width:100,
            render:(a,col)=>(<span>{CardTypes[col.card_type-1]}</span>)
        },{
            title: '发卡银行',
            dataIndex: 'bank_name',
        }, {
            title: '银行卡名称',
            dataIndex: 'card_name'
        },
            {
                title: '最近更新时间',
                dataIndex: 'update_time'
            }
        ];
        
        let store =this.storeState;
        let list =store.get("list");
        let loading =store.get("loading");
        let total =store.get("total");
        let pageSize = store.get("pageSize")
        let modalItem =store.get("detailItem");
        if(list.toJS){
            list=list.toJS()
        }
        
        return ( <div  >
            <CardBinForm store={store}/>
            <Modal width={680} className="card-bin-item-detail" title={"卡BIN详情"} onOk={()=>toggleDetailModal()}  onCancel={()=>toggleDetailModal()} visible={modalItem.size>0}>
                <Row >
                    <Col span={12}><label>卡BIN:</label>{modalItem.get("card_bin")}</Col>
                    <Col span={12}><label>卡BIN位数:</label>{modalItem.get("card_bin_len")}</Col>
                    <Col span={12}><label>卡号位数:</label>{modalItem.get("card_len")}</Col>
                    <Col span={12}><label>卡类型:</label>{CardTypes[modalItem.get("card_type")-1]}</Col>
                    <Col span={12}><label>发卡银行:</label>{modalItem.get("bank_name")}</Col>
                    <Col span={12}><label>银行卡名称:</label>{modalItem.get("card_name")}</Col>
                    <Col span={12}><label>最近更新时间:</label>{modalItem.get("update_time")||"--"}</Col>
                    <Col span={12}><label>创建时间:</label>{modalItem.get("create_time")}</Col>
                    <Col span={12}><label>免密支持:</label>{modalItem.get("is_free_pwd")==1?"是":"否"}</Col>
                    <Col span={12}><label>免签支持:</label>{modalItem.get("is_free_sign")==1?"是":"否"}</Col>
                    <Col span={12}><label>免密免签额度上限:</label>{amountFormat(modalItem.get("amount_max")/100)}</Col>
                    <Col span={12}><label>银联国际（UPI）卡:</label>{modalItem.get("card_class")==2?"是":"否"}</Col>
                </Row>
            </Modal>
            <Table
                extra={<div>
                    <Auth to={CASHIER_CARD_BIN_EXPORT}>
                        <Button className={"pull-right"} onClick={()=>{exportCards(Object.assign({},gForm.getFieldsValue(),{"export":1}))}}>
                            <Icon type="download"/>导出</Button>
                    </Auth>
                    <Auth to={CASHIER_CARD_BIN_UPLOAD}>
                        <Upload
            
                            action={getApi("cardBin/upload")}
                            name={"fileData"}
                            data={function (file) {
                                let type=gCardClass.split(".");
                                return {
                                    dataType:type[0],
                                    incrUpdate:type[1],
                                    fileName:file.name
                                }
                            }}
                            beforeUpload={function (file,a) {
                                toggleLoadingWithPath("upload",true)
                            }}
                            onChange={({file})=>{
                                if(file.status==="done"){
                                    if(file.response.code!="0"){
                                        message.error(file.response.msg,4);
                                    }else{
                                        message.success("上传成功");
                                        showTaskModal(1);
                                        
                                    }
                                    toggleLoadingWithPath("upload",false);
                                }
                            }}
                            showUploadList={false}
                            className="pull-right">
            
                            <Button className={"margin-right"}>
                                <Icon type={loading.get("upload")?"loading":"upload"}/>
                                导入
                            </Button>
                        </Upload>
        
        
        
                        <span style={{marginRight:3}} className="margin-left-lg inline-input-group input-size-xs pull-right">
                      
                    
                            <Select style={{width:135}} defaultValue={"1.2"} onChange={(e)=>{
                                gCardClass=e;
                                this.setState({change:this.state.change+1})
                            } } placeholder="卡类型">
                                <Select.Option value={"1.2"}>全卡BIN（增量）</Select.Option>
                                <Select.Option value={"3.1"}>小额免密（全量）</Select.Option>
                                <Select.Option value={"3.2"}>小额免密（增量）</Select.Option>
                            </Select>
                    
                </span>
                    </Auth>
                        <a className="pull-right vertical-middle" target="_blank"  href={"/"+gTemBins[gCardClass]}>[下载模板]</a>
    
                 
                </div>}
                url="cardBin/query"
                rowKey={"id"}
                className={'cards-records'}
                columns={columns}  />
        </div>)
    }
}


const CardBinForm=Form.create({
    onFieldsChange(props,field){
       let type =field.card_type;
       let attr =field.ext_attr;
       if(type||attr){
           Table.getTableInstance().reload(gForm.getFieldsValue());
       }
    }
})(React.createClass({
    update(){
      Table.getTableInstance().reload(this.props.form.getFieldsValue())
    },
    render(){
        let {getFieldDecorator} =this.props.form;
        let store =this.props.store;
        let loading =store.get("loading");
        gForm=this.props.form;
        
        return (<div>
    
            <SearchGroupBordered  group={[
                
                {
                    title:"卡类型",
                    content:<div>{getFieldDecorator("card_type",{
                        initialValue:""
                    })(<Radio.Group size="small">
                        <Radio.Button value="">（全部）</Radio.Button>
                        <Radio.Button value="1">借记卡</Radio.Button>
                        <Radio.Button value="2">贷记卡</Radio.Button>
                        <Radio.Button value="3">预付费卡</Radio.Button>
                        <Radio.Button value="4">准贷记卡</Radio.Button>

                    </Radio.Group>)}
                    </div>
                },{
                    title:"特殊属性",
                    content:<div>{getFieldDecorator("ext_attr",{
                        initialValue:""
                    })(<Radio.Group size="small">
                        <Radio.Button value="">（全部）</Radio.Button>
                        <Radio.Button value="1">银联国际（UPI）卡</Radio.Button>
                        <Radio.Button value="2">免密支持</Radio.Button>
                        <Radio.Button value="3">免签支持</Radio.Button>
        
                    </Radio.Group>)}
                    </div>
                },{
                    title:"卡BIN",
                    content:<div>
                        
                        <Form.Item style={{width:200}}>
                        {
                            getFieldDecorator("card_bin")(<Input onPressEnter={()=>this.update()} placeholder="精确查找"/>)
                        }
                        </Form.Item>
                        <Form.Item wrapperCol={{span:14}} labelCol={{span:8}} style={{width:300}} label="按关键字查找">
                        {
                            getFieldDecorator("keywords")(<Input onPressEnter={()=>this.update()} placeholder="发卡银行名称/卡片名称"/>)
                        }
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={()=>this.update()} type="primary">搜索</Button>
                        </Form.Item>

                    </div>
                }
            ]}>
                
            </SearchGroupBordered>
           
    
           
        </div>)
    }
}));