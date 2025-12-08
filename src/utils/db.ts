import sequelize from "../config/sequelize";
import Customer from "../models/Customer";
import Reservation from "../models/Reservation";
import ReservationTable from "../models/ReservationTable";
import Role from "../models/Role";
import SharedItem from "../models/SharedItem";
import SharedItemBorrowList from "../models/SharedItemBorrowList";
import Table from "../models/Table";
import User from "../models/User";

const associateModels = () => {
  SharedItem.hasMany(SharedItemBorrowList, {
    foreignKey: "shared_item_id",
    as: "borrow_lists",
  });
  SharedItemBorrowList.belongsTo(SharedItem, {
    foreignKey: "shared_item_id",
    as: "item",
  });

  User.hasMany(SharedItemBorrowList, {
    foreignKey: "user_id",
  });
  SharedItemBorrowList.belongsTo(User, {
    foreignKey: "user_id",
  });

  Customer.hasMany(Reservation, {
    foreignKey: "customer_id",
  });
  Reservation.belongsTo(Customer, {
    foreignKey: "customer_id",
  });

  Reservation.belongsToMany(Table, {
    through: ReservationTable,
  });
  Table.belongsToMany(Reservation, {
    through: ReservationTable,
  });

  Role.hasMany(User, { foreignKey: "role_id", as: "users" });
  User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
};

export const syncModels = async () => {
  try {
    associateModels();
    await sequelize.sync();
    // await sequelize.sync({ alter: true });
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
