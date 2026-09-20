
import express from "express";

import {
    createProperty,
    getMyProperty,
    deleteMyProperty,
    updateMyProperty,
    getAllProperties,
    getPropertyById,
    getAgentProperties,
    markPropertySold
} from "../Controllers/Property.controller.js";

import authMiddleware from "../Middlewares/Auth.middleware.js";
import agentMiddleware from "../Middlewares/Agent.middleware.js"
import upload from "../Middlewares/Upload.middleware.js";

const router = express.Router();



router.post("/create",authMiddleware,agentMiddleware,upload.array("images", 8),createProperty);
router.get("/my-properties",authMiddleware,agentMiddleware,getMyProperty);
router.put("/update/:id",authMiddleware,agentMiddleware,updateMyProperty);
router.delete("/delete/:id",authMiddleware,agentMiddleware,deleteMyProperty);
router.get("/all",getAllProperties);
router.get("/agent/:agentId",getAgentProperties);
router.get("/:id",getPropertyById);
router.patch("/sold/:propertyId",authMiddleware,agentMiddleware,markPropertySold);


export default router;

