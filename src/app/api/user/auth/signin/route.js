import { PrismaClient } from "../../../../../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function POST(request) {
  const { email } = await request.json();

  // const {email, password} = userdata;
  try {
    const user = await prisma.user.findUnique({ where: { email: email } }); // Fetch all users

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User with email do not  exists . Please signup",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(user);

    return new Response(
      JSON.stringify({
        message: "User found",
        user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
