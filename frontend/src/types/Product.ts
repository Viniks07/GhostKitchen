import type { Restaurant } from "./Restaurant";

export type FeaturedProduct = {
  id: number;
  restaurantId: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  priceInCents: number;
  isAvailable: boolean;
  totalOrdered: number;
  averageRating: number;
  reviewCount: number;
  relevanceScore: number;
  restaurant: Pick<Restaurant, "id" | "name" | "slug" | "isOpen">;
};

export type GetFeaturedProductResponse = {
  products: FeaturedProduct[];
};
