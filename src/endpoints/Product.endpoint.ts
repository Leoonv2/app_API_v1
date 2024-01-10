import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { getProduct } from "../handler/Product";

export const router = Router();

router.get("/getAllProducts", async (req: Request, res: Response) => {
  const allproducts = await prisma.product.findMany();

  await res.json(allproducts);
});

router.get("/product", async (req: Request, res: Response) => {
    const { ean } = req.query;
    if (!ean) return res.status(400).json({ error: "id is required" });
    const product = await getProduct(ean as string);
  
    await res.json(product);
});