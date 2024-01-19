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
    // if (!data) return null;
    if (!ean) return null;
    console.log(ean)
    fetch("https://world.openfoodfacts.org/api/v0/product/" + ean, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json()).then((data: any): void => {
        console.log(data.status_verbose)
        if (data.status_verbose == "product found") {
            console.log(data.product.nutriments.carbohydrates_100g);
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
