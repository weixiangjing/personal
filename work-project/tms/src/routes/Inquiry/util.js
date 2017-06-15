/**
 *  created by yaojun on 17/1/4
 *
 */
import {cleanEmpty,showTaskModal} from "../../util/helper";
import {getApi} from "../../config/api";
import axios from "axios";
const TradeStatus = ["全部状态", "交易创建", "交易关闭", "交易完成", "交易失败", "异常终止", "冲正成功", "冲正失败"]
export function getTradeStatus(status) {
    if (typeof status === "undefined") return TradeStatus;
    return TradeStatus[status + 1];
}
const TradeType = ["全部类型", "消费", "消费撤销", "退款", "", "预授权", "预授权撤销", "预授权完成", "", "预授权完成撤销"];
export function getTradeType(type) {
    if (type===undefined) return TradeType;
    if(type ===0) return "--"
    return TradeType[type];
}
const CardType = ['', '借记卡', '贷记卡', '预付费卡', '准贷记']
export function getCardType(index) {
    return CardType[+index];
}
//0-未知，1-插卡，2-挥卡，3-刷卡，4-扫码付主扫，5-扫码付被扫
export const pay_dielectric = ['未知', '插卡', "挥卡", "刷卡", "扫码付主扫", "扫码付被扫"]
export function exportTradeRecords(form, query_type) {
    form.validateFields((error, value) => {
       
        if (error) return;
        value.query_type = query_type;
        if (value.pay_channel_id) {
            value.pay_channel_id = value.pay_channel_id[1];
        }
        const MonthFormat = "YYYY-MM";
        const DateFormat  = MonthFormat + "-DD";
        const oneDay      = 1000 * 60 * 60 * 24;
        const month       = oneDay * 31;
        const DayFormt    = "YYYY-MM-DD HH:mm:ss";
        if (value.start_time == 3) {
            let start = value.end_time_3[0];
            let end   = value.end_time_3[1];
            if (start && end) {
                let diff         = Math.abs(start.diff(end)) / 1000 / 60 / 60 / 24
                value.start_time = start.format(DateFormat) + " 00:00:00"
                value.end_time   = end.format(DateFormat) + " 23:59:59";
            } else {
                value.start_time = null;
                value.end_time   = null;
            }
        }
        if (value.start_time == 2) {
            let start        = value.end_time_2.startOf('month').format(DateFormat) + " 00:00:00"
            let end          = value.end_time_2.endOf('month').format(DateFormat) + " 23:59:59";
            value.start_time = start;
            value.end_time   = end;
        }
        // 按交易日计算 添加时间
        if (value.start_time == 1 || query_type===0) {
            let start        = value.end_time_1.startOf("day").format(DayFormt);
            value.start_time = start;
            value.end_time   = value.end_time_1.endOf("day").format(DayFormt);
        }
        if (value.trade_amount_min) {
            value.trade_amount_min *= 100;
        }
        if (value.trade_amount_max) {
            value.trade_amount_max *= 100;
        }
        value = cleanEmpty(value);
      
        
        console.log("export value ",value);
      axios.post( `trade/queryListEx`,Object.assign({},value,{"export":1})).then(()=>showTaskModal(1))
    })
}
export function groupBy(str, num=4) {
    let len = 1, index = 0, arr = [], s="";
    while (len <= 4 && len > 0) {
        s = str.slice(index, index += num);
        len = s.length;
        arr.push(s);
    }
    return arr.join(' ');
}