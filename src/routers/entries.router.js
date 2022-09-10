import express from "express";
import { getHistory, newEntrie } from "../controllers/entries.controller.js";

const router = express.Router();

router.post("/entrie", newEntrie);
router.get("/history", getHistory);

export default router;
