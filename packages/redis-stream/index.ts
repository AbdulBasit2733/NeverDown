import { createClient } from "redis";

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

const STREAM_NAME = "neverdown:websites";

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
): Promise<MessageType[] | undefined> {
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
  );
  console.log("XREADGROUP", res);
  // //@ts-ignore
  // let messages = res?.[0].messages

  return res;
}

async function xACK(consumerGroup: string, eventId: string) {
  await redisClient.xAck(STREAM_NAME, consumerGroup, eventId);
}

export async function xAckBulk(consumerGroup:string, eventIds:string[]) {
  eventIds.map(eventId => xACK(consumerGroup, eventId))
}
