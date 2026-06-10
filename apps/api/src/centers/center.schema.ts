import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CenterDocument = HydratedDocument<Center>;

@Schema({ timestamps: true })
export class Center {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CenterSchema = SchemaFactory.createForClass(Center);
