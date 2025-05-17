
import { setRedis, getRedis } from "../../../../../helpers/redis.js";;

export async function POST(request) {
  const { otp, email } = await request.json();

  try {
    if (otp) {
      const storedOTP = await getRedis(email);

      if (!storedOTP) {
        return new Response({
          message: "OTP expired . Resend again ",
          status: 400,
        });
      }

      console.log(storedOTP);

      if (storedOTP != otp) {
        return new Response({
          message: "wrong OTP ",
          status: 400,
        });
      }

      return new Response(
        JSON.stringify({
          message: "OTP verification success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "OTP not recieved to server",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in signup:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
