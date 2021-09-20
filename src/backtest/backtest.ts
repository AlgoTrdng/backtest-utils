import Binance from 'binance-api-nodejs'

import { minutes } from './constants'
import {
  MarketMergedCandlestick, Markets, Timestamps, States, UnmergedCandlesticks, MergedCandlesticks, OnNewCandle,
} from './types/types'

// TODO: Optimize
const mergeCandlesticks = (markets: string[], unmergedCandlesticks: UnmergedCandlesticks) => {
  const mergedCandlesticks: MergedCandlesticks = {}

  for (let i = 0; i < markets.length; i += 1) {
    const market = markets[i]
    const marketUnmergedCandlesticks = unmergedCandlesticks[market]
    const timeframes = Object.keys(marketUnmergedCandlesticks) as unknown as (keyof typeof minutes)[]

    const baseUnmergedCandlesticks = marketUnmergedCandlesticks[timeframes[0]]

    const marketMergedCandlesticks = baseUnmergedCandlesticks.map<MarketMergedCandlestick>((currentCandlestick) => {
      const { closeTime } = currentCandlestick

      const currentMergedCandlestick: MarketMergedCandlestick = {
        [timeframes[0]]: currentCandlestick,
      }

      timeframes.slice(1).forEach((timeframe) => {
        // @ts-ignore
        currentMergedCandlestick[timeframe] = marketUnmergedCandlesticks[timeframe].find(({ closeTime: _closeTime }) => _closeTime === closeTime)
      })

      return currentMergedCandlestick
    })

    mergedCandlesticks[market] = marketMergedCandlesticks
  }

  return mergedCandlesticks
}

class BacktestClient<S extends {}> {
  binance = new Binance()

  markets: Markets

  timestamps: Timestamps

  showLogs: boolean

  states: States<S> = {}

  // Market timeframes have to be sorted from lowest to highest
  // TODO: sort timeframes automatically
  constructor(markets: Markets, initialState: S, timestamps: Timestamps, showLogs = false) {
    this.markets = markets
    this.timestamps = timestamps
    this.showLogs = showLogs

    Object.keys(markets).forEach((market) => {
      this.states[market] = initialState
    })
  }

  private async fetchAndMergeCandlesticks() {
    const markets = Object.keys(this.markets)

    const candlesticks: UnmergedCandlesticks = {}

    this._log('Loading candlesticks')
    for (let i = 0; i < markets.length; i += 1) {
      const market = markets[i]
      const timeframes = this.markets[market]

      for (let j = 0; j < timeframes.length; j += 1) {
        const timeframe = timeframes[j]
        const currentMarketCandlesticks = await this.binance.spot.candlesticks(market, timeframe, this.timestamps)
        candlesticks[market] = {
          ...candlesticks[market],
          [timeframe]: currentMarketCandlesticks,
        }
      }
    }

    return mergeCandlesticks(markets, candlesticks)
  }

  // eslint-disable-next-line no-unused-vars
  async runBacktest(onNewCandle: OnNewCandle<S>) {
    const mergedCandlesticks = await this.fetchAndMergeCandlesticks()
    this._log('Candlesticks loaded and merged')
    Object.keys(mergedCandlesticks).forEach((market) => {
      mergedCandlesticks[market].forEach((candlestick) => {
        onNewCandle({
          state: this.states[market],
          candlestick,
          market,
        })
      })
    })
  }

  private _log(message: string) {
    if (this.showLogs) {
      console.log(message)
    }
  }
}

export default BacktestClient
