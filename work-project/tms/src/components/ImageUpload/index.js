/**
 *  created by yaojun on 2017/3/8
 *
 */


import React from "react";
import {Upload,Button,Icon,message} from 'antd';
import {BASE_URL} from "../../config/api"


export class ImageUpload extends React.Component{
    static propTypes={
        label:React.PropTypes.string,
        onChange:React.PropTypes.func,
        onResponse:React.PropTypes.func,
        multiple:React.PropTypes.bool
    }
    state={
        pending:false
    }
    render(){
        let {multiple=false,onChange,onResponse,className,size,onFileRead,showButton=true,icon="plus"} =this.props;
        return (
            <Upload
                data={(file)=>{
                    
                    return {
                        fileName:file.name
                    }
                }}
                className={className}
                beforeUpload={(e)=>{
                    
                    if(size && (e.size/1024)>size){
                        return message.success("图片大小在"+size+"KB以内",4);
                    }
                    if(onFileRead){// 图片本地读取，不上传到服务器
                       let reader= new FileReader();
                            reader.onloadend=function() {
                                onFileRead(reader.result);
                            }
                            reader.readAsDataURL(e);
                        
                        return;
                    }
                    this.setState({pending:true})
                }}
                onChange={(e)=>{
                
                    if(e.file.status==="done"){
                        this.setState({pending:false})
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
                name={"fileData"}
                action={`${BASE_URL}/file/uploadFile/tmsIcon`}>
                {
                    showButton ? <Button><Icon type={this.state.pending?'loading':icon}/>浏览文件</Button>:
                        <Icon type={this.state.pending?'loading':icon}/>
                }
               
            </Upload>
            )
       
    }
}
