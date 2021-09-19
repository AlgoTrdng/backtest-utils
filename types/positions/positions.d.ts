export declare type Side = 'long' | 'short';
export declare type State = 'opened' | 'closed';
export declare type Position = {
    entrySize: number;
    side: Side;
    state: State;
    entryPrice: number;
    closePrice?: number;
    pnl?: number;
    profit?: number;
};
export declare type Positions = {
    [market: string]: Position[];
};
/**
 * Calculates multiple of initial size
 */
export declare const getPnl: (side: Side, entryPrice: number, closePrice: number) => number;
export declare type MarketStatistics = {
    size: number;
    pnl: number;
    positionsAmt: number;
    profitablePositionsAmt: number;
    hitRate: number | null;
};
export declare type Statistics = {
    [market: string]: MarketStatistics;
};
declare class PositionsManager {
    private positions;
    private statistics;
    markets: string[];
    baseSize: number;
    constructor(baseSize: number, markets: string[]);
    /**
     * Enters position
     */
    enterPosition(market: string, entryPrice: number, side: Side, positionSizeRelative?: number): Position | undefined;
    /**
     * Exits position
     */
    exitPosition(market: string, closePrice: number): Position | undefined;
    private updateMarketStats;
    private updateOpenedPosition;
    /**
     * Get all positions
     */
    get getPositions(): Positions;
    /**
     * Get market specific positions
     */
    get getMarketPositions(): (market: string) => Position[];
    /**
     * Gets last position from based on specifies market
     */
    get getLastPosition(): (market: string) => Position | undefined;
    /**
     * Gets all positions based on specified state
     */
    get getPositionsByState(): (market: string, state: State) => Position[];
    get getStatistics(): Statistics;
    get getMarketStatistics(): (market: string) => MarketStatistics;
}
export default PositionsManager;
