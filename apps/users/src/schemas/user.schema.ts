import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true })
  email: string; 

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: null })
  phone: string | null;

}

export const UserSchema = SchemaFactory.createForClass(User);
