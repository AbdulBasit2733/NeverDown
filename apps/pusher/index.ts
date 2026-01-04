import { createClient } from "redis";
import { prismaClient } from "store/client";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379/0";
async function Main() {
  const client = createClient({
    url: REDIS_URL,
  });
  client.on("error", (err) => console.log("Redis Client Error", err));

  try {
    await client.connect();

    const websites = await prismaClient.website.findMany({
      select: {
        url: true,
        id: true,
      },
    });

    // We use a Promise.all or a loop to add each website as a separate message
    if (websites && websites.length > 0) {
      const promises = websites.map((wb) => 
        client.xAdd(
          "neverdown:website",
          "*", // Auto-generate ID
          { id: wb.id, url: wb.url } // Key-Value pairs
        )
      );

      const results = await Promise.all(promises);
      console.log(`Successfully added ${results.length} messages to the stream.`);
    }
  } catch (error) {
    console.error("Execution error:", error);
  } finally {
    // Use .quit() for a graceful shutdown instead of .destroy()
    await client.quit();
  }
}

// Initial call and interval
Main();
setInterval(Main, 3 * 60 * 1000);