export interface CreateRestaurantDTO {
  name: string;
  description?: string;
}

export interface UpdateRestaurantDTO {
  name?: string;
  description?: string | null;
  isOpen?: boolean;
}
