import { generateOTP } from "../../../../../helpers/generateOTP.js";
import { sendOtpEmail } from "../../../../../helpers/sendEmailOTP.js";
import { setRedis, getRedis } from "../../../../../helpers/redis.js";

export async function POST(request) {
  const { email } = await request.json();

  try {
    if (!email) {
      return new Response(JSON.stringify({
        message: "Email not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const OTP = generateOTP();
    
    try {
      const StoreRedis = await setRedis(email, OTP);
      
      if (StoreRedis) {
        const sentMail = await sendOtpEmail(email, StoreRedis);

        if (!sentMail) {
          return new Response(JSON.stringify({
            message: "Some error occurred while sending OTP"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    } catch (redisError) {
      // Handle cooldown error specifically
      if (redisError.message.includes('Please wait')) {
        return new Response(JSON.stringify({
          message: redisError.message
        }), {
          status: 429, // Too Many Requests
          headers: { "Content-Type": "application/json" }
        });
      }
      throw redisError; 
    }

    return new Response(
      JSON.stringify({
        message: "OTP sent successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in sending OTP:", error);
    return new Response(JSON.stringify({ 
      message: error.message || "Internal Server Error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
