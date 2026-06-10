import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsEnum, IsMongoId, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../common/roles";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsMongoId()
  centerId?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
