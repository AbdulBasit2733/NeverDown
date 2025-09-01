import express, { type Request, type Response } from "express";
import { prismaClient } from "store/client";
import cors from "cors";

const PORT = 3000;
const app = express();

app.use(express.json());

app.post("/websites", async (req: Request, res: Response) => {
  try {
    if (!req.body.url) {
      res.status(411).json({
        success: false,
        message: "URL required",
      });
    }
    const website = prismaClient.website.create({
      data: {
        url: req.body.url,
        timeAdded: new Date(),
      },
    });

    res.status(200).json({
      sucess: true,
      message: "Website Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/status/:websiteId", async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}`);
});
