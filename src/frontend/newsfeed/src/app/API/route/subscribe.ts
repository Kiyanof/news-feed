import { SubscribeModel } from "../model/subscribe";
import { SUBSCRIBE_CONFIG } from "../conf/subscribe.conf";
import { URLGenerator } from "../conf/main.conf";

const subscribe = async ({ ...props }: SubscribeModel) => {
  try {
    const result = await SUBSCRIBE_CONFIG.subscribe.method(
      URLGenerator(SUBSCRIBE_CONFIG.subscribe.endpoint, ""),
      {
          body: JSON.stringify(props),
      }
    );
    if(result.status !== 200) return null;
    return result.data;
  } catch (error) {
    return null
  }
};

export { subscribe };
