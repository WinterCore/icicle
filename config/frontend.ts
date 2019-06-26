import { DOMAIN as SERVER_DOMAIN } from "./server";
export const API_URL = `${SERVER_DOMAIN}/api`;
export const DOMAIN =  process.env.DOMAIN || "http://localhost:8080";
// TODO: Add api key in the future