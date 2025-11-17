import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/sequelize";

class SharedItem extends Model<
  InferAttributes<SharedItem>,
  InferCreationAttributes<SharedItem>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string | null;
}

SharedItem.init(
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
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "SharedItem",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default SharedItem;
