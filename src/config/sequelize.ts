import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "bandar_yume",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

export default sequelize;
