import { CandlesticksResponse } from 'binance-api-nodejs'
import { minutes } from '../constants'

export type Markets = {
  [market: string]: (keyof typeof minutes)[]
}

export type MarketUnmergedCandlesticks = {
  // eslint-disable-next-line no-unused-vars
  [K in keyof typeof minutes]: CandlesticksResponse[]
}

export type UnmergedCandlesticks = {
  [market: string]: MarketUnmergedCandlesticks
}

export type MarketMergedCandlestick = {
  // eslint-disable-next-line no-unused-vars
  [K in keyof typeof minutes]?: CandlesticksResponse
}

export type MergedCandlesticks = {
  [market: string]: MarketMergedCandlestick[]
}

export type Timestamps = {
  startTime: number
  endTime: number
}

export type OnNewCandlePayload<S> = {
  candlestick: MarketMergedCandlestick
  market: string
  state: S
}

// eslint-disable-next-line no-unused-vars
export type OnNewCandle<S> = (onNewCandleParams: OnNewCandlePayload<S>) => void

export type States<S> = {
  [market: string]: S
}
