'use strict'
import React from 'react';

export default class extends React.Component{
    render(){
        return <footer className="paper-footer">
            <ul className="footer-links">
                <li><a href="http://pos.weipass.cn/PosAdmin/" target="_blank">运营支撑平台</a></li>
                <li><a href="http://jfop.wangpos.com/console/" target="_blank">金服运营平台</a></li>
                <li><a href="http://posdl.wangpos.com" target="_blank">代理商合作伙伴平台</a></li>
            </ul>
        </footer>
    }
}