"use strict";
import React from 'react';
import {Row,Col,Spin,message,Form,Input,Radio,Upload,Checkbox,Select,Button,DatePicker,Icon,Alert} from 'antd';
const FormItem = Form.Item;
const monent = require('moment');
import axios from 'axios';
import Actions from './actions';
let dynamicAction;

export default Form.create()(React.createClass({
    getInitialState(){
        return {busy:false}
    },
    componentDidMount(){
        this.props.form.setBusy = (busy)=>{
            this.setState({busy:busy})
        };
        dynamicAction = new Actions(this.props.form);
    },
    render(){
        return <Form horizontal>
            <Spin spinning={this.state.busy}>
                <DynamicForm {...this.props}/>
            </Spin>
        </Form>
    }
}));

const DynamicForm = ({form,items,labelCol,wrapperCol,preview,excludeAction})=>{
    let params = items;
    console.log(params)
    if(!params || !params.length)return null;
    const isPreview = preview === true;
    const isExcludeAction = excludeAction === true;
    return <div>
        {params.map((field,index)=>{
            if(isExcludeAction && checkIsActionField(field))return null;
            if(checkIsNotFormField(field)){
                if(isPreview)return null;
                return <Row key={field.id} className='ant-form-item'>
                    <Col span={labelCol?labelCol.span:undefined}/>
                    <Col span={labelCol?wrapperCol.span:undefined}><DynamicOtherField field={field}/></Col>
                </Row>;
            }
            if(!field.key){
                console.log('no key',field);
                return null;
            }
            return <DynamicFormField preview={isPreview} key={index} field={field} form={form} labelCol={labelCol} wrapperCol={wrapperCol}/>
        })}
    </div>
};
const DynamicFormField = React.createClass({
    render(){
        const isPreview = this.props.preview;
        let {field,labelCol,wrapperCol} = this.props;
        return <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label={field.title}>
            {this.getFormItem(field)}
            {isPreview?null:<div className="small text-muted">{field.description}</div>}
        </FormItem>
    },
    getFormItem(field){
        const {getFieldDecorator} = this.props.form;
        field.disabled = field.disabled===true || field.disabled==1;
        let defaultValue = field.defaultValue;
        if(''===defaultValue)defaultValue = undefined;
        const commonProperties = {readOnly:field.readOnly,disabled:this.props.preview || field.disabled};
        if(field.validator){
            field.validator.forEach(validator=>{
                if(validator.pattern && !(validator.pattern instanceof RegExp))validator.pattern = new RegExp(validator.pattern);
            });
        }
        
        const fieldsOption = {initialValue:defaultValue,rules: field.validator};
        
        switch (field.type){
            case 'text':
            case 'textarea':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<Input type={field.type} rows={field.rows} {...commonProperties}/>);
            case 'radio':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<XRadioGroup {...commonProperties} options={field.options}/>);
            case 'checkbox':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<XCheckBoxGroup {...commonProperties} options={field.options}/>);
            case 'select':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<Select {...commonProperties}>
                    {field.options.map(item=>{
                        return <Select.Option key={item.id} value={item.value}>{item.label}</Select.Option>
                    })}
                </Select>);
            case 'datetime':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<XDatePicker {...commonProperties}/>);
            case 'file':
                const fieldProps = {
                    action:field.action,
                    limit:field.limit,
                    suffix:field.suffix
                };
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<FileUpload {...commonProperties} {...fieldProps}/>);
            default:return <label>{field.type}</label>
        }
    }
});
const FileUpload = React.createClass({
    getInitialState(){
        return {
            fileList: [],
        }
    },
    handleChange({file}){
        let stateFile;
        switch (file.status){
            case 'done':
                let data = file.response.data[0];
                let filename = data.filePath.split('/').pop();
                stateFile = {
                    uid: file.uid,
                    name: filename,
                    status: 'done',
                    url:data.url
                };
                this.props.onChange(data.url);
                break;
            case 'removed':
                stateFile = null;
                this.props.onChange('');
                break;
            default:
                stateFile = file;
                break;
        }
        this.setState({fileList:stateFile?[stateFile]:[]});
    },
    beforeUpload(file){
        if(this.props.suffix){
            let extNames = this.props.suffix.split(',');
            if(!checkExtName(extNames,file.name.split('.').pop())){
                message.error('只能支持文件格式：'+this.props.suffix);
                return false;
            }
        }
        if(this.props.limit){
            let kbSize = file.size/1024;
            if(kbSize>this.props.limit){
                message.error('文件大小不能超过'+this.props.limit+'kb');
                return false;
            }
        }
        function checkExtName(filename,extname) {
            return filename.indexOf(extname) != -1;
        }
    },
    componentWillReceiveProps(nextProps){
        let file = nextProps.value;
        if(file){
            let filename = file.split('/').pop();
            this.setState({fileList:[{
                uid: -1,
                name: filename,
                status: 'done',
                url: file
            }]});
        }else {
            this.setState({fileList:[]});
        }
    },
    render(){
        return <Upload {...this.props} name="fileData" fileList={this.state.fileList} data={(file)=>{
            return {fileName:file.name};
        }} multiple={false}
                       action={`${axios.defaults.baseURL}/file/uploadFile/tmsParam`}
                       beforeUpload={this.beforeUpload}
                       onChange={this.handleChange}>
            <Button><Icon type="upload"/>点击上传</Button>
        </Upload>
    }
});
const DynamicOtherField = React.createClass({
    handleButtonClick(){
        const {field} = this.props;
        dynamicAction.exec(field.action,field);
    },
    render(){
        const {field} = this.props;
        switch (field.type){
            case 'button':
                return <Button onClick={this.handleButtonClick}>{field.title}</Button>;
            case 'notice':
                return <Alert description={field.description} type={field.showAs}/>;
            default: return null;
        }
    }
});
const checkIsNotFormField = (field)=>{
    return ['button','notice'].indexOf(field.type) !== -1;
};
const checkIsActionField = (field)=>{
    return ['button','notice','file'].indexOf(field.type) !== -1;
};

const XDatePicker = React.createClass({
    decorateProps(){
        let {value,defaultValue,onChange,format} = this.props;
        let decorate = Object.assign({},this.props);
        if(typeof value == 'string')decorate.value = monent(value);
        if(typeof defaultValue == 'string')decorate.defaultValue = monent(defaultValue);
        decorate.onChange = (value)=>{
            onChange(value.format(format||'YYYY-MM-DD'));
        };
        return decorate;
    },
    render(){
        return <DatePicker {...this.decorateProps()}/>
    }
});
const XCheckBoxGroup = React.createClass({
    decorateProps(){
        let {value,defaultValue} = this.props;
        let decorate = Object.assign({},this.props);
        if(typeof value == 'string')decorate.value = window.JSON.parse(value);
        if(typeof defaultValue == 'string')decorate.defaultValue = window.JSON.parse(defaultValue);
        return decorate;
    },
    render(){
        return <Checkbox.Group {...this.decorateProps()}/>
    }
});
const XRadioGroup = React.createClass({

    render(){
        return (<Radio.Group {...this.props}>
            {this.props.options.map(item=>{
                return <Radio key={item.id} value={String(item.value)}>{item.label}</Radio>
            })}
        </Radio.Group>)
    }
});