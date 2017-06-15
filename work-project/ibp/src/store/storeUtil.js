
var localStore;

export function __initStore__(store){
    localStore=store;
}

export function dispatch(param){
    return localStore.dispatch(param);
}