import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateExamDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @Type(() => Date)
  @IsDate()
  startsAt: Date;

  @Type(() => Date)
  @IsDate()
  endsAt: Date;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  centerIds?: string[];

  @IsOptional()
  @IsEnum(["DRAFT", "ACTIVE", "CLOSED"])
  status?: string;
}

export class UpdateExamDto extends PartialType(CreateExamDto) {}
