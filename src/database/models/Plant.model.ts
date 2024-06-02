import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Unique,
} from "@sequelize/core/decorators-legacy";

export class Plant extends Model<
  InferAttributes<Plant>,
  InferCreationAttributes<Plant>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @Unique
  declare apiId?: string;

  @Attribute(DataTypes.STRING)
  declare commonName?: string;

  @Attribute(DataTypes.STRING)
  declare avaibility?: string;

  @Attribute(DataTypes.STRING)
  declare lightTolerated?: string;

  @Attribute(DataTypes.STRING)
  declare lightIdeal?: string;

  @Attribute(DataTypes.FLOAT)
  declare temperatureMax?: number;

  @Attribute(DataTypes.FLOAT)
  declare temperatureMin?: number;

  @Attribute(DataTypes.STRING)
  declare watering?: string;

  @Attribute(DataTypes.STRING)
  declare climat?: string;
}
