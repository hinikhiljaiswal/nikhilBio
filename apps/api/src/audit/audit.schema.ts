import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type AuditEventDocument = HydratedDocument<AuditEvent>;

@Schema({ timestamps: true })
export class AuditEvent {
  @Prop({ required: true, index: true })
  action: string;

  @Prop()
  actorId?: string;

  @Prop()
  actorRole?: string;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  metadata: Record<string, unknown>;

  @Prop()
  ipAddress?: string;
}

export const AuditEventSchema = SchemaFactory.createForClass(AuditEvent);
