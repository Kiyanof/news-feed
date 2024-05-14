import { Router } from "express";
import { listRelatedNews } from "../controller/news";

const router = Router();

router.get("/news", listRelatedNews)

export default router;
