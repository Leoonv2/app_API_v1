import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
const prisma = new PrismaClient();

const app: Express = express();

app.get("/", async (req, res) => {
  const allproducts = await prisma.product.findMany();
  res.send(allproducts);
});

app.listen(3000, () => {
    console.log("server is running");
    }
);


