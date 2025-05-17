import { redis } from "../lib/redis";

export async function setRedis(tag, value) {
    const cooldownKey = `cooldown:${tag}`;
    
    // Check cooldown first
    const isCooldown = await redis.get(cooldownKey);
    if (isCooldown) {
        const ttl = await redis.ttl(cooldownKey);
        throw new Error(`Please wait ${ttl} seconds before requesting a new OTP.`);
    }

    // Set OTP and cooldown
    await redis.set(tag, value, { ex: 300 });   // OTP expires in 5 minutes
    await redis.set(cooldownKey, "1", { ex: 60 }); // Cooldown for 1 minute
    
    const storedValue = await redis.get(tag);
    return storedValue;
}

export async function getRedis(tag) {
    const OTP = await redis.get(tag);
    return OTP;
}