import logger from "../config/logger";
import SubscriberModel from "../model/subscriber";

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

const doForTheseSubscribers = async (frequency: Frequency, callback: (subscribers: Array<ISubscriber>, {...props}: any) => Promise<any>, {...props}: any) => {
    let page = 1;
    const pageSize = 10;
    let lastPage: number | null = null;

    try {
        do {
            const result = await getSubscribers(frequency, page, pageSize, lastPage);
            if (result.status) {
                lastPage = result.lastPage;
                await callback(result.subscribers, {...props});
                page = result.nextPage;
            } else {
                throw new Error("Error getting subscribers");
            }
        } while (page <= lastPage);
    } catch (error) {
        logger.error(`Error doing for these subscribers: ${error}`);
    }
}

export {
    Frequency
}
export default doForTheseSubscribers;
