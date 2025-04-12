import dotenv from "dotenv";
dotenv.config();
export const env = () => {
    if (!process.env.PORT)
        throw new Error("PORT not found in env file");
    if (!process.env.JWT_SCRET)
        throw new Error("JWT_SCRET not found in env file");
    if (!process.env.DATABASE_URL)
        throw new Error("DATABASE_URL not found in env file");
    return {
        port: process.env.PORT,
        jwt_secret_key: process.env.JWT_SCRET,
        database_url: process.env.DATABASE_URL
    };
};
