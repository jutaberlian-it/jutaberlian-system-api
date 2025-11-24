import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/sequelize";

class SharedItemBorrowList extends Model<
  InferAttributes<SharedItemBorrowList>,
  InferCreationAttributes<SharedItemBorrowList>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare shared_item_id: number;
  declare borrow_start_date: Date;
  declare borrow_end_date: Date;
  declare return_photo_url: CreationOptional<string | null>;
  declare user_id: number;
}

SharedItemBorrowList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shared_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "shared_items",
        key: "id",
      },
    },
    borrow_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    borrow_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return_photo_url: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "SharedItemBorrowList",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default SharedItemBorrowList;
