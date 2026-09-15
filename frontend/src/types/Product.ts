import type { Restaurant } from "./Restaurant";

export type GetFeaturedProductResponse = {
  products: FeaturedProduct[];
};

export type FeaturedProduct = {
  id: number;
  name: string;
  priceInCents: number;
  isAvailable: boolean;
  restaurant: Pick<Restaurant, "id" | "name" | "isOpen">;
};
