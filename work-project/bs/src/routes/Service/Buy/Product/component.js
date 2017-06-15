/**
 *  created by yaojun on 2017/4/13
 *
 */
import React from "react";
import {Form,Radio,Input,Row,Col} from "antd";
import {Link} from "react-router"
import {SearchGroupBordered} from "../../../../components/SearchGroup";
import {CardTable,Table} from "../../../../common/Table";
import {amountFormat,cleanEmpty} from "../../../../util/helper"

import "./index.scss"

export default class Component extends React.Component {
    render() {
        let {children} =this.props;
        return (<div className="service-buy-product">
            {children}
            <div style={{display:children?"none":"block"}}>
            <SearchForm/>
            <CardTable rowKey={"product_code"} className={"margin-top-lg"} url="openApi/serviceProduct/get" renderContent={(data, tableInstance)=>{
                return <Row  gutter={24} className="product-items">{data.map(item=> {
                    return <Col key={item.product_code} lg={12} md={12} xl={8} sm={12} xs={24}>
                        <Link to={ `service/buy/product/add?id=${item.product_code}`} className="item common-simple-card">
                            <img src={decodeURIComponent(item.service_icon)}/>
                            <div className="right-content">
                                <div className="title text-ellipsis">【{item.service_name}】{item.product_name}</div>
                                <div className="desc text-ellipsis">{item.product_desc||"--"}</div>
                                <div className="danger">{amountFormat(item.product_market_price/100)}元{item.billing_unit?"/"+item.billing_unit:""}</div>
                            </div>
                        </Link>
                    </Col>
                })}</Row>
            }}/>
            </div>
        </div>)
    }
}

let form;
const SearchForm =Form.create(
    {
        onFieldsChange(obj,fields){

            console.log(obj)
               if(fields.service_type) {
                   let value=cleanEmpty(form.getFieldsValue());
                   CardTable.getTableInstance().reload(value);
               }

        }
     }

)(React.createClass({
    render(){
        let {getFieldDecorator} =this.props.form;
        form=this.props.form;
        return <Form onSubmit={(e)=>{
            e.preventDefault();
            let value= cleanEmpty(form.getFieldsValue());
            Table.getTableInstance().update(value);
        }
        }><SearchGroupBordered group={[{
            title:"服务类型",
            content:

                    <Form.Item>
                        {
                            getFieldDecorator("service_type",{
                                initialValue:""
                            })(<Radio.Group size="small">
                                <Radio.Button value="">（全部）</Radio.Button>
                                <Radio.Button value="1">基础类</Radio.Button>
                                <Radio.Button value="2">增值类</Radio.Button>
                                <Radio.Button value="3">通讯服务类</Radio.Button>
                            </Radio.Group>)
                        }
                    </Form.Item>
        },{
            title:"服务产品",
            content:<Form.Item>
                {
                    getFieldDecorator("keywords",{
                        initialValue:""
                    })(<Input placeholder="输入产品名称，按回车键搜索" style={{width:200}}/>)
                }
            </Form.Item>
        }]}/>
        </Form>
    }
}))