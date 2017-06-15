import { Tree } from 'antd';
import React from 'react';
const TreeNode = Tree.TreeNode;
const ADDROLE='ADDROLE';




const RightTree = React.createClass({
  getInitialState() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeId:''
    };
  },
  onExpand(expandedKeys) {
    console.log(expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  },
  onCheck(checkedKeys,info) {
    const {data,setcheckedKeys,getTree}=this.props;
    const pId=[];
    const forloop=(data,arr)=>data.map((item) => {
      arr.map((key)=>{if(key==item.res_id)item.checked=1;})
      if(item.checked==1){if(item.parent_id!=-1)pId.push(item.parent_id);}
    })
    const loop=data=>data.map((item) => {
      if(item.res_childs){
        loop(item.res_childs)
      }
      item.checked=0;
      for(let i=0;i<checkedKeys.length;i++){
        if(checkedKeys[i]==item.res_id){
          item.checked=1;
          pId.push(item.parent_id);
        }
      }
      forloop(data,pId.unique())
    })
    if(checkedKeys.length){loop(data)}else {
      const loopfor=data=>data.map((item) => {
        if(item.res_childs){loopfor(item.res_childs)}
        item.checked=0;
      })
      loopfor(data)
    };
    this.setState({
      checkedKeys
    });
    getTree(data)
    setcheckedKeys(checkedKeys)
  },
  onSelect(selectedKeys, info) {
    console.log(info)
    this.setState({ selectedKeys });
  },
  render(props,state) {
    const {data,checkedKeys}=this.props;
    const loop = data => data.map((item) => {
      if (item.res_childs.length) {
        return (
          <TreeNode key={String(item.res_id)} title={item.res_name} >
            {loop(item.res_childs)}
          </TreeNode>
        );
      }
      return <TreeNode key={String(item.res_id)} title={item.res_name} />;
    });
    return (<div>
        <p>权限列表：</p>
        <Tree
          checkable
          onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck} checkedKeys={checkedKeys}
          onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
        >
          {loop(data)}
        </Tree>
    </div>
    );
  },
});
export default RightTree;

