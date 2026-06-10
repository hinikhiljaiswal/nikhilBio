import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsMongoId, IsOptional, IsString, MinLength } from "class-validator";

export class CreateVerificationDto {
  @IsMongoId()
  studentId: string;

  @IsMongoId()
  examId: string;

  @IsMongoId()
  centerId: string;

  @IsString()
  deviceSerialNumber: string;

  @IsEnum(["FINGERPRINT", "IRIS", "FACE"])
  modality: "FINGERPRINT" | "IRIS" | "FACE";

  @IsString()
  @MinLength(8)
  capturedTemplate: string;

  @IsOptional()
  @IsBoolean()
  aadhaarEnabled?: boolean;

  @IsOptional()
  @IsString()
  aadhaarLast4?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  capturedAt?: Date;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
