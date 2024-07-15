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
  HasMany,
  Default,
} from "@sequelize/core/decorators-legacy";
import { OwnedPlant } from "./OwnedPlant.model.js";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  @Attribute(DataTypes.BOOLEAN)
  @Default(false)
  @NotNull
  declare active: boolean;

  @Attribute(DataTypes.STRING)
  @Default("user")
  @NotNull
  declare role?: string;

  @Attribute(DataTypes.INTEGER)
  @Default(1)
  @NotNull
  declare powerIdentifications: number;

  @HasMany(() => OwnedPlant, "userId")
  declare ownedPlants?: NonAttribute<OwnedPlant[]>;
}
