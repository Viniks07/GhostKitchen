export type Restaurant = {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
};


export type GetRestaurantsResponse = {
  restaurants: Restaurant[];
};
