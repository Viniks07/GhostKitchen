export type CreateProductDTO = {
    name: string;
    description?: string;
    priceInCents: number;
    isAvailable?: boolean;
}

export type UpdateProductDTO = {
    name?: string;
    description?: string | null;
    priceInCents?: number;
    isAvailable?: boolean;
}