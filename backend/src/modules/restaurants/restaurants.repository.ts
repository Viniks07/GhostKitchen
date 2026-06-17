import { prisma } from "../../shared/database/prisma.js";
import type {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
} from "./restaurants.dto.js";

export class RestaurantsRepository {
  async createRestaurant(userId: number, restaurantData: CreateRestaurantDTO) {
    return prisma.restaurant.create({
      data: { userId, ...restaurantData },
    });
  }

  async findRestaurantByUserId(userId: number) {
    return prisma.restaurant.findUnique({
      where: { userId },
    });
  }

  async updateRestaurantByUserId(
    userId: number,
    restaurantData: UpdateRestaurantDTO,
  ) {
    return prisma.restaurant.update({
      where: { userId },
      data: { ...restaurantData },
    });
  }
}
