/**
 *  created by yaojun on 2017/3/13
 *
 */
import React from "react";
import {Table as AntTable, Pagination, Spin, Alert} from "antd";
import {paginationOptions, cleanEmpty,isEmptyObject} from "../../util/helper";
import axios from "axios";
// 表格分页
export class Table extends React.Component {
    static  propTypes = {
        // extends props
        params           : React.PropTypes.object,
        url              : React.PropTypes.string.isRequired,
        forceUpdate      : React.PropTypes.bool,// 每次都会刷新数据
        pageSize         : React.PropTypes.number,
        requiredProps    : React.PropTypes.array,
        requiredPropsOnly: React.PropTypes.object,
        // callback
        onLoad           : React.PropTypes.func,
        // return false 表示 终止请求
        onFetchBefore    : React.PropTypes.func,
        // from ant
        className      : React.PropTypes.string,
        rowKey         : React.PropTypes.string.isRequired,
        columns        : React.PropTypes.array.isRequired,
        rowSelection   : React.PropTypes.object,
        pageSizeOptions: React.PropTypes.array
    }
            state     = {
                loading : false,
                pageSize: this.props.pageSize || 20,
                pageNum : 1,
                columns : [],
                data    : [],
                total   : 0,
                errStr  : ''
            }

    componentWillReceiveProps(props) {
        if (props.forceUpdate) {
            this.fetch(undefined, props.params);
        }
    }

    componentWillMount() {
        this.fetch(undefined, this.props.params);
    }

    // 外部改变查询条件时触发，手动调用了
    update(params) {
        if(params ===true){
            this.fetch();
        }else{
            if(params){
                this.fetch(undefined,params)
            }else{
                this.fetch(undefined,this.requestParams);
            }
        }

    }

    // 索引 页显示数量发生改变时更新
    handleChange(obj, jump, sorter={}) {
        let orderBy = {};
        if (sorter.columnKey) {
            orderBy.order   = sorter.order === "descend" ? 2 : 1;
            orderBy.orderby = sorter.columnKey;
        }
        this.fetch({
            ...orderBy,
            pageSize: obj.pageSize,
            pageNum : obj.current
        }, Object.assign({},this.props.params,this.requestParams));
    }

    fetch(obj={pageSize: this.state.pageSize, pageNum: this.state.pageNum}, params = {}) {
        let url = this.props.url;
        let send = { ...cleanEmpty(params)};
        let required = this.props.requiredProps;
        let only = this.props.requiredPropsOnly;
        if (only) {
            let orgin  = true;
            let strArr = [];
            for (let key in only) {
                let value = send[key];
                if (value) {
                    orgin = false;
                }
                strArr.push(only[key])
            }
            if (orgin) {
                this.setState({errStr: strArr.join("，")})
                return;
            }
        }
        if (required) {
            required = required.filter(item => !!item);// 如果为undefined 或者"" ，则忽略
            for (let i = 0; i < required.length; i++) {
                let value = send[required[i]];
                if (value === undefined || value === "" || value === null) {
                    console.warn("Table Component ", url, "缺少必须参数【", required[i], '】', send);
                    return;
                }
            }
        }
        if (this.props.onFetchBefore) {
            let isFetch = this.props.onFetchBefore(send, this);
            if (!isFetch) return;
        }
        this.setState({loading: true});
        send={...cleanEmpty(params),...obj};
        this.requestParams=send;
        axios.post(url, send).then((res) => {

            this.setState({
                pageSize: obj.pageSize,
                pageNum : obj.pageNum,
                data    : res.data,
                total   : res.total,
                loading : false,
                errStr  : '',
                date:res.date
            }, () => {
                this.props.onLoad && this.props.onLoad(this.state)
            })
        })
    }

    render() {
        let {columns, rowKey, className, rowSelection, pageSizeOptions} =this.props;
        let {data, loading, total, pageSize, errStr}                    =this.state;
        let selection                                                   = {};
        if (rowSelection) {
            selection.rowSelection = rowSelection;
        }
        let type = errStr?"error":"info";
        return (

            <div>
                {data.length ? <AntTable columns={columns}
                                         dataSource={data}
                                         loading={loading}
                                         rowKey={rowKey}
                                         {...selection}
                                         className={className}
                                         onChange={(obj, sorter, a) => this.handleChange(obj, sorter, a)}
                                         pagination={paginationOptions(total, pageSize, undefined, undefined, undefined, pageSizeOptions)}/>
                    : <Alert description={errStr ? `缺少必须参数【${errStr}】至少输入一项。` : "未查询到符合条件的记录。"} type={type} showIcon/>}
            </div>

        )
    }
}
// 卡片分页
export class CardTable extends Table {
    static  propTypes = {
        // extends props
        params         : React.PropTypes.object,
        url            : React.PropTypes.string.isRequired,
        onLoad         : React.PropTypes.func,
        // from ant
        className      : React.PropTypes.string,
        rowKey         : React.PropTypes.string,
        columns        : React.PropTypes.array,
        pageSizeOptions: React.PropTypes.array,
        pageSize       : React.PropTypes.number,
        renderContent  : React.PropTypes.func.isRequired
    }

    render() {
        let {className, renderContent, pageSizeOptions}      =this.props;
        let {pageNum, pageSize, total, data, loading, errStr}=this.state;
        let type = errStr?"error":"info";


        return (
            <div className={className}>
                <Spin spinning={loading}>
                    {total===0&&<Alert description={errStr ? `缺少必须参数【${errStr}】至少输入一项。` : "未查询到符合条件的记录。"} type={type} showIcon/>}
                    {renderContent(data, this)}
                    {total>0 ? <div className="over-hide">
                            <Pagination current={pageNum}
                                        className="margin-v-lg"
                                        onShowSizeChange={(current, pageSize) => {
                                            this.handleChange({current, pageSize})
                                        }}
                                        onChange={(index) => {
                                            this.handleChange({
                                                current : index,
                                                pageSize: this.state.pageSize
                                            })
                                        }}   {...paginationOptions(total, pageSize, undefined, undefined, undefined, pageSizeOptions)}/>
                        </div> : ''}
                </Spin>
            </div>
        )
    }
}
