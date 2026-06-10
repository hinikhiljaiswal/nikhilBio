import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { DeviceStatus } from "../common/roles";

export class RegisterDeviceDto {
  @IsString()
  serialNumber: string;

  @IsEnum(["FINGERPRINT", "IRIS", "FACE", "TABLET"])
  type: string;

  @IsString()
  vendor: string;

  @IsMongoId()
  centerId: string;

  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;
}

export class UpdateDeviceDto extends PartialType(RegisterDeviceDto) {}

export class DeviceHeartbeatDto {
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}
