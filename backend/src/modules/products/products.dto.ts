export type CreateProductDTO = {
  name: string;
  description?: string;
  imageUrl?: string;
  priceInCents: number;
  isAvailable?: boolean;
};

export type UpdateProductDTO = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  priceInCents?: number;
  isAvailable?: boolean;
};

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  priceInCents: number;
  isAvailable?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  priceInCents?: number;
  isAvailable?: boolean;
}
