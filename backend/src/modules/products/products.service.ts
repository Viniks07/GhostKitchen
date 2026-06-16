import { AppError } from "../../shared/errors/AppError.js";
import { ProductsRepository } from "./products.repository.js";
import type { CreateProductDTO, UpdateProductDTO } from "./products.dto.js";

const productsRepository = new ProductsRepository();

export class ProductsService {
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
    console.log(data)
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

    const productData: CreateProductDTO = {
      name,
      priceInCents,
    };

    if (description !== undefined) {
      productData.description = description;
    }

    if (isAvailable !== undefined) {
      productData.isAvailable = isAvailable;
    }

    const restaurant = await productsRepository.findRestaurantByUserId(userId);

    if (!restaurant) {
      throw new AppError("Usuário não possui restaurante cadastrado", 404);
    }

    const restaurantId = restaurant.id;

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
      throw new AppError(
        "Você não tem permissão para alterar este produto",
        403,
      );
    }

    const updatedData: UpdateProductDTO = {};

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
}
