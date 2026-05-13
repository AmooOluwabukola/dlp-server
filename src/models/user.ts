import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'student' })
  role: string;

  @Prop()
  class: string;

  @Prop()
  profilePicture: string;

  @Prop()
  cohort: string;

  
}

export const UserSchema = SchemaFactory.createForClass(User);