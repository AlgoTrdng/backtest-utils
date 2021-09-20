"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeframes = exports.minutes = void 0;
const minutes = {
    '1m': 1,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '4h': 240,
    '12h': 720,
    '1d': 1440,
    '1w': 10080,
};
exports.minutes = minutes;
const timeframes = {
    1: '1m',
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    240: '4h',
    720: '12h',
    1440: '1d',
    10080: '1w',
};
exports.timeframes = timeframes;
