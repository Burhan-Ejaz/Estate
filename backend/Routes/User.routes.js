
import express from "express";

import {
    getProfile,
    deleteProfile,
    updateProfile,
    applyForAgent,
    checkAgentApplication
} from "../Controllers/User.controller.js";
import { getAllAgents } from "../Controllers/Admin.controller.js";

import authMiddleware from "../Middlewares/Auth.middleware.js";

const router = express.Router();


router.get("/agents",getAllAgents);
router.get("/profile",authMiddleware,getProfile);
router.put("/profile",authMiddleware,updateProfile);
router.delete("/profile",authMiddleware,deleteProfile);
router.post("/apply-agent",authMiddleware,applyForAgent);
router.get("/agent-application",authMiddleware,checkAgentApplication);


export default router;

