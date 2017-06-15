import React from 'react';
import {Modal, Form, Input, Select,Switch,Row,Col,Tree,Radio} from 'antd';
import JSONTree from 'react-json-tree'

const ModalBody = React.createClass({
  getInitialState(){
    return {jsonView:true};
  },
  switchType(){this.setState({jsonView:!this.state.jsonView});},
  render(props,state) {
    const gList=this.props.mBody;
    let value_log=JSON.parse(gList.log_data);
    return (
      <div className="detail_modal">
        <Row>
          <Col span="12">
            <ul>
              <li>日志时间：{gList.create_time}</li>
              <li>日志标签：{gList.log_tag}</li>
              <li>日志描述：{gList.description}</li>
            </ul>
          </Col>
          <Col span="12">
            <ul>
              <li>日志类型：{gList.logType==1?'账号安全':'服务市场管理'}</li>
              <li>计费标识：{gList.log_tag}</li>
            </ul>
          </Col>
        </Row>
        <Row>
          <ul>
            <li className="json-view">
              <span>数据包：</span>
              <a className="log_style_btn" onClick={this.switchType}>{this.state.jsonView?'源码':'格式化'}</a>
              {this.state.jsonView?<JSONTree data={value_log}/>:
                <Input type="textarea" value={gList.log_data} readOnly rows={8}/> }
            </li>
          </ul>
        </Row>
      </div>
    );
  },
});

export default ModalBody;
