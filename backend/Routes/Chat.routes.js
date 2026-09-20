import express from "express";

import { getStreamToken, createPropertyChannel } from "../Controllers/Chat.controller.js";
import authMiddleware from "../Middlewares/Auth.middleware.js";

const router = express.Router();

router.get("/token", authMiddleware, getStreamToken);
router.post("/channel", authMiddleware, createPropertyChannel);

export default router;
