'use strict'
const Storage = sessionStorage;
const EventEmitter = require('wolfy87-eventemitter');

export default class User{
    constructor (storeKey){
        this.storeKey = storeKey;
        this.Map = this.getInitialMap();
        this.setAll(this.getDataFromStore());
        this.event = new EventEmitter();
    }
    getInitialMap(){
        return {};
    }
    storeData(data){
        if(data){
            Storage.setItem(this.storeKey,window.JSON.stringify(data));
        }else {
            Storage.removeItem(this.storeKey);
        }
    }
    getDataFromStore(){
        console.log('get user from storage',this.storeKey);
        let user = Storage.getItem(this.storeKey);
        if(!user)return null;
        return window.JSON.parse(user);
    }
    logout(){
        this.storeData(null);
        this.Map = this.getInitialMap();
        this.event.emitEvent('logout');
    }
    get logged(){
        return !!(this.Map.username && this.Map.userId);
    }
    set(key,value){
        this.Map[key] = value;
    }
    get(key){
        return this.Map[key];
    }
    setAll(attrs){
        if(!attrs)return;
        Object.assign(this.Map,attrs);
    }
    getAll(){
        return this.Map;
    }
}
