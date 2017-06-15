/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {Card, Row, Col, Icon, Button, Popconfirm} from "antd";
import {getValueWithKey} from "../../../../config/pay_plugin_config";
import ADDPluginForm from "./addPluginForm";
import {CASHIER_PLUGIN_ADD, CASHIER_PLUGIN_DELETE, CASHIER_PLUGIN_UPDATE} from "../../../../config/auth_func";
import {Auth} from "../../../../components/ActionWithAuth";
import {echoPlugins, editPlugin, addPlugin, deletePlugin} from "./reducer";
import "./layout.scss";
export default class Plugin extends React.Component {
    componentWillMount() {
        echoPlugins(this.props.location.query.id);
    }

    saveForm(form) {
        this.editorForm=form;
    }

    render() {
        let plugins       =this.storeState.get('plugins');
        let modal         =this.storeState.get("modal");
        let visible       =this.storeState.get("visible");
        let {id, name}    =this.props.location.query;
        let confirmLoading=this.storeState.get("confirmLoading");
        return (

            <div className="cashier-plugin">

                <div className="plugin-title"><Button className={"title-btn"} onClick={()=> {
                    this.props.router.go(-1)
                }}>返回列表</Button><span className="title">({id}) {`${name} 通道插件 `} </span>


                </div>
                <Row className={"card-group"} gutter={15}>
                    {
                        plugins.map((item, index)=> {
                            let title=`SDK ${getValueWithKey(item.get("trade_sdk_version"))}`
                            return (
                                <Col key={item.get("pay_plugin_id")} md={12} sm={24} xs={24}>
                                    <Card title={title} extra={
                                        <span className="card-action">
                                                           <Auth to={CASHIER_PLUGIN_UPDATE}>
                                                               <Icon type="edit"
                                                                     onClick={()=>editPlugin(item.set("_title",title), this.editorForm)}/></Auth>
                                                           <Auth to={CASHIER_PLUGIN_DELETE}>
                                               <Popconfirm title="确认删除该插件吗？"
                                                           onConfirm={()=>deletePlugin(id, item, index)}>
                                                     <Icon type="delete"/>
                                               </Popconfirm>
                                                           </Auth>
                  
                        </span>
                                    }>
                                        <div className="p-item">
                                            <label className="pt-title">{"业务接入号:"}</label>
                                            <label className="pt-txt">{item.get("biz_no")}</label>
                                        </div>
                                        <div className="p-item">
                                            <label className="pt-title">{"主密钥索引号:"}</label>
                                            <label className="pt-txt">{item.get("master_key")}</label>
                                        </div>
                                        <div className="p-item">
                                            <label className="pt-title">{"插件包名:"}</label>
                                            <label className="pt-txt">{item.get("package_name")}</label>
                                        </div>
                                        <div className="p-item">
                                            <label className="pt-title">{"插件启动类:"}</label>
                                            <label className="pt-txt">{item.get("run_main_class")}</label>
                                        </div>
                                    </Card>
                                </Col> )
                        }).toArray()
                    }
                  
                    <Col className="add-icon" md={12} sm={24} xs={24}>
                        <Auth replace to={CASHIER_PLUGIN_ADD}>
                        <div>
                      

                            <Icon onClick={()=> {
                                addPlugin(this.editorForm);
                            }} type="plus"/>

                      
                        </div>
                        </Auth>
                    </Col>
                  

                </Row>
                <ADDPluginForm id={id} visible={visible} modal={modal} confirmLoading={confirmLoading}
                               ref={this.saveForm.bind(this)}/>
            </div>
        );
    }
}
   

    

