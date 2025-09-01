import express, { type Request, type Response } from "express";
import { prismaClient } from "store/client";
import cors from "cors";
import { ADD_WEBSITE_ZOD_SCHEMA, AUTH_ZOD_SCHEMA } from "./types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

    const { username, password } = result.data;

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
    const hashedPassword = bcrypt.hash(password, 12);

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

    const existingUser = await prismaClient.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
      },
      "jwtsecret"
    );
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.status(200).json({
      success: true,
      message: "Sign In Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/add-website", async (req: Request, res: Response) => {
  try {
    const result = ADD_WEBSITE_ZOD_SCHEMA.safeParse(req.body);
    if (!result.success) {
      const errMessages = result.error.issues.map((err) => err.message);
      res.status(411).json({
        success: false,
        message: errMessages[0],
      });
    }
    const existingWebsite = await prismaClient.website.findFirst({
      where:{
        url:result.data?.url
      }
    })
    if(existingWebsite){
      return res.status(400).json({
        success:false,
        message:"Website already exisits"
      })
    }
    const newWebsite = await prismaClient.website.create({
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
    const websiteId = req.params.websiteId;

    const existingWebsite = await prismaClient.website.findFirst({
      where:{
        id:websiteId
      }
    })
    res.status(200).json({
      success:true,
      data:existingWebsite
    })
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
