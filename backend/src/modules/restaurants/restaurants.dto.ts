export interface CreateRestaurantDTO {
  name: string;
  categorySlug: string;
  description?: string;
}

export interface UpdateRestaurantDTO {
  name?: string;
  categorySlug?: string;
  description?: string | null;
  isOpen?: boolean;
}

export interface CreateRestaurantData {
  name: string;
  description?: string;
  categoryId: number;
}

export interface UpdateRestaurantData {
  name?: string;
  description?: string | null;
  isOpen?: boolean;
  categoryId?: number;
}
