/**
 *  created by yaojun on 2017/4/12
 *
 */
import React from "react";
import "./index.scss";
import {SHOW_SEARCH_GROUP_LABEL_COLON} from "../../config/config";
export class SearchGroupBordered extends React.Component {
    render() {
        let {group=[]}=this.props;
        return (
            <div className="search-group-bordered">
                {
                    group.map(item=> {
                        return <div key={item.title} className="row-item">
                            <label className="col-item">{item.title}{SHOW_SEARCH_GROUP_LABEL_COLON&&":"}</label>
                            <div className="col-item">{item.content}</div>
                        </div>
                    })
                }
            </div>
        )
    }
}