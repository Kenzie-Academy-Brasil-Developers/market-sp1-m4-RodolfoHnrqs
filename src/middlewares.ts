import { NextFunction, Request, Response } from "express";
import { IProduct, TProductCreate } from "./interfaces";
import market from "./database";

const verifyProductExistence = (
    request: Request,
    response: Response,
    next: NextFunction
): void | Response => {
    const products: TProductCreate[] = request.body;

    const productExists = products.map(product => {
        const productExist = market.some(marketProduct => marketProduct.name === product.name)
        if (productExist) {
            return response.status(409).json({
                error: "Product already registered"
            })
        }
    })

    return next();
}

const verifyIdExistence = (
    request: Request,
    response: Response,
    next: NextFunction
): void | Response => {
    const id: number = Number(request.params.id);

    const findIdIndex = market.findIndex(market => market.id === id);
    const findExpiration = market.findIndex(market => market.expirationDate);
    const findSection = market.findIndex(market => market.section);

    if (findIdIndex === -1) {
        return response.status(404).json({
            error: "Product not found."
        })
    }

    response.locals.id = id;
    response.locals.marketIndex = findIdIndex;

    return next();
};

const verifyProductPatch = (
    request: Request,
    response: Response,
    next: NextFunction
): void | Response => {
    const products: TProductCreate = request.body;

    const productExists = market.some(marketProduct => marketProduct.name === products.name)

    if (productExists) {
        return response.status(409).json({
            error: "Product already registered"
        })
    }

    return next();
}

export default { verifyIdExistence, verifyProductExistence, verifyProductPatch };