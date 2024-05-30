import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  HasOne,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { Plant } from "./Plant.model.js";
import { User } from "./User.model.js";

export class OwnedPlant extends Model<
  InferAttributes<OwnedPlant>,
  InferCreationAttributes<OwnedPlant>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.DATE)
  declare lastWatered: Date;

  @Attribute(DataTypes.DATE)
  declare lastTransplanted: Date;

  @Attribute(DataTypes.DATE)
  declare soliMoisture: Date;

  @Attribute(DataTypes.DATE)
  declare desiredMoisture: Date;

  @Attribute(DataTypes.STRING)
  declare wateringType: "after_time" | "below_moisture" | "off";

  @Attribute(DataTypes.INTEGER)
  declare plantId: Number;

  @Attribute(DataTypes.INTEGER)
  declare userId: Number;

  @BelongsTo(() => Plant, "plantId")
  declare plant?: NonAttribute<Plant>;

  @BelongsTo(() => User, "userId")
  declare user?: NonAttribute<Plant>;
}
