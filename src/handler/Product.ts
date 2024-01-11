import { prisma } from "../index";
import { Product } from "@prisma/client";


export const getProduct = async (ean: string): Promise<Product | null> => {
    if (!ean) return null;
    return await prisma.product.findFirst({
        where: {
            ean: {
                contains: ean,
            },
        },
    });
}

export const registerProduct = async (data: any): Promise<Product | null> => {
    if (!data) return null;
    return await prisma.product.create({
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
}
