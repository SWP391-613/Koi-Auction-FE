import { getCookie } from "./cookieUtils";

export const getUserCookieToken = (): string | null => {
  return getCookie("access_token");
};
