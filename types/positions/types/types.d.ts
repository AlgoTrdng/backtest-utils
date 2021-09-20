export declare type Side = 'long' | 'short';
export declare type State = 'opened' | 'closed';
export declare type Position = {
    relativePositionSize: number;
    entrySize: number;
    closeSize?: number;
    side: Side;
    state: State;
    entryPrice: number;
    closePrice?: number;
    pnl?: number;
    profit?: number;
    openTimestamp?: number;
    closeTimestamp?: number;
};
export declare type Positions = {
    [market: string]: Position[];
};
export declare type MarketStatistics = {
    size: number;
    pnl: number;
    positionsAmt: number;
    profitablePositionsAmt: number;
    hitRate: number | null;
    maxLoss: number;
};
export declare type Statistics = {
    [market: string]: MarketStatistics;
};
export declare type EnterPositionParams = {
    market: string;
    entryPrice: number;
    side: Side;
    relativePositionSize?: number;
    openTimestamp?: number;
};
export declare type ExitPositionParams = {
    market: string;
    closePrice: number;
    closeTimestamp?: number;
};
