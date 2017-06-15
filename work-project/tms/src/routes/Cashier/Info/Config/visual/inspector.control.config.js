


import {NormalControl,TextareaControl,ArrayControl,OptionsControl,SelectControl,RadioControlWithYesOrNo,OptionColsControl} from "./inspector.control"

export const ControlMap= {
    suffix:NormalControl,
    limit:NormalControl,
    title:NormalControl,
    label:NormalControl,
    action:NormalControl,
    fileExt:ArrayControl,
    description:TextareaControl,
    validator:OptionColsControl,
    key:NormalControl,
    options:OptionsControl,
    disabled:RadioControlWithYesOrNo,
    rows:NormalControl,
    showAs:SelectControl
}
export const Lang={
    suffix:"文件名后缀",
    label:"名称",
    limit:"大小限制",
    title:"控件名称",
    disabled:"是否禁用",
    key:"字段名",
    action:"函数",
    fileExt:"可选文件扩展",
    description:"字段描述",
    validator:"验证规则",
    options:"选项",
    rows:"行数",
    showAs:"状态"
}