/**
 *  created by yaojun on 2017/3/8
 *
 */


import React from "react";
import {Upload,Button,Icon,message} from 'antd';
import {BASE_URL} from "../../config/api";
import user from "../../model/User";


export class ImageUpload extends React.Component{
    static propTypes={
        label:React.PropTypes.string,
        onChange:React.PropTypes.func,
        onResponse:React.PropTypes.func,
        multiple:React.PropTypes.bool,
        accept:React.PropTypes.regex
    }
    state={
        pending:false
    }
    
    /**
     * @protected
     * @returns {XML}
     */
    getContent(){
      return  this.props.showButton ? <Button><Icon type={this.state.pending?'loading':this.props.icon}/>浏览文件</Button>:
            <Icon type={this.state.pending?'loading':this.props.icon}/>
    }
    render(){
        let {multiple=false,accept=/(gif|jpe?g|png|svg)/,onChange,onResponse,className,size,onFileRead,showButton=true,icon="plus"} =this.props;
        return (
            <Upload
                headers={{
                    "Access-Token":user.info.token
                }}
                data={(file)=>{
                    
                    return {
                        fileName:file.name
                    }
                }}
                className={className}
                beforeUpload={(e)=>{
                    let name =e.name.split(".");
                    let suffix= name[name.length-1];
                    if(!accept.test(suffix)){
                         message.success("请上传gif、jpg、png、格式图片");
                        return false;
                    }
                    if(size && (e.size/1024)>size){
                         message.success("图片大小在"+size+"KB以内",4);
                        return false
                    }
                    if(onFileRead){// 图片本地读取，不上传到服务器
                       let reader= new FileReader();
                            reader.onloadend=function() {
                                onFileRead(reader.result);
                            }
                            reader.readAsDataURL(e);
                        
                        return false
                    }
                    this.setState({pending:true})
                }}
                onChange={(e)=>{
                
                    if(e.file.status==="done"){
                        this.setState({pending:false,result:e.file.response.data[0]})
                        if(onChange){
                            let result = e.file.response.data.map(item=>item.url);
                            
                            onChange(multiple?result:result[0]);
                        }
                        if(onResponse){
                            onResponse(e.file.response.data);
                        }
                    }
                }}
                
                multiple={multiple}
                showUploadList={false}
                name={"image"}
                action={`${BASE_URL}merchant/uploadStorePhoto`}>
                {
                   this.getContent()
                }
               
            </Upload>
            )
       
    }
}
