import { createClient } from "redis";
import type { RedisStreamResponse, StreamEntry } from "./types";

export const redisClient = await createClient({
  url: "redis://localhost:6379/0",
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

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
  const res = await redisClient.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_NAME,
      id: ">",
    },
    {
      COUNT: 5,
    }
  ) as RedisStreamResponse[] | null; // <--- The Fix: Assert the expected type
  
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

export async function xAckBulk(consumerGroup:string, eventIds:string[]) {
  eventIds.map(eventId => xACK(consumerGroup, eventId))
}
