
import  React from "react";
/**
 *
 * @type {{TradeQuery: {TODAY_TRADE: string|React.Element, TOTAL_TRADE: string|React.Element, TREND_TRADE: string|React.Element, RANK_TRADE: string|React.Element}}}
 */
module.exports={
    TradeQuery:{
        TODAY_TRADE:<div>所有支付通道（不包括现金），或指定支付通道下今日成功交易的笔数和交易金额总和。<br/>·消费类：是指类型为消费、预授权完成的交易；<br/>·退款类：是指类型为消费撤销、退款、预授权完成撤销的交易。</div>,
        TOTAL_TRADE:<div>截止昨日所有支付通道（不包括现金），或指定支付通道下成功交易的笔数和交易金额的累计总和。<br/>·消费类：是指类型为消费、预授权完成的交易；<br/>·退款类：是指类型为消费撤销、退款、预授权完成撤销的交易。</div>,
        TREND_TRADE:<div>根据所有支付通道（不包括现金），或指定支付通道的日交易数据的走势图（最多可支持半年内的数据）</div>,
        RANK_TRADE:<div>按支付通道、门店、设备的日交易数据排行</div>
    }
}