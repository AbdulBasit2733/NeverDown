import express, { type Request, type Response } from "express";
import { prismaClient } from "store/client";
import cors from "cors";
import { ADD_WEBSITE_ZOD_SCHEMA, AUTH_ZOD_SCHEMA } from "./types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { authMiddleware } from "./middleware/auth";
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const result = AUTH_ZOD_SCHEMA.safeParse(req.body);
    if (!result.success) {
      const errMessages = result.error.issues.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: errMessages[0],
      });
    }

    const { username, password } = result?.data;

    const existingUser = await prismaClient.user.findFirst({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await prismaClient.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Signup Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  try {
    const result = AUTH_ZOD_SCHEMA.safeParse(req.body);

    if (!result.success) {
      const errMessages = result.error.issues.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: errMessages[0],
      });
    }

    const { username, password } = result.data;

    const existingUser = await prismaClient.user.findFirst({
      where: { username },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    const token = jwt.sign(
      { id: existingUser.id },
      JWT_SECRET,
      { expiresIn: "15m" } // Token expires in 15 minutes
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in prod
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({
      success: true,
      message: "Sign In Successful",
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post(
  "/add-website",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const result = ADD_WEBSITE_ZOD_SCHEMA.safeParse(req.body);
      if (!result.success) {
        const errMessages = result.error.issues.map((err) => err.message);
        res.status(411).json({
          success: false,
          message: errMessages[0],
        });
      }
      const url = result.data?.url ?? "";

      const existingWebsite = await prismaClient.website.findFirst({
        where: {
          user_id: userId!,
          url: url,
        },
      });
      if (existingWebsite) {
        return res.status(400).json({
          success: false,
          message: "Website already exisits",
        });
      }
      const newWebsite = await prismaClient.website.create({
        data: {
          url: url,
          timeAdded: new Date(),
          user_id: userId!,
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
  }
);

app.get(
  "/status/:websiteId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const websiteId = req.params.websiteId;
      const userId = req.userId;

      const existingWebsite = await prismaClient.website.findFirst({
        where: {
          id: websiteId,
          user_id: userId!,
        },
        include: {
          ticks: {
            orderBy: [
              {
                createdAt: "desc",
              },
            ],
            take: 1,
          },
        },
      });
      if(!existingWebsite){
        return res.status(409).json({
          success:false,
          message:"Not Found"
        })
      }
      res.status(200).json({
        success: true,
        data: existingWebsite,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}`);
});
