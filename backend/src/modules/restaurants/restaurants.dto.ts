export interface CreateRestaurantDTO {
  name: string;
  categorySlug: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateRestaurantDTO {
  name?: string;
  categorySlug?: string;
  description?: string | null;
  imageUrl?: string | null;
  isOpen?: boolean;
}

export interface CreateRestaurantData {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  categoryId: number;
}

export interface UpdateRestaurantData {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  isOpen?: boolean;
  categoryId?: number;
}
