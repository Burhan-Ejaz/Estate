import express from "express";

import {
    getAllUsers,
    getAllAgents,
    deleteAllUserandAgents,
    getPendingAgentApplication,
    approveAgent,
    rejectAgent,
    getAllProperties,
    deleteProperties
} from "../Controllers/Admin.controller.js";

import authMiddleware from "../Middlewares/Auth.middleware.js";
import adminMiddleware from "../Middlewares/Admin.middleware.js";

const router = express.Router();



router.get("/users",authMiddleware,adminMiddleware,getAllUsers);
router.delete("/users/:id",authMiddleware,adminMiddleware,deleteAllUserandAgents);

router.get("/agents",authMiddleware,adminMiddleware,getAllAgents);
router.delete("/agents/:id",authMiddleware,adminMiddleware,deleteAllUserandAgents);

router.get("/agents/applications/pending",authMiddleware,adminMiddleware,getPendingAgentApplication);
router.patch("/agents/approve/:id",authMiddleware,adminMiddleware,approveAgent);
router.patch("/agents/reject/:id",authMiddleware,adminMiddleware,rejectAgent);

router.get("/properties",authMiddleware,adminMiddleware,getAllProperties);
router.delete("/properties/:id",authMiddleware,adminMiddleware,deleteProperties);

export default router;