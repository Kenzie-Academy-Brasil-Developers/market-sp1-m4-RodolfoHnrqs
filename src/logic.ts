import market from "./database";
import { ICleaningProduct, IFoodProduct, IProduct, TProductCreate, TProductUpdate } from "./interfaces";
import { Request, Response } from "express";

const incrementalId = (): number => {
    const lastItem: IProduct | undefined = market
        .sort((a, b): number => a.id - b.id)
        .at(-1);

    if (!lastItem) return 1;
    return lastItem.id + 1;
};


const create = (request: Request, response: Response): Response => {
    const payload: TProductCreate[] = request.body;

    const newProductsData: Array<ICleaningProduct | IFoodProduct> = payload.map((product: TProductCreate) => {
        const newProduct: ICleaningProduct | IFoodProduct = {
            id: incrementalId(),
            ...product,
            expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        }

        market.push(newProduct);

        return newProduct;
    });

    const total = market.reduce((value, market) => value + market.price, 0);

    return response.status(201).send({
        total: total,
        marketProducts: newProductsData
    });

};

const read = (request: Request, response: Response): Response => {
    const total = market.reduce((value, market) => value + market.price, 0);

    return response.status(200).send({
        total: total,
        marketProducts: market,
    });
};

const retrieve = (request: Request, response: Response): Response => {
    const findIdIndex = response.locals.marketIndex;

    return response.status(200).json(market[findIdIndex]);
};

const update = (request: Request, response: Response): Response => {
    const id: number = response.locals.id;
    const { payload } = request.body;

    const updateProduct: IProduct = {
        id: id,
        ...request.body,
        ...payload,
    };

    const updateProductIndex = market.findIndex(marketProduct => marketProduct.id === id)
    if(updateProductIndex === -1){
        return response.status(404).json({
            error: "Product not found."
        })
    }

    market[updateProductIndex] = {
        ...market[updateProductIndex],
        ...updateProduct,
    }

    return response.status(200).json(market[updateProductIndex]);
};

const destroy = (request: Request, response: Response): Response => {
    const findIdIndex = response.locals.marketIndex;

    market.splice(findIdIndex, 1);

    return response.status(204).json();
};

export default { create, read, retrieve, update, destroy };