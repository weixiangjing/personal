'use strict'
import React from 'react';
import './style.scss';
import {Icon,Alert,Form,Button,Checkbox,Input,Row,Col,Spin} from 'antd';
const FormItem = Form.Item
import QueueAnim from 'rc-queue-anim';
import Operator from '../../../model/Operator';

export default Form.create()(React.createClass({
    getInitialState(){
        return {
            error:null,
            loading:false,
            userSyncing:false,
            logged:Operator.logged,
            lastUserAccount: localStorage.getItem('last_user_account')
        }
    },
    handleSubmit(e){
        e.preventDefault();
        if(this.state.loading)return;
        this.setState({error:null});
        this.props.form.validateFields((err,fields)=>{
            if(err)return;
            this.setState({loading:true});
            Operator.login(fields).then(()=>{
                if(fields.remember===true){
                    localStorage.setItem('last_user_account',fields.login_account);
                }
                setTimeout(()=>{
                    if(!this.checkUrlRedirect()){
                        this.goSystems();
                    }
                },0)
            },err=>{
                this.setState({error:err.message});
            }).finally(()=>{
                this.setState({loading:false});
            });
        })
    },
    goSystems(){
        this.props.router.push({pathname:'/systems'});
    },
    logout(){
        this.setState({userSyncing:true});
        Operator.logout().finally(()=>{
            this.setState({userSyncing:false});
        });
    },
    checkUserAndRedirect(){
        this.setState({userSyncing:true});
        Operator.syncInfo().then(()=>{
            this.checkUrlRedirect();
        }).finally(()=>{
            this.setState({userSyncing:false});
        })
    },
    onLogin(){
        this.setState({logged:true});
        console.log('login')
    },
    onLogout(){
        this.setState({logged:false})
        console.log('logout')
    },
    componentWillMount(){
        Operator.event.addListener('login',this.onLogin);
        Operator.event.addListener('logout',this.onLogout);
    },
    componentDidMount(){
        this.checkUserAndRedirect()
    },
    componentWillUnmount(){
        Operator.event.removeListener('login',this.onLogin);
        Operator.event.removeListener('logout',this.onLogout);
    },
    checkUrlRedirect(){
        let {url} = this.props.location.query;
        if(url){
            url = decodeURIComponent(url);
            const query = {
                origin:location.origin,
                login:'/login',
                systems:'/systems'
            }
            if(!(/\?/g.test(url)))url+='?';
            let params = [];
            Object.keys(query).forEach(key=>{
                var val = query[key];
                if(null!=val){
                    val = encodeURIComponent(query[key]);
                    params.push(`${key}=${val}`);
                }
            })
            params = params.join('&');
            url = url+params;
            console.log(url);
            location.replace(url);
            return true;
        }
        return false;
    },
    redirect(flag){
        if(flag)location.replace(this.state.redirectUrl);
        this.setState({redirecting:false})
    },
    render() {
        const {getFieldDecorator} = this.props.form;
        return <Form id="login-page" onSubmit={this.handleSubmit} className="concise-form">
            <QueueAnim type={['top', 'bottom']} ease={['easeOutQuart', 'easeInOutQuart']} duration={800}>
                <div key="ani-a">
                    <h1 className="page-title">登录</h1>
                    <div className="error-tip">
                        {this.state.error && <Alert message={this.state.error} type="warning" showIcon className="animated bounce"/>}
                    </div>
                    <div className="login-card">
                        {this.state.logged?
                            <Spin spinning={this.state.userSyncing}>
                                <div className="user-info">
                                    <p onClick={this.goSystems} role="button" className="avatar"
                                       style={{backgroundImage:`url(${Operator.get('avatar')})`}}/>
                                    <div>{Operator.get('username')}</div>
                                    <p onClick={this.logout} className="gutter-top-lg"><a>更换账号</a></p>
                                </div>
                            </Spin>
                            :
                            <div>
                                <FormItem>
                                    {getFieldDecorator('login_account', {
                                        initialValue:this.state.lastUserAccount,
                                        rules: [{required: true, message: '请输入登录名'}],
                                    })(
                                        <Input prefix={<Icon type="user" className="input-icon"/>} autoComplete="off" placeholder="登录名"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('login_pwd', {
                                        rules: [{required: true, message: '请输入登录密码'}],
                                    })(
                                        <Input prefix={<Icon type="lock" className="input-icon"/>} type="password" maxLength="18" placeholder="登录密码"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Row className='op-btn'>
                                        <Col span={12}>
                                            {getFieldDecorator('remember', {
                                                initialValue:true,
                                                valuePropName:'checked'
                                            })(
                                                <Checkbox>记住用户名</Checkbox>
                                            )}
                                        </Col>
                                        <Col span={12} className='text-right'>
                                            <Button shape="circle" loading={this.state.loading} type="primary" htmlType='submit' size="large" className='login-button'>
                                                {!this.state.loading&&<Icon type="arrow-right"/>}
                                            </Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </div>}
                    </div>
                </div>
            </QueueAnim>
        </Form>
    }
}))
