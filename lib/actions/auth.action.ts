import { IUser } from "@/types";
import { connectDB } from "../db";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";


export async function registerUser(data: IUser){
    await connectDB

    const existingUser = await User.findOne({email: data.email});
    if(existingUser) throw new Error('User already exist');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({...data, password: hashedPassword});

    await newUser.save();

    return {
        success: true,
        message: 'User registered successfully'
    }
}