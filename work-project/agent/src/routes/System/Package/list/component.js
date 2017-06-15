/**
 *  created by yaojun on 17/2/22
 *
 */
import React from "react";
import {Table} from "antd";
import {Link} from "react-router";
import {paginationOptions} from "../../../../util/helper";
import {echoPackages} from "./reducer";
export default class Brand extends React.Component {
    componentWillMount() {
        echoPackages()
    }
    
    render() {
        if (this.props.children) return this.props.children;
        const columns = [
            {
                title    : "ID",
                dataIndex: "commissionPackageId"
            }, {
                title    : "名称",
                dataIndex: "packageName"
            }, {
                title    : "添加日期",
                dataIndex: "addTime"
            }, {
                title    : "修改日期",
                dataIndex: "updateTime"
            }, {
                title : "操作",
                render: (c, v) => {
                    return (
                        <span>
                        <Link to={`/system/package/detail?id=${v.commissionPackageId}&n=${v.packageName}`}>详情</Link>
                        <Link className="margin-h"
                              to={`/system/package/addOrUpdate?id=${v.commissionPackageId}&name=${v.packageName}`}>修改</Link>
                        <a>删除</a>
                        
                    </span>)
                }
            }
        ]
        let store    = this.storeState;
        let packages = store.get("packages").toJS();
        let total    = store.get("total");
        let size     = store.get("size");
        let loading  = store.get("loading")
        return (<div>
            <div className="padding-v over-hide">
                
                <Link to={`/system/package/addOrUpdate`} className="pull-right  ant-btn">新建套餐</Link>
            
            </div>
            <Table rowKey={"commissionPackageId"} loading={loading} onChange={(obj) => {
                console.log(obj)
                echoPackages({pageSize: obj.pageSize, pageNum: obj.current});
            }} pagination={paginationOptions(total, size)} columns={columns} dataSource={packages}/>
        
        </div>);
    }
}

    

