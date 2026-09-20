import express from "express";
import { addFavourite, getMyFavourite, removeFavourite } from "../Controllers/Favourite.controller.js";
import authMiddleware from "../Middlewares/Auth.middleware.js";

const router = express.Router();

router.get("/my-favourites", authMiddleware, getMyFavourite);
router.post("/add/:propertyId", authMiddleware, addFavourite);
router.delete("/remove/:propertyId", authMiddleware, removeFavourite);


export default router;