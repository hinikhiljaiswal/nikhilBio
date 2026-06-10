import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, Matches } from "class-validator";

export class CreateStudentDto {
  @IsString()
  name: string;

  @Matches(/^\d{12}$/)
  aadhaarNumber: string;

  @IsString()
  rollNumber: string;

  @IsMongoId()
  examId: string;

  @IsMongoId()
  centerId: string;

  @IsOptional()
  @IsBoolean()
  hasBiometricReference?: boolean;

  @IsOptional()
  @IsEnum(["PENDING", "VERIFIED", "FAILED", "REVIEW"])
  verificationStatus?: string;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}

export class StudentQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsMongoId()
  examId?: string;

  @IsOptional()
  @IsMongoId()
  centerId?: string;
}
