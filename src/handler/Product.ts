import { Prisma, PrismaClient, Product } from "@prisma/client";
import { prisma } from "..";

export const getProduct = async (ean: string): Promise<Product | null> => {
    
    return await prisma.product.findUnique({
        where: {
            ean: ean,
        },
    });
}