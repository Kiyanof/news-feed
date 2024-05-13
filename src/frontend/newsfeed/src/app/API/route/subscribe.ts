import { SubscribeModel } from "../model/subscribe";
import { SUBSCRIBE_CONFIG } from "../conf/subscribe.conf";
import { URLGenerator } from "../conf/main.conf";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
const subscribe = async ({ ...props }: SubscribeModel) => {
  try {
    const fingerprint = await (await FingerprintJS.load()).get();

    const result = await SUBSCRIBE_CONFIG.subscribe.method(
      URLGenerator(SUBSCRIBE_CONFIG.subscribe.endpoint, SUBSCRIBE_CONFIG.subscribe.path),
      {...props, fingerPrint: fingerprint.visitorId},
      { withCredentials: true}
    );
    if(result.status !== 201) return {
      message: "Signup failed",
      error: [],
      data: null,
    };
    return result.data;
  } catch (error) {
    return {
      message: `Application error`,
      error: [error],
      data: null,
    }
  }
};

const changeSubscription = async ({ ...props }: SubscribeModel) => {
  try {
    const fingerprint = await (await FingerprintJS.load()).get();

    const result = await SUBSCRIBE_CONFIG.changeSubscription.method(
      URLGenerator(SUBSCRIBE_CONFIG.changeSubscription.endpoint, SUBSCRIBE_CONFIG.changeSubscription.path),
      {...props, fingerPrint: fingerprint.visitorId},
      { withCredentials: true}
    );
    if(result.status !== 201) return {
      message: "Change subscription failed",
      error: [],
      data: null,
    };
    return result.data;
  } catch (error) {
    return {
      message: `Application error`,
      error: [error],
      data: null,
    }
  }
}

export { subscribe, changeSubscription };
