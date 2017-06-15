const path = require("path");
const fs =require('fs');
const args = process.argv.slice(2);
const env =args[0];
console.log("local build env-->",env);
fs.writeFileSync(path.join(__dirname,"../src/config/env.js"), `
const PROD ="prod";
const TEST ="test";
const DEV ="dev";
const env=${env.toUpperCase()};
module.exports={
    PROD:env===PROD,
    TEST:env===TEST,
    DEV:env===DEV
}`
    ,"utf-8")