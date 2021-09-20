import Binance from 'binance-api-nodejs';
import { Markets, Timestamps, States, OnNewCandle } from './types/types';
declare class BacktestClient<S extends {}> {
    binance: Binance;
    markets: Markets;
    timestamps: Timestamps;
    showLogs: boolean;
    states: States<S>;
    constructor(markets: Markets, initialState: S, timestamps: Timestamps, showLogs?: boolean);
    private fetchAndMergeCandlesticks;
    runBacktest(onNewCandle: OnNewCandle<S>): Promise<void>;
    private _log;
}
export default BacktestClient;
