import { DOMAIN as SERVER_DOMAIN } from "./server";
export const API_URL = `${SERVER_DOMAIN}/api`;
export const DOMAIN =  process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://icicle.media";
// TODO: Add api key in the future