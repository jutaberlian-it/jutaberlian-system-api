import sequelize from "../config/sequelize";
import SharedItem from "../models/SharedItem";
import SharedItemBorrowList from "../models/SharedItemBorrowList";

const associateModels = () => {
  SharedItem.hasMany(SharedItemBorrowList, {
    foreignKey: "shared_item_id",
    as: "borrow_lists",
  });
  SharedItemBorrowList.belongsTo(SharedItem, {
    foreignKey: "shared_item_id",
    as: "item",
  });
};

export const syncModels = async () => {
  try {
    associateModels();
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Failed to synchronize models:", error);
    throw error;
  }
};

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};
