export function xml2json(xml) {
    
    let result={template: [], name: ""};
    if(!xml) {
        
        return result;
    }
    let sourceCode=xml;
    let root=document.createElement("div");
    root.innerHTML=sourceCode;
    
    let template=root.children[0];
    let temAttr=template.attributes[0];
    let temName=temAttr ? temAttr.value : "";
    
    let row=template.content.children;
    let array=[]
    for(let i=0; i<row.length; i++) {
        let object={}
        let item=row[i];
        let attributes=item.attributes;
        object.id=Math.random();
        object.classify="";
        let props=object.props={}
        for(let j=0; j<attributes.length; j++) {
            let attr=attributes[j];
            props[attr.name]=attr.value;
        }
        props.label=item.textContent;
        array.push(object);
    }
    result.template=array;
    result.name=temName;
    return result;
    
}

export function json2xml(sourceCode, templateName,lineBreak) {
    
    let root=document.createElement("div");
    let rowsText=[];
    for(let i=0; i<sourceCode.length; i++) {
        let row=document.createElement("row");
        let item=sourceCode[i].props;
        for(let prop in item) {
            if(prop!=="label") {
                row.setAttribute(prop, item[prop]);
            }
        }
        row.innerText=item.label||"";
        rowsText.push("\t"+row.outerHTML);
        root.appendChild(row);
    }
    if(templateName) {
        return `<Template name="${templateName}" >\n${lineBreak?rowsText.join(lineBreak):root.innerHTML}</Template>`;
    }
    return "<Template>\n"+(lineBreak?rowsText.join(lineBreak):root.innerHTML)+"\n</Template>";
}