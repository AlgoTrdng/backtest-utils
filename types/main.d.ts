export = Positions;

declare type Side = 'long' | 'short';
declare type Type = 'entry' | 'exit';
declare type Position = {
    price: number;
    time: number;
    pnl: number;
    type: Type;
    size: number;
    side: Side;
};
declare type OverallResults = {
    currentSize: number;
    totalPnl: number;
    totalPnlPercentage: number;
    profitablePositionsAmt: number;
    positionsAmt: number;
    maxDrawdown: number;
    averageProfit: number;
    averageDuration: number;
};
declare class Positions {
    private logPositions;
    positions: Position[];
    stopLossSize: number | undefined;
    initialSize: number;
    overallResults: OverallResults;
    private totalProfit;
    constructor(stopLossSize: number, initialSize: number, logPositions: boolean);
    enterPosition(entryPrice: number, time: number, side: Side): void;
    closePosition(closePrice: number, time: number): void;
    checkStopLoss(currentPrice: number, time: number): void;
    getOverallResults(): OverallResults;
}
declare function getProfit(side: Side, entryPrice: number, closePrice: number): [number, string];
declare function getPnl(profit: number): string;
