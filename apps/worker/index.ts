import { createClient, type RedisClientType } from "redis";
import { prismaClient } from "store/client";
import axios from "axios";
import { xAckBulk } from "redis-stream/redis-client";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379/0";
const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
  throw new Error("Region not provided");
}
if (!WORKER_ID) {
  throw new Error("Worker not provided");
}

interface StreamMessage {
  id: string; // website_id in DB
  url: string;
}
// --- separated website processing function ---
async function processWebsiteMessage(message: StreamMessage) {
  const url =
    message.url.startsWith("http://") || message.url.startsWith("https://")
      ? message.url
      : `https://${message.url}`;

  const startTime = Date.now();

  try {
    await axios.get(url, { timeout: 10_000 });

    await prismaClient.website_tick.create({
      data: {
        status: "up",
        response_time_ms: Date.now() - startTime,
        region_id: REGION_ID,
        website_id: message.id,
      },
    });
  } catch (error) {
    await prismaClient.website_tick.create({
      data: {
        status: "Down",
        response_time_ms: Date.now() - startTime,
        region_id: REGION_ID,
        website_id: message.id,
      },
    });
  }
}
async function main(): Promise<void> {
  const client: RedisClientType = createClient({
    url: REDIS_URL,
  });

  client.on("error", (err: Error) => {
    console.error("Redis Client Error", err);
  });

  await client.connect();

  try {
    while (true) {
      const res: Array<{
        name: string;
        messages: Array<{
          id: string;
          message: StreamMessage;
        }>;
      }> | null = await client.xReadGroup(
        REGION_ID,
        WORKER_ID,
        [
          {
            key: "neverdown:website",
            id: ">",
          },
        ],
        {
          COUNT: 2,
          BLOCK: 5000,
        }
      );

      console.log("Worker Res", res);

      if (!res) {
        console.log("No more messages.");
        continue;
      }

      // collect all IDs for bulk ack
      const idsToAck: string[] = [];

      for (const stream of res) {
        for (const msg of stream.messages) {
          const { id, message } = msg;

          await processWebsiteMessage(message);
          idsToAck.push(id);
        }
      }

      // acknowledge all processed messages in bulk
      await xAckBulk(REGION_ID, idsToAck);
    }
  } catch (err) {
    console.error("Worker error:", err);
  } finally {
    await client.quit();
  }
}

main().catch((err) => {
  console.error("Unhandled error in main:", err);
});
