import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/sequelize";

enum ResReminderStatuses {
  pending = "Pending",
  sending = "Sending",
  sent = "Sent",
  failed = "Failed",
}

class ResReminder extends Model<
  InferAttributes<ResReminder>,
  InferCreationAttributes<ResReminder>
> {
  declare id: CreationOptional<number>;
  declare reservation_id: number;
  declare remind_at: Date;
  declare status: ResReminderStatuses;
  declare sent_at: Date | null;
  declare attempts: number;
  declare next_attempt_at: Date;
  declare last_error: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

ResReminder.init(
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
    remind_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ResReminderStatuses)),
      allowNull: false,
      defaultValue: ResReminderStatuses.pending,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    next_attempt_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_error: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
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
    modelName: "ResReminder",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ResReminder;
