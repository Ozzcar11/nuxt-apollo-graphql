import { type CookieOptions } from "nuxt/app";

export const USER_COOKIE_NAME = "user";
export const USER_COOKIE_OPTIONS: CookieOptions = {
  sameSite: "lax",
};
