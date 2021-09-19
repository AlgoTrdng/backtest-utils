import { CandlesticksMessage, CandlesticksResponse } from 'binance-api-nodejs'
import constants from '../backtest/constants'

export type Timeframe = keyof typeof constants.minutes

export type Boundaries = {
  startTime: number
  endTime: number
}

export type UnmergedCandlesticks = {
  timeframe: Timeframe
  candlesticks: CandlesticksResponse[]
}

export interface MergedCandlesticks extends Array<CandlesticksResponse | undefined> {
  0: CandlesticksResponse
}
