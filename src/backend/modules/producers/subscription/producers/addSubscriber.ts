import { Channel, createProducer } from "rabbitmq";

const addSubscriberProducer = async (
  channel: Channel,
  content: {
    email: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    prompt: string;
  },
  callback?: (content: Object) => Promise<any>
) => {
  const producer = createProducer({
    proceduerName: "subscription/addSubscriber",
    defaultQueue: "addSubscriber",
  });

  return producer(channel, content, callback);
};

export default addSubscriberProducer;
