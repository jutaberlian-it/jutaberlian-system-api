export const PORT = process.env.PORT || 8000;
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
export const API_HOST =
  process.env.NODE_ENV === "production"
    ? process.env.API_HOST_PROD
    : process.env.NODE_ENV === "staging"
      ? process.env.API_HOST_STAGING
      : process.env.API_HOST_DEV;
