import QDrantController from "../lib/v2/QDdrant";
import logger from "../config/logger";
import NewsModel from "../model/news";
import { QDRANT_URL } from "../config/qdrant.conf";
import summerizeNews from "../producer/summerizeNews";
import Rabbit from "rabbitmq";
import { RABBIT_URL } from "src/config/rabbit.conf";

interface INews {
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  publishedAt: Date;
}

interface IResult {
  news: Array<INews>;
}

const readTheseNews = async ({
  newsID,
}: {
  newsID: Array<string>;
}): Promise<IResult> => {
  logger.defaultMeta = { label: "readTheseNews" };
  logger.info("Reading news with IDs... ");

  try {
    const results = await NewsModel.find({ _id: { $in: newsID } })
      .sort({ createdAt: -1 })
      .select("title description content author category publishedAt");

    if (!results || results.length <= 0) {
      logger.warn("No news found with the given IDs");
      return { news: [] };
    }

    logger.info("News found with the given IDs");
    return { news: results };
  } catch (error) {
    logger.error("Error reading news with the given IDs");
    logger.error(error);
    return { news: [] };
  }
};

enum Frequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

const readFeeds = async (
  {
    parsedPrompt,
    frequency,
    prompt,
  }: { parsedPrompt: string; frequency: Frequency; prompt: string }
): Promise<any> => {
  logger.defaultMeta = { label: "readFeeds" };
  logger.info("Reading news feeds...");

  try {
    logger.debug("Converting parsed prompt to Float32Array");
    const query = Float32Array.from(JSON.parse(parsedPrompt));
    logger.debug("Finding relevants...");
    const relevants = await new QDrantController(
      QDRANT_URL
    ).findRelevantDocuments("news", query, 10, frequency);

    if (!relevants || relevants.status !== "ok") {
      logger.warn("No relevants found");
      throw new Error("Error finding relevants");
    }
    logger.info("Relevants found");
    logger.debug("Finding news IDs with relevants");
    const newsIDs = relevants.result.map((item: any) => item.id);
    if (!newsIDs || newsIDs.length <= 0) {
      logger.warn("No news IDs found");
      throw new Error("Error finding news IDs");
    }
    logger.info("News IDs found");
    logger.debug("Finding news with news IDs");
    const news = await NewsModel.find({ _id: { $in: newsIDs } }).select(
      "content"
    );
    if (!news || news.length <= 0) {
      logger.warn("No news found");
      throw new Error("Error finding news");
    }
    logger.debug("Summarizing news");
    const rabbit = Rabbit.new({url: RABBIT_URL})
    if(!await rabbit.isReady()){
        logger.error("Error connecting to RabbitMQ");
        throw new Error("Error connecting to RabbitMQ");
    }
    const summery = await rabbit.callProcedure(summerizeNews, { content: news, keywords: prompt })
    if (!summery) {
      logger.warn("No summery found");
      throw new Error("Error finding summery");
    }
    logger.info("Summery found");
    return { summery, relevanceNews: newsIDs };
  } catch (error) {
    logger.error("Error reading news feeds");
    logger.error(error);
    return { summery: null, relevanceNews: [] };
  }
};

export { readTheseNews, readFeeds };
