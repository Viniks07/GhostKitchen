import { env } from "../config/env";
import type { GetFeaturedProductResponse } from "../types/Product";


export async function GetFeaturedProducts(): Promise<GetFeaturedProductResponse> {
  const response = await fetch(`${env.API_URL}/products/featured`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos do carrosel");
  }

  return response.json();
}
