/**
 *  created by yaojun on 16/12/15
 *
 */
import React from 'react';
import {Row,Col} from "antd";
import DropContainer from './visual/drop.container';
import DragContainer from './visual/drag.container';

import Inspector from './visual/inspector';


export default React.createClass({
    render(){

        let props = this.props.state;
        let controls =props.get("controls");
        let isEnter =props.get("isDragEnter");
        let inspector=props.get("inspector");
        let indexOfActive=inspector.get('index')
        let typeofActive =inspector.get("type")
        
        return (<div className="channel-temp">
            
            
            <Row >
                <Col span={7}>
                   <DragContainer/>
                </Col>
                <Col className={"display-inspector"} span={17}>
                    <DropContainer controls={controls}  isEnter={isEnter}/>
                    <Inspector control={inspector} index={indexOfActive} type={typeofActive} />
                </Col>
              
            </Row>
        </div>)
    }
})