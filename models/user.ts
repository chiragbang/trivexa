import { IUser } from '@/types';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
