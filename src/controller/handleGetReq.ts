import { ERROR, dateRegex } from "../helper/constants";
import { LocalAccount } from "../helper/getAndPostReq";
import { Request, Response } from 'express';
import NodeCache from 'node-cache'



const getCache = new NodeCache({ stdTTL: 60, checkperiod: 60 });


require("dotenv").config();

export async function handleGetReq(req: Request, res: Response) {
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
        const { start_date, end_date, broker_id } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).send({ status: false, message: ERROR.DATE_NOT_FOUND });
        }
        else if (!dateRegex.test(start_date as string) || !dateRegex.test(end_date as string)) {
            return res.status(400).send({ status: false, message: ERROR.DATE_FORMAT_NOT_VALID });
        }
        else if (!broker_id) {
            return res.status(400).send({ status: false, message: ERROR.BROKER_ID_NOT_FOUND });
        }
        const request = `/v1/volume/broker/daily?start_date=${start_date}&end_date=${end_date}&broker_id=${broker_id}`;
        const localAccount = new LocalAccount(accountId, orderlyPrivateKey, orderlyPublicKey, tradingPublicKey, tradingSecretKey);

        // caching 
        if (getCache.has(`${start_date}-${end_date}`)) {
            const data: any = getCache.get(`${start_date}-${end_date}`);
            const set = new Set()
            data.data.forEach((e: any) => {
                set.add(e.account_id);
            });
            console.log("NO_OF_USER - cache", Array.from(set).length);
            return res.status(200).send(data);
        }

        try {
            const data = await localAccount.createGetRequest("GET", request);

            if (data.status) {
                const set = new Set()
                if (data.status)
                    data.data.forEach((e: any) => {
                        set.add(e.account_id);
                    });
                console.log("NO_OF_USER", Array.from(set).length);
                
                // setting cache
                getCache.set(`${start_date}-${end_date}`, { status: data.status, data: data.data }, 120);
            };

            return res.status(data.statusCode).send({ status: data.status, data: data.data });
        }
        catch (error: any) {
            console.log(error.message)
            return res.status(400).send({ status: false, message: error.message });
        }
    }
    catch (error: any) {
        console.log("Error @ handleGetReq", error, __filename);
    }
}