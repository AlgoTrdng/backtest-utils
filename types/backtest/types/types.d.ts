import { CandlesticksResponse } from 'binance-api-nodejs';
import { minutes } from '../constants';
export declare type Markets = {
    [market: string]: (keyof typeof minutes)[];
};
export declare type MarketUnmergedCandlesticks = {
    [K in keyof typeof minutes]: CandlesticksResponse[];
};
export declare type UnmergedCandlesticks = {
    [market: string]: MarketUnmergedCandlesticks;
};
export declare type MarketMergedCandlestick = {
    [K in keyof typeof minutes]?: CandlesticksResponse;
};
export declare type MergedCandlesticks = {
    [market: string]: MarketMergedCandlestick[];
};
export declare type Timestamps = {
    startTime: number;
    endTime: number;
};
export declare type OnNewCandlePayload<S> = {
    candlestick: MarketMergedCandlestick;
    market: string;
    state: S;
};
export declare type OnNewCandle<S> = (onNewCandleParams: OnNewCandlePayload<S>) => void;
export declare type States<S> = {
    [market: string]: S;
};
