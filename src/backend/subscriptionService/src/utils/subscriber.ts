import Rabbit from "rabbitmq";
import logger from "../config/logger";
import SubscriberModel from "../model/subscriber";
import { addKeyword, parsePrompt } from "./subscription";
import { RABBIT_URL } from "src/config/rabbit.conf";
import { embedding } from "./news";

enum Frequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

const countAllSubscriber = async (frequency: Frequency) => {
  try {
    return await SubscriberModel.countDocuments({ frequency });
  } catch (error) {
    return 0;
  }
};

interface ISubscriber {
  email: string;
  parsedPrompt: string;
}

interface IResult {
  status: boolean;
  subscribers: Array<ISubscriber>;
  currentPage: number;
  nextPage: number;
  lastPage: number;
}

const getSubscribers = async (
  frequency: Frequency,
  page: number,
  pageSize: number,
  lastPage?: number | null
): Promise<IResult> => {
  logger.defaultMeta = { label: "subscriber " };
  const limit = pageSize;
  const skip = (page - 1) * pageSize;

  try {
    const lastPageNumber =
      lastPage ?? Math.ceil((await countAllSubscriber(frequency)) / pageSize);
    const result = await SubscriberModel.find({ frequency })
      .limit(limit)
      .skip(skip)
      .select("email parsedPrompt");

    if (
      result.length <= 0 ||
      page > lastPageNumber ||
      page < 1 ||
      pageSize < 1 ||
      !result
    ) {
      throw new Error("No subscribers found");
    }

    return {
      status: true,
      subscribers: [],
      currentPage: page,
      nextPage: page + 1,
      lastPage: lastPageNumber,
    };
  } catch (error) {
    logger.error(`Error getting subscribers: ${error}`);
    return {
      status: false,
      subscribers: [],
      currentPage: page,
      nextPage: 0,
      lastPage: 0,
    };
  }
};

const doForTheseSubscribers = async (
  frequency: Frequency,
  callback: (
    subscribers: Array<ISubscriber>,
    { ...props }: any
  ) => Promise<any>,
  { ...props }: any
) => {
  let page = 1;
  const pageSize = 10;
  let lastPage: number | null = null;

  try {
    do {
      const result = await getSubscribers(frequency, page, pageSize, lastPage);
      if (result.status) {
        lastPage = result.lastPage;
        await callback(result.subscribers, { ...props });
        page = result.nextPage;
      } else {
        throw new Error("Error getting subscribers");
      }
    } while (page <= lastPage);
  } catch (error) {
    logger.error(`Error doing for these subscribers: ${error}`);
  }
};

const addSubsciber = async ({
  email,
  prompt,
  frequency,
}: {
  email: string;
  prompt: string;
  frequency: Frequency;
}): Promise<{result: boolean}> => {
  logger.info(`Adding subscriber: ${email}`);
  try {

    logger.debug(`Connecting to RabbitMQ...`)
    const rabbit = Rabbit.new({
      url: RABBIT_URL
    })
    if(!await rabbit.isReady()) {throw new Error('RabbitMQ connection failed')}
    logger.info(`Connected to RabbitMQ`)
    logger.debug(`Calling parsePrompt procedure...`)
    const parsedPrompt = await rabbit.callProcedure(parsePrompt, { content: prompt })
    if(!parsedPrompt) {throw new Error('Prompt parsing failed')}
    logger.info(`Prompt parsed successfully`)
    const isKeywordAdded = addKeyword(parsedPrompt)
    if(!isKeywordAdded) {throw new Error('Keyword adding failed')}
    logger.debug(`Calling embedding procedure...`)
    const embeddingParsedPrompt = await rabbit.callProcedure(embedding, { parsedPrompt })
    if(!embeddingParsedPrompt) {throw new Error('Prompt embedding failed')}
    logger.info(`Prompt embedded successfully`)

    logger.debug(`Checking if subscriber exists...`)
    const isExist = await SubscriberModel.findOne({email})
    if(isExist) {
      logger.info(`Subscriber exists, updating...`)
      isExist.prompt = prompt
      isExist.frequency = frequency
      isExist.parsedPrompt = parsedPrompt
      isExist.embeddingParsedPrompt = JSON.stringify(Array.from(embeddingParsedPrompt))
      // isExist.lastNewsSummerized = lastNewsSummerized
      // isExist.lastRelatedNewsIDs = lastRelatedNewsIDs
      await isExist.save()
      logger.info(`Subscriber updated successfully`)
    } else {
      logger.debug(`Subscriber does not exist, creating...`)
      new SubscriberModel({
        email,
        prompt,
        frequency,
        parsedPrompt,
        embeddingParsedPrompt: JSON.stringify(Array.from(embeddingParsedPrompt)),
        // lastNewsSummerized,
        // lastRelatedNewsIDs
      })
      logger.debug(`Subscriber created successfully`)
    }

    logger.info(`Subscriber added successfully`)
    return {result: true}
  } catch (error) {
    logger.error(`Error adding subscriber: ${error.message}`);
    return {result: false};
  }
};

export { Frequency, addSubsciber };
export default doForTheseSubscribers;
