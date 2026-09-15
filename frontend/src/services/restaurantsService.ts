import { env } from "../config/env";
import type { GetRestaurantsResponse } from "../types/Restaurant";

export async function GetRestaurants(): Promise<GetRestaurantsResponse> {
  const response = await fetch(`${env.API_URL}/restaurants`);

  if (!response.ok) {
    throw new Error("Erro ao buscar restaurantes");
  }

  return response.json();
}
