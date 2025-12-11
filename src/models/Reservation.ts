import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/sequelize";

class Reservation extends Model<
  InferAttributes<Reservation>,
  InferCreationAttributes<Reservation>
> {
  declare id: CreationOptional<number>;
  declare customer_id: number;
  declare guest_count: number;
  declare status: CreationOptional<
    "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  >;
  declare special_occasion: CreationOptional<"BIRTHDAY" | "ANNIVERSARY" | null>;
  declare notes: string | null;
  declare start_datetime: Date;
  declare end_datetime: Date;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customers",
        key: "id",
      },
    },
    guest_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "CONFIRMED",
        "SEATED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },
    special_occasion: {
      type: DataTypes.ENUM("BIRTHDAY", "ANNIVERSARY"),
      allowNull: true,
      defaultValue: null,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    start_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    modelName: "Reservation",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Reservation;
