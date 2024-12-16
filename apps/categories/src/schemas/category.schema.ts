import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    versionKey: false,
    timestamps: true
})
export class Category extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop({ default: '', trim: true })
    description: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', default: null })
    parentCategory: string | null;

    @Prop({ required: false, trim: true })
    imageUrl: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
