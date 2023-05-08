
import { ec as EC, eddsa as EdDSA } from 'elliptic';
import * as base58 from 'bs58';
import base64url from 'base64url';
import keccak256 from 'keccak256';
const eddsa = new EdDSA('ed25519');
var secp256k1_ec = new EC('secp256k1');




export function normalizeRequestContent(timestamp: number, method: string, path: string, body: any) {
    let normalizedBody = body ? JSON.stringify(body) : '';
    return `${timestamp}${method}${path}${normalizedBody}`;
}

export function normalizeData(data: any) {
    const keys = Object.keys(data).sort();
    const normalizedData = keys.reduce((acc: string[], key) => {
        const value = data[key];
        if (value !== null) {
            if (typeof value === 'number') {
                acc.push(`${key}=${value.toFixed(8).replace(/\.?0+$/, '')}`);
            } else {
                acc.push(`${key}=${value}`);
            }
        }
        return acc;
    }, []);
    return normalizedData.join('&');
}


export function getOrderlySignature(_orderlyPrivateKey: string, method: string, request: string, timestamp: number, params = null) {
    const orderlyPrivateKey = eddsa.keyFromSecret(base58.decode(_orderlyPrivateKey.slice('ed25519:'.length)).subarray(0, 32));
    let normalizedOrderData = normalizeRequestContent(timestamp, method, request, params);
    // console.log("normalizedOrderData", normalizedOrderData);
    const dataBytes = Buffer.from(normalizedOrderData);
    let signature = Buffer.from(orderlyPrivateKey.sign(dataBytes).toHex(), 'hex').toString('base64');
    return base64url.toBase64(signature);
}

export function getParamsSignature(_tradingKeySecret: string, params: any) {
    let privateKey = _tradingKeySecret;

    // 1. use private key to generate public key
    let privKey = Buffer.from(privateKey, 'hex');

    // 2. build private/public ec key pair
    let keyPair = secp256k1_ec.keyFromPrivate(privKey);

    // 3. generate signature
    let message = normalizeData(params);
    // console.log("normalizeData", message);
    let msgHash = keccak256(message); // msgHash = 2dcffa4db2a92a05d7acbee5fe0bae1c8cfbe26cdf90d1e06c27f89a869fa2bb
    let signatureData = keyPair.sign(msgHash);
    let signatureRHexStr = signatureData.r.toString(16);
    if (signatureRHexStr.length < 64) {
        signatureRHexStr = '0'.repeat(64 - signatureRHexStr.length) + signatureRHexStr;
    }
    let signatureSHexStr = signatureData.s.toString(16);
    if (signatureSHexStr.length < 64) {
        signatureSHexStr = '0'.repeat(64 - signatureSHexStr.length) + signatureSHexStr;
    }
    let recoveryParamHexStr;
    if (signatureData.recoveryParam === 0) {
        recoveryParamHexStr = '00';
    } else if (signatureData.recoveryParam === 1) {
        recoveryParamHexStr = '01';
    }
    let signatureHexStringFinalResult =
        `${signatureRHexStr}${signatureSHexStr}${recoveryParamHexStr}`;

    return signatureHexStringFinalResult;
}