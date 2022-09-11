import express from "express";
import { getHistory, newEntrie } from "../controllers/entries.controller.js";
import authorizationMiddleware from "../middlewares/ authorization.middleware.js";

const router = express.Router();

router.use(authorizationMiddleware);

router.post("/entrie", newEntrie);
router.get("/history", getHistory);

export default router;
