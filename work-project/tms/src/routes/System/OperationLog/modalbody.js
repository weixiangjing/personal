import React from 'react';
import {Input,Row,Col} from 'antd';
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
      <div className="log">
        <Row>
          <Col span="12">
            <li>日志时间：{gList.create_time}</li>
            <li>日志类型：{gList.log_sub_type==101?'账号安全':gList.log_sub_type==201?'收银配置':'基础配置'}</li>
            <li>日志标签：{gList.log_tag}</li>
          </Col>
          <Col span="12">
            <li>支付通道：{gList.pay_channel_name}</li>
            <li>相关门店：{gList.mcode}</li>
            <li>日志描述：{gList.description}</li>
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
