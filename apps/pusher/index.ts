import { createClient } from "redis";
import { prismaClient } from "store/client";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379/0";
import http from 'http'
const isSecure = REDIS_URL.startsWith('redis://');
// --- DUMMY SERVER FOR RENDER --

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Pusher is running!");
});
server.listen(process.env.PORT || 8080);

async function Main() {
   const client = createClient({
    url: REDIS_URL,
    socket: {
      family: 4, // Force IPv4
      ...(isSecure && {
        tls: true,
        rejectUnauthorized: false
      })
    }
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
    if (client.isOpen) {
      await client.quit(); 
    }
  }
}

// Initial call and interval
Main();
setInterval(Main, 3 * 60 * 1000);