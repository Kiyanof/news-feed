import { Request, Response } from "express";
import logger from "../config/logger";
import NewsModel from "src/model/news";

const readDailyNews = async (req: Request, res: Response) => {
    const { email } = req.body;
    const page = +(req.query.page || 1); // example route: /news?page=1
    const limit = 10;
    const skip = (page - 1) * limit;
 
    try {
        const results = await NewsModel.find({ publishedAt: { $gte: new Date() } }).skip(skip).limit(limit).sort({ publishedAt: -1 }); // sort by publishedAt in descending order
    } catch (error) {
        logger.error(`Error in readNews: ${error}`);
        res.status(500).json({
            errors: [],
            message: "Internal server error",
            data: null
        })
    }
}