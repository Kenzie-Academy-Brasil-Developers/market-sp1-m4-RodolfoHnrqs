type TProductType = "food" | "cleaning";

interface IProduct {
    id: number;
    name: string;
    price: number;
    weight: number;
    section: TProductType;
    expirationDate: Date;
}

interface IFoodProduct extends IProduct {
    calories: number;
}

type ICleaningProduct = IProduct;
type TProductCreate = Omit<IProduct, "id" | "expirationDate">;
type TProductUpdate = Partial<TProductCreate>;

export { IProduct, ICleaningProduct, IFoodProduct, TProductCreate, TProductUpdate };