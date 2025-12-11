import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/sequelize";

class ReservationTable extends Model<
  InferAttributes<ReservationTable>,
  InferCreationAttributes<ReservationTable>
> {
  declare id: CreationOptional<number>;
  declare reservation_id: number;
  declare table_id: number;
  declare table_number: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

ReservationTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "reservations",
        key: "id",
      },
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tables",
        key: "id",
      },
    },
    table_number: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "ReservationTable",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ReservationTable;
