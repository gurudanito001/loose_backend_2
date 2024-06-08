"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Parsing the env file.
dotenv_1.default.config();
// Loading process.env as ENV interface
const getConfig = () => {
    console.log(process.env.DB_USER);
    return {
        SERVER_PORT: Number(process.env.PORT),
        DB_PORT: Number(process.env.DB_PORT),
        DB_LOCAL_PORT: Number(process.env.DB_LOCAL_PORT),
        DB_HOST: process.env.DB_HOST,
        DB_LOCALHOST: process.env.DB_LOCALHOST,
        DB_USER: process.env.DB_USER,
        DATABASE: process.env.DATABASE,
        PASSWORD: process.env.PASSWORD,
        DATABASE_URL: process.env.DATABASE_URL,
        ENVIRONMENT: process.env.ENVIRONMENT,
        TEST_STRING: process.env.TEST_STRING,
        API_BASE_URL: process.env.API_BASE_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        SECRET: process.env.SECRET,
        JWT_ACCESS_EXPIRATION_MINUTES: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES),
        JWT_REFRESH_EXPIRATION_DAYS: Number(process.env.JWT_REFRESH_EXPIRATION_DAYS),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Number(process.env.JWT_REFRESH_EXPIRATION_DAYS),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES),
        cloudinary_cloud_name: process.env.cloudinary_cloud_name,
        cloudinary_api_key: process.env.cloudinary_api_key,
        cloudinary_api_secret: process.env.cloudinary_api_secret,
    };
};
// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
exports.default = sanitizedConfig;
//# sourceMappingURL=config.js.map