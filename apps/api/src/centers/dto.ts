import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCenterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  code: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCenterDto extends PartialType(CreateCenterDto) {}
