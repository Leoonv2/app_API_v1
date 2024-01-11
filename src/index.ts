import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import { router } from "./endpoints/Product.endpoint";

const prisma = new PrismaClient();

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

  const knoppers = await prisma.product.upsert({
    // just add a product to the database to test stuff
    where: { ean: "0000040144382" },
    update: {
      name: "Knoppers",
      brand: "Storck",
      ean: "0000040144382",
      Category: {
        connect: {
          name: "sweets",
        },
      },
      nutrients: {
        calories: 548,
        fat: 33.2,
        protein: 9.2,
        carbs: 51.3,
        sugar: 34.6,
        salt: 0.56,
      },
    },
    create: {
      name: "Knoppers",
      brand: "Storck",
      ean: "0000040144382",
      Category: {
        connect: {
          name: "sweets",
        },
      },
      nutrients: {
        toJSON() {
          return {
            calories: 548,
            fat: 33.2,
            protein: 9.2,
            carbs: 51.3,
            sugar: 34.6,
            salt: 0.56,
          };
        },
      },
    },
  });

  const port = 3000;
  const corsOptions: CorsOptions = { origin: "http://localhost:" + port };

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use("/api", router);

  app.listen(port, () => {
    console.log("\x1b[35m%s\x1b[0m", "\n         | Port:", port);
    router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(
          "\x1b[35m%s\x1b[0m",
          "         | Loaded Endpoint:",
          r.route.path, r.route.methods
        );
      }
    });
  });
}
init();

export { router, prisma };
