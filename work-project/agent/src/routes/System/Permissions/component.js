import React from 'react';
import {Card, Col, Row,Switch,Icon,Modal,Form,Input,Button,Popconfirm,Spin} from 'antd';
import RegistrationForm from './modal';
import './index.scss';
import User from '../../../model/User';

const EDIT='EDIT';
const DISTRIBUTION='DISTRIBUTION';
const ADDROLE='ADDROLE';
Array.prototype.unique=function(){
  this.sort(); //先排序
  var res = [this[0]];
  for(var i = 1; i < this.length; i++){
    if(this[i] !== res[res.length - 1]){
      res.push(this[i]);
    }
  }
  return res;
}

export default React.createClass({

  getInitialState() {
    return {
      visible: false,
      count: 9,
      text:'',
      index:'',
      treeData:[],
      role_user_count:'',
      data:{},
      allocrole:'',
      treeId:'',
      mockData:[],
      targetKeys:[],
      checkedKeys:[],
      loading:true,
      confirmLoading:false
    };
  },
  componentWillMount(){
    this.props.getRoleList(String(User.userid));
  },
  saveFormRef(form){
    this.form = form;
  },
  setTargetKeys(targetKeys){
    this.setState({
      targetKeys:targetKeys,
    });
  },
  setcheckedKeys(checkedKeys){
    this.setState({
      checkedKeys:checkedKeys,
    });
  },
  callbake(data){
    const targetKeys = [];//已分配列表
    const mockData = [];//可分配列表
    const treeList=[];
    const roleArr=[];
    const Arr=[];
    if(data[0].able_alloc_Userlist){
      const rolelist=data[0];
       rolelist.able_alloc_Userlist.map((item)=>{
         item.status==1?item.disabled=false:item.disabled=true;
         item.key=String(item.user_id);
         mockData.push(item);
       });
       if(rolelist.already_alloc_Userlist)rolelist.already_alloc_Userlist.map((item)=>{
         item.key=String(item.user_id);
         mockData.push(item);
         targetKeys.push(item.key);
       })
    }else if(data[0].res_list){
      data[0].res_list.map((item)=>{
        treeList.push(item)
      })
    }else {
      for(let i=0;i<data.length;i++){
        treeList.push(data[i])
      }
    };
    const loop=data=>data.map((item) => {
      if(item.res_childs){
        loop(item.res_childs)
      }
      if(item.checked==1){
        roleArr.push(String(item.res_id))
      }
      if(item.checked==0)Arr.push(String(item.parent_id));
    });
    loop(treeList);
    const checkedKeys=roleArr.unique();
    for(let i=0;i<checkedKeys.length;i++){
      Arr.unique().map((key)=>{
        if(key==checkedKeys[i]){checkedKeys.splice(i,1);}
      })
    }
    this.setState({
      treeData:treeList,
      mockData:mockData,
      targetKeys:targetKeys,
      checkedKeys:checkedKeys
    });
  },
  showModal(i,obj,str){
    this.setState({visible: true ,loading:true});
    if(str==EDIT){
      let params={
        role_id:obj.role_id+'',
        role_name:obj.role_name
      }
      this.props.getRoleMenusEdit(params,this.callbake).then(()=>{
        this.setState({
          index:i,
          data:obj,
          text:str,
          treeId:'',
          allocrole:'',
          loading:false
        });
      });
    }
    if(str==ADDROLE){
      this.props.getRoleMenusList(this.callbake).then(()=>{
        this.setState({
          index:i,
          data:obj,
          text:str,
          treeId:'',
          allocrole:'',
          loading:false
        });
      });
    }
  },
  handleCancel(){
    this.setState({
      visible: false ,

    });
  },
  handleCreate(){
    const form = this.form;
    const {text,index,data,treeData,allocrole,treeId}= this.state;
    if(text!=DISTRIBUTION)form.validateFields((err, values) => {
      if (err) {return;}
      this.setState({confirmLoading:true})
      if(text==EDIT){
        let editData={
          role_id: data.role_id,
          role_name:values.role_name.trim(),
          role_description: values.description,
          role_status:values.status,
          res_list: treeId?treeId:treeData,
          operator_id:User.userid
        }
        this.props.saveRole(index,editData).then(()=>{
          this.props.getRoleList(String(User.userid));
          this.setState({
            visible: false ,
            confirmLoading:false
          })
        })
      }
      if(text==ADDROLE){
        let editData={
          role_name:values.role_name.trim(),
          role_description: values.description,
          role_status:values.status,
          res_list: treeId?treeId:treeData,
          operator_id:User.userid
        }
        this.props.CreatRole(editData).then(()=>{
          this.props.getRoleList(String(User.userid));
          this.setState({
            visible: false ,
            confirmLoading:false
          })
        })
      }
      form.resetFields();
    });
    if(allocrole){
      let role={
        operator_id:User.userid,
        role_id:data.role_id,
        already_alloc_Userlist:allocrole,
        status:data.status
      }
      this.setState({confirmLoading:true})
      this.props.setAllocRole(role).then(()=>{
        this.setState({
          visible: false,
          role_user_count:allocrole.length,
          confirmLoading:false
        })
        this.props.getRoleList(String(User.userid));
      });

    }
  },
  onDelete(i,obj){
    const params={
      role_id:obj.role_id+'',
      role_name:obj.role_name,
      operator_id:String(User.userid)
    }
    this.props.DeleteRole(i,params).then(()=>{
      this.props.getRoleList(String(User.userid));
      this.setState({
        visible: false ,
        index:i,
        loading:false
      });
    });
  },
  getTree(tree){
    this.setState({
      treeId:tree
    });
  },
  distribution(i,obj,str){
    const id=obj.role_id+"";
    this.setState({visible: true ,loading:true});
    this.props.getRoleUserList(id,this.callbake).then(()=>{
      this.setState({
        index:i,
        data:obj,
        text:str,
        allocrole:'',
        loading:false,
      });
    });
},
  setAllocRole(obj){this.setState({allocrole:obj})},
render(props,state){
    const List=state.get('list').toJS();
  return (
    <Row>
      <span className="card_load"><Spin spinning={state.get('load')}/></span>
      {state.get('load')==false?
        List.map((obj,i) => {
          return (<Col span="7" style={{marginRight:15,marginBottom:15}} key={i} >
            <Card title={obj.role_name} extra={<span>{obj.role_user_count}<Icon type="user" /></span>} className="myCard">
              <p>{obj.description}</p>
              <hr></hr>
              {obj.status==1?<span className="text-success" style={{float:'left'}}>· 可用</span>:<span className="text-warning" style={{float:'left'}}>· 已关闭</span>}
              <span style={{float:'right'}}>
              <a onClick={()=>this.showModal(i,obj,EDIT)}>编辑</a>
              <span className="ant-divider"/>
              <a onClick={()=>this.distribution(i,obj,DISTRIBUTION)}>分配用户</a>
              {obj.role_user_count==0?<Popconfirm title="您确认要删除此角色吗?" onConfirm={()=>this.onDelete(i,obj)}><span><span className="ant-divider"/><a>删除</a></span></Popconfirm>:""}
            </span>
            </Card>
          </Col>
          )}):''
      }
      <Col span="7" style={{marginRight:15,marginBottom:15}}>
        <Card onClick={()=>this.showModal(null,null,ADDROLE)} className="myCard_plus">
          <p className="plus"><Icon type="plus" /></p>
        </Card>
      </Col>
      <RegistrationForm
        visible={this.state.visible}
        ref={this.saveFormRef}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate}
        treeData={this.state.treeData}
        getTree={this.getTree}
        text={this.state.text}
        mockData={this.state.mockData}
        targetKeys={this.state.targetKeys}
        setAllocRole={this.setAllocRole}
        data={this.state.data}
        setTargetKeys={this.setTargetKeys}
        setcheckedKeys={this.setcheckedKeys}
        checkedKeys={this.state.checkedKeys}
        loading={this.state.loading}
        confirmLoading={this.state.confirmLoading}
      />
    </Row>
    )
  }
})
