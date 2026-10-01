import { env } from "../shared/config/env";

import type { GetCategoryResponse } from "../types/category";

export async function getCategories(): Promise<GetCategoryResponse> {
  const response = await fetch(`${env.API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Erro ao buscar as categorias");
  }

  return response.json();
}
