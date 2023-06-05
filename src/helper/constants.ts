export const CONTRACT_ID = process.env.NEXT_PUBLIC_NETWORK == 'mainnet' ? 'asset-manager.orderly.near' : 'asset-manager.orderly.testnet';
export const FAUCET = process.env.NEXT_PUBLIC_NETWORK == 'mainnet' ? null : "ft-faucet-usdc.orderly.testnet";
export const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK == 'mainnet' ? "mainnet" : "testnet";
export const BROKER_ID = "zexe_dex";
export const API_ENDPOINT = process.env.NEXT_PUBLIC_NETWORK == 'mainnet' ? "https://api.orderly.org" : "https://testnet-api.orderly.org";
export const WS_ENDPOINT = process.env.NEXT_PUBLIC_NETWORK == 'mainnet' ? "wss://ws.orderly.org" : "wss://testnet-ws.orderly.org";
export const PRIVATE_WS_ENDPOINT = process.env.NEXT_PUBLIC_NETWORK == 'mainnet' ? "wss://ws-private.orderly.org" : "wss://testnet-ws-private.orderly.org";
export const BASIS_POINTS = 10000;

export const ASSET_URL = (symbol: string) => `https://oss.woo.network/static/symbol_logo/${symbol}.png`;

export const EXPLORER_URL = process.env.NEXT_PUBLIC_NETWORK == 'mainnet' ? "https://explorer.near.org" : "https://explorer.testnet.near.org";

export namespace WS_IDS {
    export const ORDERBOOK_REQUEST = "ob_req";
    export const ORDERBOOK_UPDATE = "ob_update";
    export const TRADE = 'trade'
    export const BBOS_SUBSCRIPTION = "bbos_sub";
    export const _24H_TICKERS_SUBSCRIPTION = "tickers_sub";
}

export namespace WS_TOPICS {
    export const ORDERBOOK_UPDATE = "orderbook";
    export const TRADE = 'trade';
    export const BBOS = "bbos";
    export const TICKERS = "tickers";
}

export const ASSET_NAMES: any = {
    "ETH": "Ethereum",
    "WBTC": "Wrapped Bitcoin",
    "USDC": "USD Coin",
    "LINK": "Chainlink",
    "SWEAT": "Sweatcoin",
    "REF": "Ref Finance",
    "WOO": "Woo Token",
    "AURORA": "Aurora",
    "NEAR": "Near Protocol",
    "USDT": "Tether USD",
}

export const ORDERTYPES: any = {
    '2': 'IOC',
    '3': 'FOK',
    '4': 'POST_ONLY',
}

export const ORDER_DESCRIPTIONS: any = {
    '2': 'Immediate or Cancel: It matches as much as possible at the order_price. If not fully executed, then remaining quantity will be cancelled',
    '3': 'Fill or Kill: The order can be fully executed at the order_price then the order gets fully executed otherwise would be cancelled without any execution',
    '4': 'The order will be executed with any maker trades at the time of placement, then it will be cancelled without any execution',
}

export const ERROR: { [key: string]: string } = {
    ORDERLY_PUBLIC_KEY_NOT_FOUND: "ORDERLY_PUBLIC_KEY_NOT_SET_IN_.ENV",
    ORDERLY_PRIVATE_KEY_NOT_FOUND: "ORDERLY_PRIVATE_KEY_NOT_SET_IN_.ENV",
    TRADING_PUBLIC_KEY_NOT_FOUND: "TRADING_PUBLIC_KEY_NOT_SET_IN_.ENV",
    TRADING_SECRET_KEY_NOT_FOUND: "TRADING_SECRET_KEY_NOT_SET_IN_.ENV",
    ACCOUNT_ID_NOT_FOUND: "ACCOUNT_ID_NOT_SET_IN_.ENV",
    BROKER_ID_NOT_FOUND: "broker_id is required",
    DATE_NOT_FOUND: "star_date or end_date undefined",
    DATE_FORMAT_NOT_VALID: "NOT_A_VALID_DATE_FORMAT, YYYY-MM-DD REQUIRED",
    FEE_RATE_REQUIRED: "either maker_fee_rate or taker_fee_rate required",
    ORDERLY_PUBLIC_KEY_NOT_VALID: "orderlyPublicKey not valid",
    DATE_NOT_IN_VALID_RANGE : "date diffence must be less then 90 days"
}

export const dateRegex = /^(?:19|20|21|22|23|24|25|26|27|28|29|30)\d\d-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)$/;
