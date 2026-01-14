import express from "express"
import Middleware from "../utils/middleware";
import { CreateBid, GetallBidByGigId, getAllBids, getAllBidsForClients, getAllBidsForFreeLancer, HireFreeLancer } from "../controller/bid.controller";


const router = express.Router();

router.post("/", Middleware, CreateBid);

router.patch("/:bidId/hire", Middleware, HireFreeLancer);
router.get("/free", Middleware, getAllBidsForFreeLancer)
router.get("/client", Middleware, getAllBidsForClients)

router.get("/:gigId", Middleware, GetallBidByGigId);





export default router;