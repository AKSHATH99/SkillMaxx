import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password ,username , name } = await request.json();
  console.log("Received data:", { email, password, username, name });

  // const {email, password} = userdata;
  try {
    const existingUser = await prisma.user.findUnique({where : {email: email}}); // Fetch all users

    if(existingUser){
      return new Response(JSON.stringify({message: "User with email already exists . Please login"}), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        username: username,
        Name: name,
      },
    }); 

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = newUser;

    return new Response(JSON.stringify({
      message: "User registered successfully",
      user: userWithoutPassword,
      token
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in signup:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,  
    });
  }
} 
