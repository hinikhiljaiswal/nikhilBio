import { Prop } from "@nestjs/mongoose";

export class BaseSchema {
  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}
