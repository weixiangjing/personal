/**
 *  created by yaojun on 16/12/19
 *
 */
import React from "react";
import {Card, Spin, Pagination,Row,Col,Popover} from "antd";
import {Link} from "react-router";
import {getTradeStatus, getTradeType} from "./util";
import {amountFormat, paginationOptions} from "../../util/helper";
import "./layout.scss";

let _size;
let type_class=['','#23ccfd',"#666","#666","#666","#ff6600","#666","#23ccfd","#666","#666"];
let status_class=['','text-shade','text-success','text-danger','text-danger','text-success','text-danger',]
export default class ListItem extends React.Component {
    render() {
        let List={}
        // ||
         List     =this.props.list//  [{"merchant_no":"848102370116005","trade_sub_type":0,"terminal_no":"00001187","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001788512017041300000005","trade_type":1,"trade_status":2,"order_amount":16300,"pay_mode_id":1006,"device_en":"2f2382bf","orig_trade_sdk_no":"","trade_id":867264,"create_time":"2017-04-13 23:59:14","trade_end_time":"2017-04-13 23:59:14","trade_amount":16300,"rate_change_type":"","actual_fee":98,"store_name":"","mcode":"178851","order_trade_no":"10001788512017041300000005","pay_channel_id":1078},{"merchant_no":"848100058126059","trade_sub_type":0,"terminal_no":"00000951","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001741662017041300000073","trade_type":1,"trade_status":2,"order_amount":35700,"pay_mode_id":1006,"device_en":"0f081e11","orig_trade_sdk_no":"","trade_id":865149,"create_time":"2017-04-13 23:57:17","trade_end_time":"2017-04-13 23:57:17","trade_amount":35700,"rate_change_type":"","actual_fee":214,"store_name":"","mcode":"174166","order_trade_no":"10001741662017041300000073","pay_channel_id":1078},{"merchant_no":"848332058136008","trade_sub_type":0,"terminal_no":"00001319","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001872592017041300000018","trade_type":1,"trade_status":2,"order_amount":60000,"pay_mode_id":1006,"device_en":"b4466f4f","orig_trade_sdk_no":"","trade_id":863931,"create_time":"2017-04-13 23:56:00","trade_end_time":"2017-04-13 23:56:01","trade_amount":60000,"rate_change_type":"","actual_fee":360,"store_name":"","mcode":"187259","order_trade_no":"10001872592017041300000018","pay_channel_id":1078},{"merchant_no":"848100058126056","trade_sub_type":0,"terminal_no":"00000959","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001741732017041300000083","trade_type":1,"trade_status":2,"order_amount":9100,"pay_mode_id":1006,"device_en":"094eefb7","orig_trade_sdk_no":"","trade_id":863098,"create_time":"2017-04-13 23:55:12","trade_end_time":"2017-04-13 23:55:13","trade_amount":9100,"rate_change_type":"","actual_fee":55,"store_name":"","mcode":"174173","order_trade_no":"10001741732017041300000083","pay_channel_id":1078},{"merchant_no":"848318057326001","trade_sub_type":0,"terminal_no":"00000637","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001713762017041300000004","trade_type":1,"trade_status":2,"order_amount":210000,"pay_mode_id":1006,"device_en":"fc630f03","orig_trade_sdk_no":"","trade_id":880358,"create_time":"2017-04-13 23:50:36","trade_end_time":"2017-04-13 23:50:36","trade_amount":210000,"rate_change_type":"","actual_fee":1260,"store_name":"","mcode":"171376","order_trade_no":"10001713762017041300000004","pay_channel_id":1078},{"merchant_no":"848588372986000","trade_sub_type":0,"terminal_no":"00001349","trade_mark":0,"actual_rate":"0.005","trade_sdk_no":"10001903292017041300000013","trade_type":1,"trade_status":2,"order_amount":38000,"pay_mode_id":1006,"device_en":"9541ff65","orig_trade_sdk_no":"","trade_id":878595,"create_time":"2017-04-13 23:48:42","trade_end_time":"2017-04-13 23:48:43","trade_amount":38000,"rate_change_type":"","actual_fee":190,"store_name":"","mcode":"190329","order_trade_no":"10001903292017041300000013","pay_channel_id":1078},{"merchant_no":"848588358136002","trade_sub_type":0,"terminal_no":"00001292","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001849752017041300000016","trade_type":1,"trade_status":2,"order_amount":30000,"pay_mode_id":1006,"device_en":"a1ed3b15","orig_trade_sdk_no":"","trade_id":877567,"create_time":"2017-04-13 23:47:45","trade_end_time":"2017-04-13 23:47:45","trade_amount":30000,"rate_change_type":"","actual_fee":180,"store_name":"","mcode":"184975","order_trade_no":"10001849752017041300000016","pay_channel_id":1078},{"merchant_no":"848337579116001","trade_sub_type":0,"terminal_no":"00001078","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001709882017041300000005","trade_type":1,"trade_status":2,"order_amount":93000,"pay_mode_id":1006,"device_en":"bc1ead32","orig_trade_sdk_no":"","trade_id":874605,"create_time":"2017-04-13 23:44:57","trade_end_time":"2017-04-13 23:44:57","trade_amount":93000,"rate_change_type":"","actual_fee":558,"store_name":"","mcode":"170988","order_trade_no":"10001709882017041300000005","pay_channel_id":1078},{"merchant_no":"848290058126320","trade_sub_type":0,"terminal_no":"00000072","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001655472017041300000127","trade_type":1,"trade_status":2,"order_amount":32200,"pay_mode_id":1006,"device_en":"39e514e2","orig_trade_sdk_no":"","trade_id":865558,"create_time":"2017-04-13 23:36:24","trade_end_time":"2017-04-13 23:36:24","trade_amount":32200,"rate_change_type":"","actual_fee":193,"store_name":"","mcode":"165547","order_trade_no":"10001655472017041300000127","pay_channel_id":1078},{"merchant_no":"848311058126010","trade_sub_type":0,"terminal_no":"00000672","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001717102017041300000010","trade_type":1,"trade_status":2,"order_amount":12000,"pay_mode_id":1006,"device_en":"5654547f","orig_trade_sdk_no":"","trade_id":862807,"create_time":"2017-04-13 23:33:57","trade_end_time":"2017-04-13 23:33:58","trade_amount":12000,"rate_change_type":"","actual_fee":72,"store_name":"","mcode":"171710","order_trade_no":"10001717102017041300000010","pay_channel_id":1078},{"merchant_no":"848290658126005","trade_sub_type":0,"terminal_no":"00001046","trade_mark":0,"actual_rate":"0.005","trade_sdk_no":"10001760302017041300000005","trade_type":1,"trade_status":2,"order_amount":24500,"pay_mode_id":1006,"device_en":"75f1523a","orig_trade_sdk_no":"","trade_id":860104,"create_time":"2017-04-13 23:30:53","trade_end_time":"2017-04-13 23:30:54","trade_amount":24500,"rate_change_type":"","actual_fee":123,"store_name":"","mcode":"176030","order_trade_no":"10001760302017041300000005","pay_channel_id":1078},{"merchant_no":"848311058126010","trade_sub_type":0,"terminal_no":"00000672","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001717102017041300000009","trade_type":1,"trade_status":2,"order_amount":115000,"pay_mode_id":1006,"device_en":"5654547f","orig_trade_sdk_no":"","trade_id":878918,"create_time":"2017-04-13 23:28:43","trade_end_time":"2017-04-13 23:28:44","trade_amount":115000,"rate_change_type":"","actual_fee":690,"store_name":"","mcode":"171710","order_trade_no":"10001717102017041300000009","pay_channel_id":1078},{"merchant_no":"848602053316021","trade_sub_type":0,"terminal_no":"00000027","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001668002017041300000008","trade_type":1,"trade_status":2,"order_amount":150000,"pay_mode_id":1006,"device_en":"daeb4e2f","orig_trade_sdk_no":"","trade_id":878240,"create_time":"2017-04-13 23:27:57","trade_end_time":"2017-04-13 23:27:57","trade_amount":150000,"rate_change_type":"","actual_fee":900,"store_name":"","mcode":"166800","order_trade_no":"10001668002017041300000008","pay_channel_id":1078},{"merchant_no":"848290058126320","trade_sub_type":0,"terminal_no":"00000072","trade_mark":0,"actual_rate":"0.005","trade_sdk_no":"10001655472017041300000123","trade_type":1,"trade_status":2,"order_amount":23400,"pay_mode_id":1006,"device_en":"39e514e2","orig_trade_sdk_no":"","trade_id":877662,"create_time":"2017-04-13 23:27:19","trade_end_time":"2017-04-13 23:27:19","trade_amount":23400,"rate_change_type":"","actual_fee":117,"store_name":"","mcode":"165547","order_trade_no":"10001655472017041300000123","pay_channel_id":1078},{"merchant_no":"848290658126005","trade_sub_type":0,"terminal_no":"00001046","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001760302017041300000004","trade_type":1,"trade_status":2,"order_amount":45400,"pay_mode_id":1006,"device_en":"75f1523a","orig_trade_sdk_no":"","trade_id":877251,"create_time":"2017-04-13 23:26:52","trade_end_time":"2017-04-13 23:26:53","trade_amount":45400,"rate_change_type":"","actual_fee":272,"store_name":"","mcode":"176030","order_trade_no":"10001760302017041300000004","pay_channel_id":1078},{"merchant_no":"848290058126320","trade_sub_type":0,"terminal_no":"00000072","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001655472017041300000122","trade_type":1,"trade_status":2,"order_amount":25000,"pay_mode_id":1006,"device_en":"39e514e2","orig_trade_sdk_no":"","trade_id":874618,"create_time":"2017-04-13 23:24:18","trade_end_time":"2017-04-13 23:24:18","trade_amount":25000,"rate_change_type":"","actual_fee":150,"store_name":"","mcode":"165547","order_trade_no":"10001655472017041300000122","pay_channel_id":1078},{"merchant_no":"848690072986000","trade_sub_type":0,"terminal_no":"00000117","trade_mark":0,"actual_rate":"0.005","trade_sdk_no":"10001691752017041300000009","trade_type":1,"trade_status":2,"order_amount":59800,"pay_mode_id":1006,"device_en":"b9382655","orig_trade_sdk_no":"","trade_id":873365,"create_time":"2017-04-13 23:23:09","trade_end_time":"2017-04-13 23:23:09","trade_amount":59800,"rate_change_type":"","actual_fee":299,"store_name":"","mcode":"169175","order_trade_no":"10001691752017041300000009","pay_channel_id":1078},{"merchant_no":"848290058126320","trade_sub_type":0,"terminal_no":"00000072","trade_mark":0,"actual_rate":"0.005","trade_sdk_no":"10001655472017041300000121","trade_type":1,"trade_status":2,"order_amount":10200,"pay_mode_id":1006,"device_en":"39e514e2","orig_trade_sdk_no":"","trade_id":871857,"create_time":"2017-04-13 23:21:53","trade_end_time":"2017-04-13 23:21:53","trade_amount":10200,"rate_change_type":"","actual_fee":51,"store_name":"","mcode":"165547","order_trade_no":"10001655472017041300000121","pay_channel_id":1078},{"merchant_no":"848100058126063","trade_sub_type":0,"terminal_no":"00000955","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001741702017041300000071","trade_type":1,"trade_status":2,"order_amount":31200,"pay_mode_id":1006,"device_en":"0fcb33b2","orig_trade_sdk_no":"","trade_id":869893,"create_time":"2017-04-13 23:19:50","trade_end_time":"2017-04-13 23:19:51","trade_amount":31200,"rate_change_type":"","actual_fee":187,"store_name":"","mcode":"174170","order_trade_no":"10001741702017041300000071","pay_channel_id":1078},{"merchant_no":"848602058126128","trade_sub_type":0,"terminal_no":"00001281","trade_mark":0,"actual_rate":"0.006","trade_sdk_no":"10001843012017041300000015","trade_type":1,"trade_status":2,"order_amount":34400,"pay_mode_id":1006,"device_en":"d0678b9b","orig_trade_sdk_no":"","trade_id":867007,"create_time":"2017-04-13 23:16:51","trade_end_time":"2017-04-13 23:16:51","trade_amount":34400,"rate_change_type":"","actual_fee":206,"store_name":"","mcode":"184301","order_trade_no":"10001843012017041300000015","pay_channel_id":1078}];
        let spinning = this.props.spinning;
        return (<Spin spinning={spinning || false}>{
            List.data.map((item) => {
                return (<Card key={item.trade_sdk_no} className="margin-top-lg search-card-item">
                    <Row className="search-list-item-card">
                        
                        <Col className="padding-right"  lg={4} md={4} sm={8} xs={12}>


                            <div className="text-ellipsis">
                                交易号
                                <Popover placement="topLeft" title="交易号" content={item.trade_sdk_no}>
                                <Link  to={`inquiry/advanced/detail?id=${item.trade_id}`}>{" "}{item.trade_sdk_no}</Link>
                                </Popover>
                            </div>
                            <div title={item.order_trade_no} className="text-ellipsis margin-top">
                                订单号 {item.order_trade_no}
                            </div>
                        </Col>
                        
                        <Col className="padding-h"  lg={3} md={3} sm={8} xs={12}>
                            <div className="text-shade">{item.trade_end_time.split(" ")[0]}</div>
                            <div className="margin-top text-shade">{item.trade_end_time.split(" ")[1]}</div>
                        </Col>
                        <Col  lg={4} md={4} sm={8} xs={12}>
                            <div title={item.store_name} className="text-grey text-ellipsis">{item.store_name||"--"}</div>
                            <div className="margin-top">
                                
                                <label className="label label-default">{item.mcode}</label>
                               <label style={{marginLeft:3,background:"#ececec"}} className="label label-default">{item.device_en}</label>
                            
                            
                            </div>
                        </Col>

                        <Col  lg={4} md={4} sm={8} xs={12}>
                            <div className="text-grey">{item.pay_channel_name||"--"}</div>
                            <div className="margin-top" >
                                <span style={{background:type_class[item.trade_type]}} className="text-ellipsis pull-left trade-type-label">{getTradeType(item.trade_type)}</span>
                                <span  className={`pull-right ${status_class[item.trade_status]}`}>{getTradeStatus(item.trade_status)}</span>
                            </div>
                        </Col>
                        <Col lg={3} md={3} sm={8} xs={12}>
                            <div className="text-shade">订单金额(元)</div>
                            <div className="font-md">{amountFormat(item.order_amount / 100)}</div>
                        </Col>
                        
                        <Col lg={3} md={3} sm={8} xs={12}>
                            <div className="text-shade">交易金额</div>
                            <div className="font-md">{amountFormat(item.trade_amount / 100)}</div>
                        </Col>
                        
                        <Col lg={3} md={3} sm={8} xs={12} >
                            <div className="text-shade">手续费</div>
                            <div className="font-md">{amountFormat(item.actual_fee/100)}</div>
                        </Col>

                    </Row>
                </Card>)
            })
        }
            
            <div className="over-hide text-center">
                {
                    List.total > 0 && <Pagination className="margin-top inline-block"  onChange={(pageNum)=>{
                        this.props.onChange({pageNum,pageSize:_size||20});
            
                    }
                    } onShowSizeChange={(pageNum,pageSize)=>{
                        this.props.onChange({pageNum,pageSize})
                        _size=pageSize;
            
                    }
                    }  {...paginationOptions(List.total,_size)}/>
                }
            </div>
           
        </Spin>)
    }
}

