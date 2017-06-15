/**
 *  created by yaojun on 16/12/29
 *
 */

/**
 * @deprecated
 * @type {{cashier: string, home: string, info: string, config: string, channel: string, conf: string, plugin: string, profit: string, bin: string, area: string, provider: string, store: string, stores: string, query: string, inquiry: string, accurate: string, advanced: string, liquidate: string, usertms: string, permissions: string, operationlog: string, set: string, system: string}}
 */
export const BreadcrumbConf= {
    "cashier":"收银配置",
    "home":"概况",
    "info":"基本信息",
    "config":"收银参数",
    "channel":"通道列表",
    "conf":"通道配置",
    "plugin":"通道插件",
    "profit":"费率",
    "bin":"银行卡bin",
    "area":"地区信息",
    "provider":"通道服务商",
    "store":"单门店",
    "stores":"多门店",
    "query":"高级查询",

    "inquiry":"交易查询",
    "accurate":"查询指定交易",
    "advanced":"高级查询",
    "liquidate":"结算查询",

    "usertms":"用户管理",
    "permissions":"角色权限管理",
    "operationlog":"操作日志",
    "set":"权限设置",
    "system":"系统功能"

}

export const IndexLink={
    "/cashier/info/":"/cashier/info/channel",
    "/cashier/config/":"/cashier/config/store",
    "/cashier/":"/cashier/home",

    "/system/":"/system",
    "/inquiry/":"/inquiry/home"

}
