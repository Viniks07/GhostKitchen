import { AppError } from "../../shared/errors/AppError.js";
import { ProductsRepository } from "./products.repository.js";
import type {
  CreateProductDTO,
  CreateProductData,
  UpdateProductDTO,
  UpdateProductData,
} from "./products.dto.js";
import {
  validateImageUrlForCreate,
  validateImageUrlForUpdate,
} from "../../shared/utils/validateImageUrl.js";
import {
  MAX_PRICE_IN_CENTS,
  FEATURED_PRODUCTS_LIMIT,
  MOST_ORDERED_PRODUCTS_LIMIT,
} from "../../shared/constants/business-rules.js";
import { generateUniqueSlug } from "../../shared/utils/generateUniqueSlug.js";

const productsRepository = new ProductsRepository();

export class ProductsService {
  private async generateUniqueProductSlug(restaurantId: number, name: string) {
    return generateUniqueSlug({
      value: name,
      errorMessage: "Não foi possível gerar o slug do produto",
      exists: async (slug) => {
        const product = await productsRepository.findProductBySlug(
          restaurantId,
          slug,
        );

        return Boolean(product);
      },
    });
  }

  async create(userId: number, data: CreateProductDTO) {
    if (typeof data.name !== "string") {
      throw new AppError("Nome com formato inválido", 400);
    }

    if (!data.name || !data.name.trim()) {
      throw new AppError("Nome é obrigatório", 400);
    }

    const name = data.name.trim();

    if (name.length > 100) {
      throw new AppError("O nome deve conter no máximo 100 caracteres", 400);
    }

    let description: string | undefined;

    if (data.description !== undefined) {
      if (typeof data.description !== "string") {
        throw new AppError("Descrição com formato inválido", 400);
      }

      description = data.description.trim();

      if (description.length > 500) {
        throw new AppError(
          "Descrição deve conter no máximo 500 caracteres",
          400,
        );
      }
      if (!description) {
        description = undefined;
      }
    }
    if (data.priceInCents === undefined) {
      throw new AppError("Preço é obrigatório", 400);
    }

    if (typeof data.priceInCents !== "number") {
      throw new AppError("Preço com formato inválido", 400);
    }

    if (!Number.isInteger(data.priceInCents)) {
      throw new AppError("Preço deve ser um número inteiro em centavos", 400);
    }

    if (data.priceInCents <= 0) {
      throw new AppError("Preço deve ser maior que zero", 400);
    }

    if (data.priceInCents > MAX_PRICE_IN_CENTS) {
      throw new AppError("Preço excede o valor máximo permitido", 400);
    }

    if (data.isAvailable !== undefined) {
      if (typeof data.isAvailable !== "boolean") {
        throw new AppError(
          "Disponibilidade do produto com formato inválido",
          400,
        );
      }
    }
    const priceInCents = data.priceInCents;
    const isAvailable = data.isAvailable;

    const restaurant = await productsRepository.findRestaurantByUserId(userId);

    if (!restaurant) {
      throw new AppError("Usuário não possui restaurante cadastrado", 404);
    }

    const restaurantId = restaurant.id;
    const slug = await this.generateUniqueProductSlug(restaurantId, name);
    const imageUrl = validateImageUrlForCreate(data.imageUrl);

    const productData: CreateProductData = {
      name,
      slug,
      priceInCents,
    };

    if (description !== undefined) {
      productData.description = description;
    }

    if (imageUrl !== undefined) {
      productData.imageUrl = imageUrl;
    }

    if (isAvailable !== undefined) {
      productData.isAvailable = isAvailable;
    }

    const product = await productsRepository.createProduct(
      restaurantId,
      productData,
    );

    return product;
  }

  async update(userId: number, productId: number, data: UpdateProductDTO) {
    const restaurant = await productsRepository.findRestaurantByUserId(userId);
    if (!restaurant) {
      throw new AppError("Usuário não possui restaurante cadastrado", 404);
    }

    const product = await productsRepository.findProductById(productId);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.restaurantId !== restaurant.id) {
      throw new AppError("Produto não encontrado", 404);
    }

    const updatedData: UpdateProductData = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string") {
        throw new AppError("Nome com formato inválido", 400);
      }

      if (!data.name || !data.name.trim()) {
        throw new AppError("Nome é obrigatório", 400);
      }

      const name = data.name.trim();

      if (name.length > 100) {
        throw new AppError("O nome deve conter no máximo 100 caracteres", 400);
      }

      updatedData.name = name;
    }

    if (data.description !== undefined) {
      if (data.description === null) {
        updatedData.description = null;
      } else {
        if (typeof data.description !== "string") {
          throw new AppError("Descrição do produto com formato inválido", 400);
        }
        const description = data.description.trim();

        if (description.length > 500) {
          throw new AppError(
            "Descrição deve conter no máximo 500 caracteres",
            400,
          );
        }

        updatedData.description = description || null;
      }
    }

    if (data.imageUrl !== undefined) {
      const imageUrl = validateImageUrlForUpdate(data.imageUrl);

      if (imageUrl !== undefined) {
        updatedData.imageUrl = imageUrl;
      }
    }

    if (data.priceInCents !== undefined) {
      if (typeof data.priceInCents !== "number") {
        throw new AppError("Preço com formato inválido", 400);
      }

      if (!Number.isInteger(data.priceInCents)) {
        throw new AppError("Preço deve ser um número inteiro em centavos", 400);
      }

      if (data.priceInCents <= 0) {
        throw new AppError("Preço deve ser maior que zero", 400);
      }

      if (data.priceInCents > MAX_PRICE_IN_CENTS) {
        throw new AppError("Preço excede o valor máximo permitido", 400);
      }

      updatedData.priceInCents = data.priceInCents;
    }

    if (data.isAvailable !== undefined) {
      if (typeof data.isAvailable !== "boolean") {
        throw new AppError(
          "Disponibilidade do produto com formato inválido",
          400,
        );
      }
      const isAvailable = data.isAvailable;

      updatedData.isAvailable = isAvailable;
    }

    if (Object.keys(updatedData).length === 0) {
      throw new AppError("Nenhum campo para atualizar", 400);
    }

    return productsRepository.updateProductById(productId, updatedData);
  }

  async getMyProducts(userId: number) {
    const restaurant = await productsRepository.findRestaurantByUserId(userId);

    if (!restaurant) {
      throw new AppError("Usuário não possui restaurante cadastrado", 404);
    }

    const products = await productsRepository.findProductsByRestaurantId(
      restaurant.id,
    );

    return products;
  }

  async getFeaturedProducts() {
    const products = await productsRepository.findFeaturedProductsByRelevance(
      FEATURED_PRODUCTS_LIMIT,
    );

    return products;
  }

  async getMostOrderedProductsByRestaurantId(restaurantId: number) {
    const productStats =
      await productsRepository.findMostOrderedProductStatsByRestaurantId(
        restaurantId,
        MOST_ORDERED_PRODUCTS_LIMIT,
      );

    const productIds = productStats.map((stat) => stat.productId);

    if (productIds.length === 0) {
      return [];
    }

    const products = await productsRepository.findProductsByIds(productIds);

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const mostOrderedProducts = [];

    for (const stat of productStats) {
      const product = productsById.get(stat.productId);

      if (!product) {
        continue;
      }

      mostOrderedProducts.push({
        ...product,
        totalOrdered: stat._sum.quantity ?? 0,
      });
    }

    return mostOrderedProducts;
  }
}
