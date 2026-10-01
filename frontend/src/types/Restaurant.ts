export type Restaurant = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl:string;
  isOpen: boolean;
};

export type GetRestaurantsResponse = {
  restaurants: Restaurant[];
};
