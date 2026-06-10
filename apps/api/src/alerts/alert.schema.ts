import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type AlertDocument = HydratedDocument<Alert>;

@Schema({ timestamps: true })
export class Alert {
  @Prop({ required: true, enum: ["DEVICE_OFFLINE", "FAILED_VERIFICATION", "SUSPICIOUS_ACTIVITY"] })
  type: string;

  @Prop({ required: true, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] })
  severity: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: "Center" })
  centerId?: Types.ObjectId;

  @Prop({ default: false })
  resolved: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
