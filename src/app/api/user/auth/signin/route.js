import { PrismaClient } from "../../../../../generated/prisma/index.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password } = await request.json();

  // const {email, password} = userdata;
  try {
    const user = await prisma.user.findUnique({ where: { email: email } }); // Fetch all users

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User with email does not exist. Please signup",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Invalid password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: userWithoutPassword,
        token
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in signin:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
