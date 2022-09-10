import express from "express";
import { newEntrie } from "../controllers/entries.controller.js";

const router = express.Router();

router.post("/entrie", newEntrie);

export default router;
