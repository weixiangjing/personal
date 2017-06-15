
const path = require("path");
const fs =require('fs');
const moment =require("moment");
const args = process.argv.slice(2);
const version =args[0];
const appConfigFile= path.join(__dirname,"../src/config/app.config.js");
const releaseDate =moment().format("YYYY.MM.DD")
const fileContent=`

export const APP_VERSION ='${version}';
export const APP_BUILD_TIME='${releaseDate}';

`
console.log(`Released on ${releaseDate},version : ${version}`);
fs.writeFileSync(appConfigFile,fileContent ,"utf-8");