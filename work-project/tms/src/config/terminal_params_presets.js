/**
 *  created by yaojun on 16/12/28
 *
 */
  


    
const TERMINAL ="terminalControls";//
export default [
    {
        "label":"终端号",
        "type":TERMINAL,
        "params":{
            "key" : "terminalNo",
            "title" : "终端号",
            "type" : "text",
            "description":"通道方为指定商户号下的终端分配的唯一标识",
            "validator": [
                {
                    "value":true,
                    "rule":"required",
                    "message": "终端号必须填写"
                },
                {
                    "value":"^[0-9a-zA-Z]{4,20}$",
                    "rule":"pattern",
                    "message": "只允许输入数字或英文字母且长度应在4-20之间"
                }
            ]
        }
    
    },
    {
        "label":"授权码",
        "type":TERMINAL,
        "params":{
            "key" : "authCode",
            "title" : "授权码",
            "type" : "text",
            "description":"通道为终端分配的授权码",
            "validator": [
                {
                    
                    "rule":"required",
                    "value":true,
                    "message": "授权码必须填写"
                },
                {
                    "rule":"pattern",
                    "value":"^[0-9a-zA-Z]{4,20}$",
                    "message": "只允许输入数字或英文字母且长度应在4-20之间"
                  
                }
            ]
        }
      
    }, {
        "label":"设备类型编号",
        "type":TERMINAL,
        "params":{
            "key" : "terminalType",
            "title" : "设备类型编号",
            "type" : "text",
            "description":"设备唯一编号",
            "validator": [
                {
                    "value":true,
                    "rule":"required",
                    "message": "设备类型编号必须填写"
                },
                {
                    "value": "^[0-9a-zA-Z]{4,50}$",
                    "rule": "pattern",
                    "message": "只允许输入数字或英文字母且长度应在4-50之间"
                }
            ]
        }
        
    }
]

