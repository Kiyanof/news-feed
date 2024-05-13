import { Request, Response } from "express";
import SubscriberModel from "../model/subscriber";
import logger from "../config/logger";
import { readNews } from "../utils/subscription";
import Rabbit from 'rabbitmq'
import { RABBIT_URL } from "src/config/rabbit.conf";

const listRelatedNews = async (req: Request, res: Response) => {
    const { email } = req.body

    try {
        const subscriber = await SubscriberModel.findOne({ email }).select('lastRelatedNewsIDs lastNewsSummerized')

        if(!subscriber){
            logger.warn(`Subscriber with email ${email} not found`)
            return res.status(404).json({
                message: "Subscriber not found",
                error: ['Email not found'],
                data: null
            })
        }

        const rabbit = Rabbit.new({
            url: RABBIT_URL
        })

        if(!await rabbit.isReady()) {
            logger.error("RabbitMQ is not ready")
            return res.status(500).json({
                message: "Internal Server Error",
                error: ["RabbitMQ is not ready"],
                data: null
            })
        }

        const wholeNews = await rabbit.callProcedure(readNews, { ids: subscriber.lastRelatedNewsIDs })

        if(!wholeNews){
            logger.error("Failed to read news")
            return res.status(500).json({
                message: "Internal Server Error",
                error: ["Failed to read news"],
                data: null
            })
        }

        return res.status(200).json({
            message: "Success",
            error: [],
            data: {
                news: wholeNews.results,
                lastNewsSummerized: subscriber.lastNewsSummerized
            }
        })
    } catch (error) {
        logger.error(error)
        return res.status(500).json({
            message: "Internal Server Error",
            error: [error.message],
            data: null
        })
    }
}

export {
    listRelatedNews
}