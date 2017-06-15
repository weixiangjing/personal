/**
 * 打印模板预设控件
 * @type {[*]}
 */
module.exports=[
    {
        type:"单列文本",
        classify:"",
        props:{
            size:1,//0,1,2,3
            gravity:0,//0：左，1：居中，2：右
            style:0,//0:普通,1:加粗，2：斜体
            label:"营业员"//{separator} 分隔，{newline}换行
        }
    },
    {
        type:"多列文本",
        classify:"",
        props:{
            size:1,//0,1,2,3
            style:0,//0:普通,1:加粗，2：斜体
            toside:true,//将文本打印的到左右两边
            label:"左边文字{separator}右边文字"//{separator} 分隔，{newline}换行
            
        }
    },  {
        type:"固定文本",
        classify:"",
        props:{
            size:1,//0,1,2,3
            style:0,//0:普通,1:加粗，2：斜体
            leftlength:16,// 左边长度,SMALL：24、MEDIUM：16、EXTRALARGE：8、LARGE：12
            label:"左边限制文本{separator}右边文本"//{separator} 分隔，{newline}换行
        }
    },
    {
        type:"二维码",
        classify:"",
        props:{
            gravity:1,//0：左，1：居中，2：右
            type:1,//0 ：文本，1：二维码，2：条形码,3:图片，4：分隔线,
            label:""
            
        }
    },
    {
        type:"条形码",
        classify:"",
        props:{
            gravity:1,//0：左，1：居中，2：右
            type:2,//0 ：文本，1：二维码，2：条形码,3:图片，4：分隔线,
            label:""
        }
    },
  
    {
        type:"图片",
        classify:"",
        props:{
            gravity:1,//0：左，1：居中，2：右
            type:3,//0 ：文本，1：二维码，2：条形码,3:图片，4：分隔线,
            label:"",
            upload:""
        }
    },
    {
        type:"分隔线",
        classify:"",
        props:{
            type:4,//0 ：文本，1：二维码，2：条形码,3:图片，4：分隔线
            
        }
    },{
        type:"自定义",
        classify:"",
        props:{
            size:1,//0,1,2,3
            gravity:0,//0：左，1：居中，2：右
            style:0,//0:普通,1:加粗，2：斜体
            toside:false,//将文本打印的到左右两边
            type:0,//0 ：文本，1：二维码，2：条形码,3:图片，4：分隔线
            label:"营业员",//{separator} 分隔，{newline}换行
            leftlength:16
            
        }
    }
   
]