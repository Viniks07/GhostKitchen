import { AppError } from "../../shared/errors/AppError.js";
import { RestaurantsRepository } from "./restaurants.repository.js";
import type {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
} from "./restaurants.dto.js";

const restaurantsRepository = new RestaurantsRepository();

export class RestaurantsService {
  async create(userId: number, data: CreateRestaurantDTO) {
    const existingRestaurant =
      await restaurantsRepository.findRestaurantByUserId(userId);

    if (existingRestaurant) {
      throw new AppError("Usuário já possui um restaurante cadastrado", 409);
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

    let description: string | undefined;

    if (data.description !== undefined) {
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

    const restaurantData: CreateRestaurantDTO = {
      name,
    };

    if (description !== undefined) {
      restaurantData.description = description;
    }

    return restaurantsRepository.createRestaurant(userId, restaurantData);
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

    const updatedData: UpdateRestaurantDTO = {};

    if (data.name !== undefined) {
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

    if (data.description !== undefined) {
      const description = data.description.trim();

      if (description.length > 500) {
        throw new AppError(
          "Descrição deve conter no máximo 500 caracteres",
          400,
        );
      }

      updatedData.description = description || undefined;
    }

    if (data.isOpen !== undefined) {
      if (typeof data.isOpen !== "boolean") {
        throw new AppError("Status do restaurante inválido", 400);
      }
      updatedData.isOpen = data.isOpen;
    }

    if (Object.keys(updatedData).length === 0) {
      throw new AppError("Nenhum campo para atualizar", 400);
    }

    return restaurantsRepository.updateRestaurantByUserId(userId, updatedData);
  }
}
