import { DOMAIN as CLIENT_DOMAIN } from "./frontend";

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || "icicle";
const dbUser = process.env.DB_USER || "";
const dbPass = process.env.DB_PASS || "";
const dbCred = dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : "";


export const mongodbServerUrl = process.env.DB_URL || `mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}${dbCred ? "?authSource=admin" : ""}`;

export const DOMAIN = process.env.DOMAIN || "http://localhost:8081";
export const AUDIO_URL = (id: string): string => `${DOMAIN}/audio/${id}.ogg`;
export const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: `${CLIENT_DOMAIN}/auth/google/callback`
};

export const JWT_SECRET = process.env.JWT_SECRET || "NYAN_CAT";
export const AUDIO_PATH = "public/audio";

export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const PORT = process.env.PORT || 8081;