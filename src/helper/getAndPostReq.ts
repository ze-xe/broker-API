import { API_ENDPOINT } from './constants';
import axios from 'axios';
import BN from 'bn.js';
import {  providers } from 'near-api-js';
import type { Wallet } from '@near-wallet-selector/core/lib/wallet/wallet.types';
import { getOrderlySignature, getParamsSignature } from './utils';


export class LocalAccount {

    public accountId: string;
    public balance: BN = new BN(0);
    public provider: providers.JsonRpcProvider | null = null;
    public orderlyPrivateKey: string | null = null;
    public orderlyPublicKey: string | null = null;
    public tradingKey: string | null = null;
    public tradingKeySecret: string | null = null;
    public wallet: Wallet | null = null;


    constructor(accountId: string, orderlyPrivateKey?: string, orderlyPublicKey?: string, tradingKey?: string, tradingKeySecret?: string) {
        this.accountId = accountId;
        if (orderlyPrivateKey) this.orderlyPrivateKey = orderlyPrivateKey;
        if (orderlyPublicKey) this.orderlyPublicKey = orderlyPublicKey;
        if (tradingKey) this.tradingKey = tradingKey;
        if (tradingKeySecret) this.tradingKeySecret = tradingKeySecret;
    }

    async createGetRequest(method: 'GET', request: string) {

        try {
            if (!this.orderlyPrivateKey || !this.orderlyPublicKey) throw new Error('Orderly key pair not set');
            const timestamp = Date.now();
            const data = await axios.get(
                `${API_ENDPOINT}${request}`,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "orderly-timestamp": timestamp,
                        "orderly-account-id": this.accountId,
                        "orderly-key": this.orderlyPublicKey,
                        "orderly-signature": getOrderlySignature(this.orderlyPrivateKey, method, request, timestamp),
                    },
                }
            );

            let res;
            if (data.data.success) {
                data.status = 200;
                res = data.data.data;
            }
            else {
                data.status = 400;
                res = data.data;
            }
            return { status: true, data: res, statusCode: data.status };
        }
        catch (error: any) {
            console.log("Error @ createGetRequest", error.response.data, __filename);
            return { status: false, data: error.response.data, statusCode: error.response.status }
        }

    }


    async createPostRequest(method: 'PUT' | 'POST' | 'DELETE', request: string, data: any) {

        if (!this.orderlyPrivateKey || !this.orderlyPublicKey) throw new Error('Orderly key pair not set');
        if (!this.tradingKey || !this.tradingKeySecret) throw new Error('Trading key pair not set');
        const timestamp = Date.now();

        data.signature = getParamsSignature(this.tradingKeySecret, data);

        const config = {
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "orderly-account-id": this.accountId,
                "orderly-key": this.orderlyPublicKey,
                "orderly-trading-key": this.tradingKey.slice(2),
                "orderly-signature": getOrderlySignature(this.orderlyPrivateKey, method, request, timestamp, data),
                "orderly-timestamp": timestamp,
            }
        };
        try {
            const newData = await (axios as any)[method.toLowerCase()](`${API_ENDPOINT}${request}`, data, config);

            let res;
            if (newData.data.success) {
                newData.status = 201;
                res = newData.data.data;
            }
            else {
                newData.status = 400;
                res = newData.data;
            }

            return { status: newData.data.success, data: res, statusCode: newData.status };
        }
        catch (error: any) {

            console.log("Error @ createGetRequest", error.response.data, __filename);
            return { status: false, data: error.response.data, statusCode: error.response.status }
        }

    }
}
