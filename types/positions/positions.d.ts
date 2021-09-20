import { Side, Positions, Statistics, Position, MarketStatistics, State, EnterPositionParams, ExitPositionParams } from './types/types';
/**
 * Calculates multiple of initial size
 */
export declare const getPnl: (side: Side, entryPrice: number, closePrice: number) => number;
declare class PositionsManager {
    private positions;
    private statistics;
    markets: string[];
    baseSize: number;
    constructor(baseSize: number, markets: string[]);
    /**
     * Enters position
     */
    enterPosition({ market, entryPrice, side, relativePositionSize, openTimestamp, }: EnterPositionParams): Position | undefined;
    /**
     * Exits position
     */
    exitPosition({ market, closePrice }: ExitPositionParams): Position | undefined;
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
