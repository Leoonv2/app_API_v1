import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import { getProduct } from "./handler/Product";

export const prisma = new PrismaClient();

const app: Express = express();

//        'https://world.openfoodfacts.org/api/v0/product/$barcode0.json'

async function init() {
  const cat = await prisma.category.findMany();
  if (cat.length === 0) {
    await prisma.category.createMany({
      data: [
        { name: "food" },
        { name: "drinks" },
        { name: "snacks" },
        { name: "sweets" },
        { name: "supplements" },
      ],
    });
  }

  const corsOptions: CorsOptions = {
    origin: "http://localhost:3000"
  };
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.listen(3000, () => {
    console.log("server is running");
  });
}
init();

app.get("/getAllProducts", async (req, res) => {
  const allproducts = await prisma.product.findMany();
  res.send(allproducts);
});

app.get("/product", async (req, res) => {
  const { id } = req.query;

  const product = await getProduct(id as string);
  console.log(product);
  res.json(product);
});

