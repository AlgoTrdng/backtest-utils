import {
  Side, Positions, Statistics, Position, MarketStatistics, State, EnterPositionParams, ExitPositionParams,
} from './types/types'

/**
 * Calculates multiple of initial size
 */
export const getPnl = (side: Side, entryPrice: number, closePrice: number) => {
  let profit = 0

  if (side === 'long') {
    profit = closePrice / entryPrice
    return profit
  }

  if (side === 'short') {
    profit = 1 - (closePrice / entryPrice) + 1
    return profit
  }

  // eslint-disable-next-line no-throw-literal
  throw 'Invalid side'
}

class PositionsManager {
  private positions: Positions

  private statistics: Statistics

  markets: string[]

  baseSize: number

  constructor(baseSize: number, markets: string[]) {
    this.baseSize = baseSize
    this.markets = markets

    this.statistics = markets.reduce<Statistics>((acc, market) => {
      acc[market] = {
        size: baseSize,
        pnl: 0,
        positionsAmt: 0,
        profitablePositionsAmt: 0,
        hitRate: null,
        maxLoss: 0,
      }
      return acc
    }, {})

    this.positions = markets.reduce<Positions>((_positions, market) => {
      _positions[market] = []
      return _positions
    }, {})
  }

  /**
   * Enters position
   */
  enterPosition({
    market, entryPrice, side, relativePositionSize = 1, openTimestamp,
  }: EnterPositionParams) {
    if (!this.markets.includes(market)) {
      console.log('Invalid market')
      return undefined
    }

    const { size } = this.statistics[market]

    const position: Position = {
      entrySize: size * relativePositionSize,
      state: 'opened',
      relativePositionSize,
      entryPrice,
      side,
      openTimestamp,
    }

    this.positions[market].push(position)

    return position
  }

  /**
   * Exits position
   */
  exitPosition({ market, closePrice }: ExitPositionParams) {
    const lastPosition = this.getLastPosition(market)

    if (!lastPosition || lastPosition.state !== 'opened') {
      console.log('Position not opened')
      return undefined
    }

    const { entryPrice, entrySize, side } = lastPosition
    const pnl = getPnl(side, entryPrice, closePrice)

    const closeSize = entrySize * pnl

    const closedPosition: Position = {
      ...lastPosition,
      state: 'closed',
      closeSize,
      closePrice,
      pnl,
    }
    this.updateOpenedPosition(market, closedPosition)

    const {
      size, positionsAmt, profitablePositionsAmt, maxLoss,
    } = this.statistics[market]
    const newSize = size + closeSize - entrySize

    const updatedMarketStats = {
      size: newSize,
      pnl: newSize / this.baseSize,
      positionsAmt: positionsAmt + 1,
      profitablePositionsAmt: pnl > 1 ? profitablePositionsAmt + 1 : profitablePositionsAmt,
      maxLoss: Math.min(maxLoss, pnl - 1),
    }

    this.updateMarketStats(market, {
      ...updatedMarketStats,
      hitRate: updatedMarketStats.profitablePositionsAmt / updatedMarketStats.positionsAmt,
    })

    return closedPosition
  }

  private updateMarketStats(market: string, newStats: MarketStatistics) {
    if (!this.markets.includes(market)) {
      console.log('Invalid market')
      return
    }

    this.statistics[market] = newStats
  }

  private updateOpenedPosition(market: string, position: Position) {
    this.positions[market][this.positions[market].length - 1] = position
    return position
  }

  /**
   * Get all positions
   */
  get getPositions() {
    return this.positions
  }

  /**
   * Get market specific positions
   */
  get getMarketPositions() {
    return (market: string) => this.positions[market]
  }

  /**
   * Gets last position from based on specifies market
   */
  get getLastPosition() {
    return (market: string) => {
      const currentMarketPositions = this.positions[market]

      if (!currentMarketPositions) {
        return undefined
      }

      return currentMarketPositions[currentMarketPositions.length - 1]
    }
  }

  /**
   * Gets all positions based on specified state
   */
  get getPositionsByState() {
    return (market: string, state: State) => {
      const currentMarketPositions = this.positions[market]

      if (!currentMarketPositions) {
        return []
      }

      return currentMarketPositions.filter(({ state: _state }) => _state === state)
    }
  }

  get getStatistics() {
    return this.statistics
  }

  get getMarketStatistics() {
    return (market: string) => this.statistics[market]
  }
}

export default PositionsManager
