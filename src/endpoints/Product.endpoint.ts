import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { getProduct } from "../handler/Product";

export const router = Router();

router.get("/", async (req: Request, res: Response) => {
  await res.send("Hello World");
});

router.get("/getAllProducts", async (req: Request, res: Response) => {
  const allproducts = await prisma.product.findMany();

  await res.json(allproducts);
});

router.get("/product", async (req: Request, res: Response) => {
  const ean  = req.body.ean;
  console.log(ean);
  if (!ean) return res.status(400).json({ error: "ean is required" });
  const product = await getProduct(ean as string);
  if (!product) return res.status(404).json({ error: "product not found" });
  await res.json(product);
});

router.post("/registerProduct", async (req: Request, res: Response) => {
  const data = req.body;
  if (data == null) return res.status(400).json({ error: "data is required" });

  console.log(data);

  await prisma.product.create({
    data: {
      name: data.name,
      brand: data.brand,
      ean: data.ean,
      Category: {
        connect: {
          name: data.category,
        },
      },
      nutrients: {
        toJSON() {
          return {
            calories: data.nutrients.calories,
            fat: data.nutrients.fat,
            protein: data.nutrients.protein,
            carbs: data.nutrients.carbs,
            sugar: data.nutrients.sugar,
            salt: data.nutrients.salt,
          };
        },
      },
    },
  });
  return res.json({ message: `product ${data.name} created` });
});
