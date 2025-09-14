import axios from "axios";
import { prismaClient } from "store/client";
import { xAckBulk, xREAD_GROUP } from "redis-stream/redis-client";
import { resolve } from "bun";
export const REGION_ID = process.env.REGION_ID!;
export const WORKER_ID = process.env.WORKER_ID!;

async function main() {
  while (1) {
    // read form stream

    const res = await xREAD_GROUP(REGION_ID, WORKER_ID);

    if (!res) {
      return;
    }

    let promises = res
      ? res.map(({ id, message }) => fetchWebsite(message.url, message.id))
      : [];
    await Promise.all(promises);

    console.log(promises.length);
    // process the webiste and store the result in the db.
    // TODO: IT shuld problly be routed through the queue in a bulk db request

    // Acknowlege back to the queue that this event has been processed

    xAckBulk(
      REGION_ID,
      res.map(({ id }) => id)
    );
  }
}

async function fetchWebsite(url: string, messageId: string) {
  let startTime = Date.now();
  return new Promise<void>((resolve, reject) => {
    axios
      .get(url)
      .then(async () => {
        const endTime = Date.now();
        await prismaClient.website_tick.create({
          data: {
            response_time_ms: endTime - startTime,
            status: "up",
            region_id: REGION_ID,
            website_id: messageId,
          },
        });
        resolve();
      })
      .catch(async () => {
        const endTime = Date.now();
        await prismaClient.website_tick.create({
          data: {
            response_time_ms: endTime - startTime,
            status: "Down",
            region_id: REGION_ID,
            website_id: messageId,
          },
        });
        resolve();
      });
  });
}
main();
