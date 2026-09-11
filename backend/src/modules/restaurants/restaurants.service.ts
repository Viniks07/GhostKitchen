import { AppError } from "../../shared/errors/AppError.js";
import { RestaurantsRepository } from "./restaurants.repository.js";
import type {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
  CreateRestaurantData,
  UpdateRestaurantData,
} from "./restaurants.dto.js";

const restaurantsRepository = new RestaurantsRepository();

export class RestaurantsService {
  async create(userId: number, data: CreateRestaurantDTO) {
    const existingRestaurant =
      await restaurantsRepository.findRestaurantByUserId(userId);

    if (existingRestaurant) {
      throw new AppError("Usuário já possui um restaurante cadastrado", 409);
    }

    if (typeof data.name !== "string") {
      throw new AppError("Nome do restaurante com formato inválido", 400);
    }

    if (!data.name || !data.name.trim()) {
      throw new AppError("Nome é obrigatório", 400);
    }

    const name = data.name.trim();

    if (name.length > 100) {
      throw new AppError(
        "O nome do restaurante deve conter no máximo 100 caracteres",
        400,
      );
    }

    if (typeof data.categorySlug !== "string") {
      throw new AppError("Categoria com formato inválido", 400);
    }

    const categorySlug = data.categorySlug.trim().toLowerCase();

    if (!categorySlug) {
      throw new AppError("Categoria é obrigatória", 400);
    }

    const category =
      await restaurantsRepository.findCategoryBySlug(categorySlug);

    if (!category) {
      throw new AppError("Categoria inválida", 400);
    }

    let description: string | undefined;

    if (data.description !== undefined) {
      if (typeof data.description !== "string") {
        throw new AppError(
          "Descrição do restaurante com formato inválido",
          400,
        );
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

    const restaurantData: CreateRestaurantData = {
      name,
      categoryId: category.id,
    };

    if (description !== undefined) {
      restaurantData.description = description;
    }

    return restaurantsRepository.createRestaurant(userId, restaurantData);
  }

  async getPublicRestaurants() {
    const restaurants = await restaurantsRepository.findPublicRestaurants();

    return restaurants;
  }

  async getPublicRestaurantById(restaurantId: number) {
    const restaurant =
      await restaurantsRepository.findPublicRestaurantById(restaurantId);

    if (!restaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    return restaurant;
  }

  async getPublicRestaurantProducts(restaurantId: number) {
    const restaurant =
      await restaurantsRepository.findPublicRestaurantById(restaurantId);

    if (!restaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    const products =
      await restaurantsRepository.findPublicProductsByRestaurantId(
        restaurantId,
      );

    return products;
  }

  async getMyRestaurant(userId: number) {
    const restaurant =
      await restaurantsRepository.findRestaurantByUserId(userId);

    if (!restaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    return restaurant;
  }

  async updateMyRestaurant(userId: number, data: UpdateRestaurantDTO) {
    const existingRestaurant =
      await restaurantsRepository.findRestaurantByUserId(userId);

    if (!existingRestaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    const updatedData: UpdateRestaurantData = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string") {
        throw new AppError("Nome do restaurante com formato inválido", 400);
      }

      const name = data.name.trim();

      if (!name) {
        throw new AppError("Nome inválido", 400);
      }

      if (name.length > 100) {
        throw new AppError(
          "O nome do restaurante deve conter no máximo 100 caracteres",
          400,
        );
      }

      updatedData.name = name;
    }

    if (data.categorySlug !== undefined) {
      if (typeof data.categorySlug !== "string") {
        throw new AppError("Categoria com formato inválido", 400);
      }

      const categorySlug = data.categorySlug.trim().toLowerCase();

      if (!categorySlug) {
        throw new AppError("Categoria inválida", 400);
      }

      const category =
        await restaurantsRepository.findCategoryBySlug(categorySlug);

      if (!category) {
        throw new AppError("Categoria inválida", 400);
      }

      updatedData.categoryId = category.id;
    }

    if (data.description !== undefined) {
      if (data.description === null) {
        updatedData.description = null;
      } else {
        if (typeof data.description !== "string") {
          throw new AppError(
            "Descrição do restaurante com formato inválido",
            400,
          );
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

    if (data.isOpen !== undefined) {
      if (typeof data.isOpen !== "boolean") {
        throw new AppError("Status do restaurante com formato inválido", 400);
      }
      updatedData.isOpen = data.isOpen;
    }

    if (Object.keys(updatedData).length === 0) {
      throw new AppError("Nenhum campo para atualizar", 400);
    }

    return restaurantsRepository.updateRestaurantByUserId(userId, updatedData);
  }
}
