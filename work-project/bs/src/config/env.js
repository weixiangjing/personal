
const PROD ="prod";
const TEST ="test";
const DEV ="dev";
const env=TEST;
module.exports={
    PROD:env===PROD,
    TEST:env===TEST,
    DEV:env===DEV
}