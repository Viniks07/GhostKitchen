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

  async findPublicRestaurants() {
    return prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isOpen: true,
      },
      orderBy: [
        {
          isOpen: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }

  async findPublicRestaurantById(id: number) {
    return prisma.restaurant.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isOpen: true,
      },
    });
  }

  async findPublicProductsByRestaurantId(restaurantId: number) {
    return prisma.product.findMany({
      where: {
        restaurantId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        priceInCents: true,
        isAvailable: true,
      },
      orderBy: [
        {
          isAvailable: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }
}
