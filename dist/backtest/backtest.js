"use strict";
// import Binance from 'binance-api-nodejs'
// import {
//   Boundaries, MergedCandlesticks, Timeframe, UnmergedCandlesticks,
// } from '../types/types'
// import constants from './constants'
// const binance = new Binance()
// const mergeCandlesticks = (unmergedCandlesticks: UnmergedCandlesticks[]): MergedCandlesticks[] => {
//   const { candlesticks: baseCandlesticks } = unmergedCandlesticks[0]
//   const mergedCandlesticks: MergedCandlesticks[] = []
//   for (let i = 0; i < baseCandlesticks.length; i += 1) {
//     const { closeTime } = baseCandlesticks[i]
//     const mergedCandlestick: MergedCandlesticks = [baseCandlesticks[i]]
//     for (let j = 1; j < unmergedCandlesticks.length; j += 1) {
//       const { candlesticks: otherTimeframesCandlesticks } = unmergedCandlesticks[j]
//       const currentCandlestick = otherTimeframesCandlesticks.find(({ closeTime: _closeTime }) => _closeTime === closeTime)
//       if (currentCandlestick) {
//         mergedCandlestick[j] = currentCandlestick
//       }
//     }
//     mergedCandlesticks.push(mergedCandlestick)
//   }
//   return mergedCandlesticks
// }
// const getCandlesticks = async (market: string, timeframes: Timeframe[], boundaries: Boundaries): Promise<MergedCandlesticks[]> => {
//   const candlesticks: UnmergedCandlesticks[] = []
//   const uniqueTimeframes = [...new Set(timeframes)].sort((a, b) => constants.minutes[a] - constants.minutes[b])
//   if (uniqueTimeframes.length === 1) {
//     const [timeframe] = uniqueTimeframes
//     const _candlesticks = await binance.spot.candlesticks(market, timeframe, boundaries)
//     return _candlesticks.map((candlestick) => ([candlestick]))
//   }
//   for (let i = 0; i < uniqueTimeframes.length; i += 1) {
//     const timeframe = uniqueTimeframes[i]
//     const currentTfCandlesticks = await binance.spot.candlesticks(market, timeframe, boundaries)
//     candlesticks.push({
//       candlesticks: currentTfCandlesticks,
//       timeframe,
//     })
//   }
//   const mergedCandlesticks = mergeCandlesticks(candlesticks)
//   return mergedCandlesticks
// }
// type Options = {
//   timeframes: Timeframe[],
//   initialSize?: number,
//   candlesticksTimeBoundaries: Boundaries,
// }
// const backtestSetup = async <T extends {}>(market: string, options: Options, state: T = {}) => {
//   const mergedCandlesticks = await getCandlesticks(market, options.timeframes, options.candlesticksTimeBoundaries)
//   // eslint-disable-next-line no-unused-vars
//   const backtest = (onNewCandlestick: (state: T, candlesticks: MergedCandlesticks) => void) => {
//     mergedCandlesticks.forEach((_candlesticks) => {
//       if (onNewCandlestick) {
//         onNewCandlestick(state, _candlesticks)
//       }
//     })
//   }
//   return {
//     backtest,
//   }
// }
// export default backtestSetup
