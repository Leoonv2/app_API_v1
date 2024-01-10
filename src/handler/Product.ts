import { prisma } from "../index";
import { Product } from "@prisma/client";


export const getProduct = async (ean: string): Promise<Product | null> => {
    return await prisma.product.findFirst({
        where: {
            ean: {
                contains: ean,
            },
        },
    });
}
