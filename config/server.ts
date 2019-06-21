import { DOMAIN as CLIENT_DOMAIN } from "./frontend";

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || "icicle";
const dbUser = process.env.DB_USER || "";
const dbPass = process.env.DB_PASS || "";
const dbCred = dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : "";


export const mongodbServerUrl = process.env.DB_URL || `mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}`;

export const DOMAIN = "http://localhost:8081";
export const GOOGLE_CONFIG = {
  clientId: "678441941517-30jpq0673jv9gqmm4n7tm8nsv4304acq.apps.googleusercontent.com",
  clientSecret: "RjG-37S3rIOSYrTissbf5xch",
  redirect: `${CLIENT_DOMAIN}/auth/google/callback`
};

export const JWT_SECRET = "NYAN_CAT";
export const AUDIO_PATH = "public/audio";

// export default {
//     // used by API
//     mongodbServerUrl : dbUrl,

//     smtpServer : {
//         host        : "",
//         port        : 0,
//         secure      : true,
//         user        : "",
//         pass        : "",
//         fromName    : "",
//         fromAddress : ""
//     },

//     jwtSecretKey : "-",

//     // path to uploads
//     categoriesUploadPath  : "public/content/images/categories",
//     productsUploadPath    : "public/content/images/products",
//     filesUploadPath       : "public/content",
//     themeAssetsUploadPath : "theme/assets/images",

//     // url to uploads
//     categoriesUploadUrl  : "/images/categories",
//     productsUploadUrl    : "/images/products",
//     filesUploadUrl       : "",
//     themeAssetsUploadUrl : "/assets/images"
// };
