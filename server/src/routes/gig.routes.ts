import express from "express"
import { CreateGig, getAllGigs } from "../controller/gig.controller";
import Middleware from "../utils/middleware";

const router = express.Router();

router.post("/", Middleware, CreateGig)
router.get("/", Middleware, getAllGigs)

export default router
