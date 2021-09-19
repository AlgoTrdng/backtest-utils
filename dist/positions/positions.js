"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPnl = void 0;
/**
 * Calculates multiple of initial size
 */
const getPnl = (side, entryPrice, closePrice) => {
    let profit = 0;
    if (side === 'long') {
        profit = closePrice / entryPrice;
        return profit;
    }
    if (side === 'short') {
        profit = 1 - (closePrice / entryPrice) + 1;
        return profit;
    }
    // eslint-disable-next-line no-throw-literal
    throw 'Invalid side';
};
exports.getPnl = getPnl;
class PositionsManager {
    positions;
    statistics;
    markets;
    baseSize;
    constructor(baseSize, markets) {
        this.baseSize = baseSize;
        this.markets = markets;
        this.statistics = markets.reduce((acc, market) => {
            acc[market] = {
                size: baseSize,
                pnl: 0,
                positionsAmt: 0,
                profitablePositionsAmt: 0,
                hitRate: null,
            };
            return acc;
        }, {});
        this.positions = markets.reduce((_positions, market) => {
            _positions[market] = [];
            return _positions;
        }, {});
    }
    /**
     * Enters position
     */
    enterPosition(market, entryPrice, side, positionSizeRelative = 1) {
        if (!this.markets.includes(market)) {
            console.log('Invalid market');
            return undefined;
        }
        const { size } = this.statistics[market];
        const position = {
            entrySize: size * positionSizeRelative,
            state: 'opened',
            entryPrice,
            side,
        };
        this.positions[market].push(position);
        return position;
    }
    /**
     * Exits position
     */
    exitPosition(market, closePrice) {
        const lastPosition = this.getLastPosition(market);
        if (!lastPosition || lastPosition.state !== 'opened') {
            console.log('Position not opened');
            return undefined;
        }
        const { entryPrice, entrySize, side } = lastPosition;
        const pnl = exports.getPnl(side, entryPrice, closePrice);
        const closedPosition = {
            ...lastPosition,
            state: 'closed',
            closePrice,
            pnl,
        };
        this.updateOpenedPosition(market, closedPosition);
        const { size, positionsAmt, profitablePositionsAmt, } = this.statistics[market];
        const closeSize = entrySize * pnl;
        const newSize = size + closeSize - entrySize;
        const updatedMarketStats = {
            size: newSize,
            pnl: newSize / this.baseSize,
            positionsAmt: positionsAmt + 1,
            profitablePositionsAmt: pnl > 1 ? profitablePositionsAmt + 1 : profitablePositionsAmt,
        };
        this.updateMarketStats(market, {
            ...updatedMarketStats,
            hitRate: updatedMarketStats.profitablePositionsAmt / updatedMarketStats.positionsAmt,
        });
        return closedPosition;
    }
    updateMarketStats(market, newStats) {
        if (!this.markets.includes(market)) {
            console.log('Invalid market');
            return;
        }
        this.statistics[market] = newStats;
    }
    updateOpenedPosition(market, position) {
        this.positions[market][this.positions[market].length - 1] = position;
        return position;
    }
    /**
     * Get all positions
     */
    get getPositions() {
        return this.positions;
    }
    /**
     * Get market specific positions
     */
    get getMarketPositions() {
        return (market) => this.positions[market];
    }
    /**
     * Gets last position from based on specifies market
     */
    get getLastPosition() {
        return (market) => {
            const currentMarketPositions = this.positions[market];
            if (!currentMarketPositions) {
                return undefined;
            }
            return currentMarketPositions[currentMarketPositions.length - 1];
        };
    }
    /**
     * Gets all positions based on specified state
     */
    get getPositionsByState() {
        return (market, state) => {
            const currentMarketPositions = this.positions[market];
            if (!currentMarketPositions) {
                return [];
            }
            return currentMarketPositions.filter(({ state: _state }) => _state === state);
        };
    }
    get getStatistics() {
        return this.statistics;
    }
    get getMarketStatistics() {
        return (market) => this.statistics[market];
    }
}
exports.default = PositionsManager;
