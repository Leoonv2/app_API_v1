import { prisma } from "../index";
import { Product } from "@prisma/client";
import fetch from "cross-fetch";

export const getProduct = async (ean: string): Promise<Product | null> => {
    if (!ean) return null;
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
            
            var prod = await prisma.product.create({
                data: {
                    name: data.product.product_name_de,
                    brand: data.product.brands,
                    ean: ean,
                    nutrients: macros,
                    image: image,
                },
            });
            
        }
    });
    return null;

    // return await prisma.product.create({
    //     data: {
    //         name: data.name,
    //         brand: data.brand,
    //         ean: data.ean,
    //         Category: {
    //             connect: {
    //                 name: data.category,
    //             },
    //         },
    //         nutrients: {
    //             toJSON() {
    //                 return {
    //                     calories: data.nutrients.calories,
    //                     fat: data.nutrients.fat,
    //                     protein: data.nutrients.protein,
    //                     carbs: data.nutrients.carbs,
    //                     sugar: data.nutrients.sugar,
    //                     salt: data.nutrients.salt,
    //                 };
    //             },
    //         },
    //     },
    // });
}
