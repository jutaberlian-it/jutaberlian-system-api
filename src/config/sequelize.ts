import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "jutaberlian",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
  }
);

export default sequelize;
