import { env } from "../config/env";
import type { Restaurant } from "../types/Restaurant";

type GetRestaurantsResponse = {
  restaurants: Restaurant[];
};

export async function getRestaurants(): Promise<GetRestaurantsResponse> {
  const response = await fetch(`${env.API_URL}/restaurants`);

  if (!response.ok) {
    throw new Error("Erro ao buscar restaurantes");
  }

  return response.json();
}
