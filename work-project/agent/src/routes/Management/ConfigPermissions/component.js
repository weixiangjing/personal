import React from 'react';
const reducer = require('./reducer');



export default React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading:false,
      text:{},
      index:'',
    };
  },
  render(props,state){
    
    return(
      <div>hhhhh</div>
    )
  }
})
