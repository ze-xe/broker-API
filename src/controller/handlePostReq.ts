import { ERROR } from "../helper/constants";
import { LocalAccount } from "../helper/getAndPostReq";
import { Request, Response } from 'express';




require("dotenv").config();

export async function handlePostReq(req: Request, res: Response) {
    try {

        const orderlyPublicKey = process.env.ORDERLY_PUBLIC_KEY;
        const orderlyPrivateKey = process.env.ORDERLY_PRIVATE_KEY;
        const tradingPublicKey = process.env.TRADING_PUBLIC_KEY;
        const tradingSecretKey = process.env.TRADING_SECRET_KEY;
        const accountId = process.env.ACCOUNT_ID;

        if (!orderlyPublicKey) {
            return res.status(400).send({ status: false, message: ERROR.ORDERLY_PUBLIC_KEY_NOT_FOUND });
        }
        else if (!orderlyPrivateKey) {
            return res.status(400).send({ status: false, message: ERROR.ORDERLY_PRIVATE_KEY_NOT_FOUND });
        }
        else if (!tradingPublicKey) {
            return res.status(400).send({ status: false, message: ERROR.TRADING_PUBLIC_KEY_NOT_FOUND });
        }
        else if (!tradingSecretKey) {
            return res.status(400).send({ status: false, message: ERROR.TRADING_SECRET_KEY_NOT_FOUND });
        }
        else if (!accountId) {
            return res.status(400).send({ status: false, message: ERROR.ACCOUNT_ID_NOT_FOUND });
        }

        const bodyData = req.body;

        const { broker_id, maker_fee_rate, taker_fee_rate } = req.body;

        if (!broker_id) {
            return res.status(400).send({ status: false, message: ERROR.BROKER_ID_NOT_FOUND });
        }

        else if (!maker_fee_rate && !taker_fee_rate) {
            return res.status(400).send({ status: false, message: ERROR.FEE_RATE_REQUIRED });
        }

        const request = `/v1/broker/fee_rate`;
        const localAccount = new LocalAccount(accountId, orderlyPrivateKey, orderlyPublicKey, tradingPublicKey, tradingSecretKey);
        try {
            const data = await localAccount.createPostRequest("POST", request, bodyData);
            return res.status(data.statusCode).send({ status: data.status, data: data.data });
        }
        catch (error: any) {
            return res.status(400).send({ status: false, message: error.message });
        }
    }
    catch (error: any) {
        console.log("Error @ handleGetReq", error, __filename);
    }
}