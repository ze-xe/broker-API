import express  from "express";
import { handleGetReq } from "../controller/handleGetReq";
import { handlePostReq } from "../controller/handlePostReq";

const router = express.Router();


router.get("/orderly/user_data", handleGetReq);
router.post("/orderly/fee_rate", handlePostReq);

export default router;