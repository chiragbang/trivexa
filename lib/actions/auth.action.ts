import { IUser } from "@/types";
import { connectDB } from "../db";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // ✅ Add this import

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function registerUser(data: IUser) {
  await connectDB(); // ✅ Add parentheses

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = new User({ ...data, password: hashedPassword });

  await newUser.save();

  return {
    success: true,
    message: "User registered successfully",
  };
}

export async function loginUser({
  email,
  password,
}: Pick<IUser, "email" | "password">) {
  await connectDB(); // ✅ Add parentheses

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
