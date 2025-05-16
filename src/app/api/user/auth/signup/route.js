import { PrismaClient } from "../../../../../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password } = await request.json();

  // const {email, password} = userdata;
  try {
    const existingUser = await prisma.user.findUnique({where : {email: email}}); // Fetch all users

    if(existingUser){
      return new Response(JSON.stringify({message: "User with email already exists . Please login"}), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    }); 

    return new Response( {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      user : newUser,
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,  
    });
  }
} 
