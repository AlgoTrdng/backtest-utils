export type Side = 'long' | 'short'

export type State = 'opened' | 'closed'

export type Position = {
  relativePositionSize: number
  entrySize: number
  closeSize?: number
  side: Side
  state: State
  entryPrice: number
  closePrice?: number
  pnl?: number
  profit?: number
  openTimestamp?: number
  closeTimestamp?: number
}

export type Positions = {
  [market: string]: Position[]
}

export type MarketStatistics = {
  size: number
  pnl: number
  positionsAmt: number
  profitablePositionsAmt: number
  hitRate: number | null
  maxLoss: number
}

export type Statistics = {
  [market: string]: MarketStatistics
}

export type EnterPositionParams = {
  market: string
  entryPrice: number
  side: Side
  relativePositionSize?: number
  openTimestamp?: number
}

export type ExitPositionParams = {
  market: string
  closePrice: number
  closeTimestamp?: number
}
