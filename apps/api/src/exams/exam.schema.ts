import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ExamDocument = HydratedDocument<Exam>;

@Schema({ timestamps: true })
export class Exam {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ required: true })
  startsAt: Date;

  @Prop({ required: true })
  endsAt: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Center" }], default: [] })
  centerIds: Types.ObjectId[];

  @Prop({ default: "DRAFT", enum: ["DRAFT", "ACTIVE", "CLOSED"] })
  status: string;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
