import dayjs from 'dayjs';

export type Side = 'long' | 'short';

export type Type = 'entry' | 'exit';

export type Position = {
  price: number;
  time: number;
  pnl: number;
  type: Type;
  size: number;
  side: Side;
}

export type OverallResults = {
  currentSize: number;
  totalPnl: number;
  totalPnlPercentage: number;
  profitablePositionsAmt: number;
  positionsAmt: number;
  maxDrawdown: number;
  averageProfit: number;
  averageDuration: number;
}

class Positions {
  private logPositions: boolean;

  positions: Position[] = [];

  stopLossSize: number | undefined;

  initialSize: number;

  overallResults: OverallResults;

  private totalProfit = 0;

  constructor(stopLossSize: number, initialSize: number, logPositions: boolean) {
    this.stopLossSize = stopLossSize > 0 ? +`-${stopLossSize}` : stopLossSize;
    this.initialSize = initialSize;
    this.logPositions = logPositions;

    this.overallResults = {
      currentSize: this.initialSize,
      totalPnl: 0,
      totalPnlPercentage: 0,
      profitablePositionsAmt: 0,
      positionsAmt: 0,
      maxDrawdown: 0,
      averageProfit: 0,
      averageDuration: 0,
    };
  }

  enterPosition(entryPrice: number, time: number, side: Side) {
    const type = 'entry';
    const prevSize = this.positions[this.positions.length - 1]?.size || this.initialSize;

    const position: Position = {
      side,
      type,
      price: entryPrice,
      time,
      size: prevSize,
      pnl: 0,
    };

    this.positions.push(position);

    if (this.logPositions) {
      _logPositions(position);
    }
  }

  closePosition(closePrice: number, time: number) {
    const type = this.positions[this.positions.length - 1]?.type || {};

    if (type !== 'entry') {
      return;
    }

    const { side, price: entryPrice, size: entrySize } = this.positions[this.positions.length - 1];

    const [profit, pnl] = getProfit(side, entryPrice, closePrice);
    const closeSize = entrySize * profit;

    this.overallResults.currentSize = closeSize;
    this.overallResults.totalPnl = closeSize - this.initialSize;
    this.overallResults.totalPnlPercentage = +getPnl(closeSize / this.initialSize);
    this.overallResults.positionsAmt += 1;
    this.overallResults.maxDrawdown = Math.min(+pnl, this.overallResults.maxDrawdown);

    this.totalProfit += +pnl;

    if (profit > 1) {
      this.overallResults.profitablePositionsAmt += 1;
    }

    const position: Position = {
      side,
      time,
      pnl: +pnl,
      price: closePrice,
      size: closeSize,
      type: 'exit',
    };

    this.positions.push(position);

    if (this.logPositions) {
      _logPositions(position, true);
    }
  }

  checkStopLoss(currentPrice: number, time: number) {
    const { type, price: entryPrice, side } = this.positions[this.positions.length - 1] || {};

    if (type !== 'entry') {
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const [_, pnl] = getProfit(side, entryPrice, currentPrice);

    if (this.stopLossSize !== undefined && +pnl < this.stopLossSize) {
      this.closePosition(currentPrice, time);
    }
  }

  getOverallResults() {
    if (this.positions.length < 2) {
      return this.overallResults;
    }

    const lastPosition = this.positions[this.positions.length - 1].type === 'exit'
      ? this.positions[this.positions.length - 1]
      : this.positions[this.positions.length - 2];

    const averageDuration = (lastPosition.time - this.positions[0].time) / this.overallResults.positionsAmt;
    const averageProfit = this.totalProfit / this.overallResults.positionsAmt;

    return {
      ...this.overallResults,
      averageDuration,
      averageProfit,
    };
  }
}

export function getProfit(side: Side, entryPrice: number, closePrice: number): [number, string] {
  let profit = 0;

  if (side === 'long') {
    profit = closePrice / entryPrice;
    return [profit, getPnl(profit)];
  }

  if (side === 'short') {
    profit = 1 - (closePrice / entryPrice) + 1;
    return [profit, getPnl(profit)];
  }

  // eslint-disable-next-line no-throw-literal
  throw 'Invalid side';
}

export function getPnl(profit: number) {
  return ((profit - 1) * 100).toFixed(2);
}

const emojis = {
  long: '🟢',
  short: '🔴',
};

function _logPositions(position: Position, newLine?: boolean) {
  const {
    price, side, pnl, type, time, size,
  } = position;

  const sideEmoji = emojis[side];
  const pnlStr = type === 'exit' ? `Pnl: ${pnl}%` : '';

  console.log(`${sideEmoji} ${dayjs(time).format('DD-MM-YYYY HH:mm:ss')} - $${price} ${type} Size: ${size} ${pnlStr}${newLine ? '\n' : ''}`);
}

export default Positions;
