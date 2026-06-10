import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DeviceStatus } from "../common/roles";

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true })
export class Device {
  @Prop({ required: true, unique: true, trim: true })
  serialNumber: string;

  @Prop({ required: true, enum: ["FINGERPRINT", "IRIS", "FACE", "TABLET"] })
  type: string;

  @Prop({ required: true })
  vendor: string;

  @Prop({ type: Types.ObjectId, ref: "Center", required: true })
  centerId: Types.ObjectId;

  @Prop({ enum: DeviceStatus, default: DeviceStatus.Offline })
  status: DeviceStatus;

  @Prop()
  lastSeenAt?: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
