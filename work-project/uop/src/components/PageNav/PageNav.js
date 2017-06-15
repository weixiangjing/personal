'use strict'
import React from 'react';
import {Button} from 'antd';
import {Link} from 'react-router';
import Operator from '../../model/Operator';

export default class extends React.Component{
    render(){
        return <div className="nav-menu">
            <div className="logo">
                <Link to="/systems"><img src="/img/logo.png" className="logo-img"/></Link>
                <h1 className="text">统一运营门户</h1>
                <div className="en-name text">United self-Operations Portal</div>
            </div>
            {Operator.logged&&
            <ul className="menu">
                <li className="menu-item">
                    <Link to="/login" className="user-info">
                        <div role="button" className="avatar" style={{backgroundImage:`url(${Operator.get('avatar')})`}}/>
                        <div className="user-name">{Operator.get('name')}</div>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link to="/modifyPassword"><Button shape="circle"><i className="fa fa-lock"/></Button></Link>
                </li>
                <li className="menu-item">
                    <Button shape="circle" onClick={this.props.logout}><i className="fa fa-power-off"/></Button>
                </li>
            </ul>
            }
        </div>
    }
}