import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  BelongsToGetAssociationMixin,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  HasOne,
  BelongsTo,
  Default,
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

  @Attribute(DataTypes.STRING)
  declare commonName?: string;

  @Attribute(DataTypes.DATE)
  declare lastWatered?: Date;

  @Attribute(DataTypes.DATE)
  declare lastTransplanted?: Date;

  @Attribute(DataTypes.INTEGER)
  declare soliMoisture?: Number;

  @Attribute(DataTypes.INTEGER)
  declare desiredMoisture?: Number;

  @Attribute(DataTypes.STRING)
  @Default("off")
  declare wateringType: "after_time" | "below_moisture" | "off";

  @Attribute(DataTypes.INTEGER)
  declare plantId: Number;

  @Attribute(DataTypes.STRING)
  declare image: string;

  @Attribute(DataTypes.INTEGER)
  declare userId: Number;

  @BelongsTo(() => Plant, "plantId")
  declare plant?: NonAttribute<Plant>;
  declare getPlant: BelongsToGetAssociationMixin<Plant>;

  @BelongsTo(() => User, "userId")
  declare user?: NonAttribute<Plant>;
}
