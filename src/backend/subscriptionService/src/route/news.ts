import { Router } from "express";
import { countRelatedNews, listRelatedNews } from "../controller/news";
import { createAuthenticationMiddleware } from "tokenizer"
import SubscriberModel from "../model/subscriber";

const router = Router();

const authenticate = createAuthenticationMiddleware(SubscriberModel)

router.get("/", authenticate, listRelatedNews)
router.get("/count", authenticate, countRelatedNews)

export default router;
