import { prisma } from "../index";
import { Product } from "@prisma/client";
import fetch from "cross-fetch";

export const getProduct = async (ean: string): Promise<Product | null> => {
    if (!ean) return null;
    console.log(ean);
    var data =  await prisma.product.findFirst({
        where: {
            ean: {
                contains: ean,
            },
        },
    });
    if (!data) registerProduct(ean, null);
    return data;
}

export const registerProduct = async (ean:any, data: any): Promise<Product | null> => {
    if (!ean) return null;
    await fetch("https://world.openfoodfacts.org/api/v0/product/" + ean, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json()).then(async (data: any): Promise<void> => {
        console.log(data.status_verbose)
        if (data.status_verbose == "product found") {
            const nutrients = data.product.nutriments;
            const image = data.product.image_url;
            const macros = {
                calories: nutrients.energy,
                fat: nutrients.fat,
                protein: nutrients.proteins,
                carbs: nutrients.carbohydrates,
                sugar: nutrients.sugars,
                salt: nutrients.salt,
            };
            const unit = (data.product.serving_size.replace(/[0-9]/g, ''))

            var prod = await prisma.product.create({
                data: {
                    name: data.product.product_name_de,
                    brand: data.product.brands,
                    unit: unit,
                    ean: ean,
                    nutrients: macros,
                    image: image,
                },
            });
            
        }
    });
    return null;
}
