import { createClient } from "redis";
import type { RedisStreamResponse, StreamEntry } from "./types";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379/0";
const isSecure = REDIS_URL.startsWith('redis://');
``
export const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    family: 4,
    keepAlive: 30000,
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    ...(isSecure && { tls: true, rejectUnauthorized: false })
  }
});

redisClient.on("error", (err) => {
  if (err.message.includes('Socket closed unexpectedly')) return;
  console.error("Shared Redis Client Error", err);
});

await redisClient.connect();

type WebsiteEvent = {
  url: string;
  id: string;
};

type MessageType = {
  id: string;
  message: {
    id: string;
    url: string;
  };
};

const STREAM_NAME = "neverdown:website";

export async function xADD({ url, id }: WebsiteEvent) {
  await redisClient.xAdd(STREAM_NAME, "*", {
    url,
    id,
  });
}

export async function xADD_BULK(websites: WebsiteEvent[]) {
  for (let i = 0; i < websites.length; i++) {
    await xADD({
      url: websites[i]?.url ?? "",
      id: websites[i]?.id ?? "",
    });
  }
}

export async function xREAD_GROUP(
  consumerGroup: string,
  workerId: string
): Promise<StreamEntry[] | undefined> {
  // Apply a type assertion (using 'as') here:
  const res = (await redisClient.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_NAME,
      id: ">",
    },
    {
      COUNT: 5,
    }
  )) as RedisStreamResponse[] | null; // <--- The Fix: Assert the expected type

  // No messages read or error occurred
  if (!res || res.length === 0) {
    return undefined;
  }

  // Extract and return the messages array
  return res[0]?.messages;
}

async function xACK(consumerGroup: string, eventId: string) {
  await redisClient.xAck(STREAM_NAME, consumerGroup, eventId);
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  eventIds.map((eventId) => xACK(consumerGroup, eventId));
}
