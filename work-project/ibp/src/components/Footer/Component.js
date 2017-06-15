'use strict';
import React from 'react'
import {Layout} from 'antd'
const {Footer} = Layout;
import classNames from 'classnames';

export class FooterComponent extends React.Component {
    render () {
        const {className,id} = this.props;
        return <Footer className={classNames('app-comp-footer',className)} id={id}>
            <div className="center-wrapper">
                成都位置金融信息服务技术有限公司 ©2017
            </div>
        </Footer>
    }
}
export default FooterComponent
