import { prismaClient } from "store/client";
import { xADD, xADD_BULK } from "redis-stream/redis-client";
async function main() {
  let websites = await prismaClient.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });
  console.log(websites);
  

  await xADD_BULK(
    websites.map((w) => ({
      id: w.id,
      url: w.url,
    }))
  );
}

setInterval(
  () => {
    main();
  },
  3  * 1000
);
main();
