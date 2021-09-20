"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_api_nodejs_1 = __importDefault(require("binance-api-nodejs"));
// TODO: Optimize
const mergeCandlesticks = (markets, unmergedCandlesticks) => {
    const mergedCandlesticks = {};
    for (let i = 0; i < markets.length; i += 1) {
        const market = markets[i];
        const marketUnmergedCandlesticks = unmergedCandlesticks[market];
        const timeframes = Object.keys(marketUnmergedCandlesticks);
        const baseUnmergedCandlesticks = marketUnmergedCandlesticks[timeframes[0]];
        const marketMergedCandlesticks = baseUnmergedCandlesticks.map((currentCandlestick) => {
            const { closeTime } = currentCandlestick;
            const currentMergedCandlestick = {
                [timeframes[0]]: currentCandlestick,
            };
            timeframes.slice(1).forEach((timeframe) => {
                // @ts-ignore
                currentMergedCandlestick[timeframe] = marketUnmergedCandlesticks[timeframe].find(({ closeTime: _closeTime }) => _closeTime === closeTime);
            });
            return currentMergedCandlestick;
        });
        mergedCandlesticks[market] = marketMergedCandlesticks;
    }
    return mergedCandlesticks;
};
class BacktestClient {
    binance = new binance_api_nodejs_1.default();
    markets;
    timestamps;
    showLogs;
    states = {};
    // Market timeframes have to be sorted from lowest to highest
    // TODO: sort timeframes automatically
    constructor(markets, initialState, timestamps, showLogs = false) {
        this.markets = markets;
        this.timestamps = timestamps;
        this.showLogs = showLogs;
        Object.keys(markets).forEach((market) => {
            this.states[market] = initialState;
        });
    }
    async fetchAndMergeCandlesticks() {
        const markets = Object.keys(this.markets);
        const candlesticks = {};
        this._log('Loading candlesticks');
        for (let i = 0; i < markets.length; i += 1) {
            const market = markets[i];
            const timeframes = this.markets[market];
            for (let j = 0; j < timeframes.length; j += 1) {
                const timeframe = timeframes[j];
                const currentMarketCandlesticks = await this.binance.spot.candlesticks(market, timeframe, this.timestamps);
                candlesticks[market] = {
                    ...candlesticks[market],
                    [timeframe]: currentMarketCandlesticks,
                };
            }
        }
        return mergeCandlesticks(markets, candlesticks);
    }
    // eslint-disable-next-line no-unused-vars
    async runBacktest(onNewCandle) {
        const mergedCandlesticks = await this.fetchAndMergeCandlesticks();
        this._log('Candlesticks loaded and merged');
        Object.keys(mergedCandlesticks).forEach((market) => {
            mergedCandlesticks[market].forEach((candlestick) => {
                onNewCandle({
                    state: this.states[market],
                    candlestick,
                    market,
                });
            });
        });
    }
    _log(message) {
        if (this.showLogs) {
            console.log(message);
        }
    }
}
exports.default = BacktestClient;
