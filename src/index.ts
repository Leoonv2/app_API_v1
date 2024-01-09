import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
const prisma = new PrismaClient();

const app: Express = express();

app.get("/allProducts", async (req, res) => {
  const allproducts = await prisma.product.findMany();
  res.send(allproducts);
});

app.get("/product/:id", async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: {
        id: Number(id),
        },
    });
    res.send(product);
    }
);

app.listen(3000, () => {
    console.log("server is running");
    }
);


