/**
 *  created by yaojun on 17/2/24
 *
 */
  


    

export const BASE_URL="/api/tms";



export function getApi(api=""){
    if(api[0]!=="/"){
        api="/"+api;
    }
    return BASE_URL+api;
}