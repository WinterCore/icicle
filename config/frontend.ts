import { DOMAIN as SERVER_DOMAIN } from "./server";
export const API_URL = `${SERVER_DOMAIN}/api`;
export const DOMAIN =  process.env.NODE_ENV === "development" ? "https://icicle.dev" : "https://icicle.wintercore.dev";
// TODO: Add api key in the future