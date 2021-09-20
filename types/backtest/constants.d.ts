declare const minutes: {
    readonly '1m': 1;
    readonly '5m': 5;
    readonly '15m': 15;
    readonly '30m': 30;
    readonly '1h': 60;
    readonly '4h': 240;
    readonly '12h': 720;
    readonly '1d': 1440;
    readonly '1w': 10080;
};
declare const timeframes: {
    readonly 1: "1m";
    readonly 5: "5m";
    readonly 15: "15m";
    readonly 30: "30m";
    readonly 60: "1h";
    readonly 240: "4h";
    readonly 720: "12h";
    readonly 1440: "1d";
    readonly 10080: "1w";
};
export { minutes, timeframes, };
