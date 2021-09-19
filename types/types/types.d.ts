import { CandlesticksResponse } from 'binance-api-nodejs';
import constants from '../backtest/constants';
export declare type Timeframe = keyof typeof constants.minutes;
export declare type Boundaries = {
    startTime: number;
    endTime: number;
};
export declare type UnmergedCandlesticks = {
    timeframe: Timeframe;
    candlesticks: CandlesticksResponse[];
};
export interface MergedCandlesticks extends Array<CandlesticksResponse | undefined> {
    0: CandlesticksResponse;
}
