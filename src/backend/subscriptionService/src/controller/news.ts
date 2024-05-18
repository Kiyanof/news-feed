import { Request, Response } from "express";
import SubscriberModel from "../model/subscriber";
import logger from "../config/logger";
import Rabbit from 'rabbitmq'
import { RABBIT_URL } from "../config/rabbit.conf";
import { readTheseNews } from "../utils/news";

const listRelatedNews = async (req: Request, res: Response) => {
    const { email } = req.body
    const page = +(req.query.page || 1)
    const pageSize = 10 // TODO: Move to config file
    const skip = (page - 1) * pageSize

    try {
        const subscriber = await SubscriberModel.findOne({ email })
                                                .select('lastRelatedNewsIDs lastNewsSummerized')


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

        const newsIDs = subscriber.lastRelatedNewsIDs.slice(skip, skip + pageSize)

        const wholeNews = await rabbit.callProcedure(readTheseNews, { newsID: newsIDs })
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
                news: wholeNews,
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

const countRelatedNews = async (req: Request, res: Response) => {
    const { email } = req.body

    try {
        const subscriber = await SubscriberModel.findOne({ email }).select('lastRelatedNewsIDs')
        if (!subscriber) {
            logger.warn(`Subscriber with email ${email} not found`)
            return res.status(404).json({
                message: "Subscriber not found",
                error: ['Email not found'],
                data: null
            })
        }

        return res.status(200).json({
            message: "Success",
            error: [],
            data: {
                count: subscriber.lastRelatedNewsIDs.length
            }
        })
    } catch (error) {
        logger.error(`Failed to count related news for ${email}`)
        return res.status(500).json({
            message: "Internal Server Error",
            error: [`Failed to count related news for ${email}`],
            data: null
        })
    }
}

export {
    listRelatedNews,
    countRelatedNews
}