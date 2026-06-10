export type CreateProductDTO = {
    name: string;
    description?: string;
    price: number;
    isAvailable?: boolean;
}

export type UpdateProductDTO = {
    name?: string;
    description?: string | null;
    price?: number;
    isAvailable?: boolean;
}