import { AUTH_CONFIG } from "../conf/auth.conf";
import { URLGenerator } from "../conf/main.conf";
import { AuthModel } from "../model/auth";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const signin = async ({ ...props }: AuthModel) => {
  try {
    const fingerprint = await (await FingerprintJS.load()).get();

    const result = await AUTH_CONFIG.signin.method(
      URLGenerator(AUTH_CONFIG.signin.endpoint, AUTH_CONFIG.signin.path),
      {...props, fingerPrint: fingerprint.visitorId},
      { withCredentials: true}
    );
    if(result.status !== 200) return null;
    return result.data;
  } catch (error) {
    return null
  }
};

const whoIsMe = async () => {
  try {
    const fingerprint = await (await FingerprintJS.load()).get();

    const result = await AUTH_CONFIG.whoisme.method(
      URLGenerator(AUTH_CONFIG.whoisme.endpoint, AUTH_CONFIG.whoisme.path),
      {fingerPrint: fingerprint.visitorId},
      { withCredentials: true}
    );

    if(result.status !== 200) return null;
    return result.data;
  } catch (error) {
    return null
  }
}

const logout = async ({...props}: {email: string}) => {
  try {
    const fingerprint = await (await FingerprintJS.load()).get();

    const result = await AUTH_CONFIG.logout.method(
      URLGenerator(AUTH_CONFIG.logout.endpoint, AUTH_CONFIG.logout.path),
      {fingerPrint: fingerprint.visitorId},
      { withCredentials: true}
    );

    if(result.status !== 200) return null;
    return result.data;
  } catch (error) {
    return null
  }
}

export { signin, whoIsMe, logout };
