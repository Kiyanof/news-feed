import { AUTH_CONFIG } from "../conf/auth.conf";
import { URLGenerator } from "../conf/main.conf";
import { AuthModel } from "../model/auth";

const signin = async ({ ...props }: AuthModel) => {
  try {
    const result = await AUTH_CONFIG.signin.method(
      URLGenerator(AUTH_CONFIG.signin.endpoint, ""),
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

export { signin };
