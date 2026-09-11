import { prisma } from "../../shared/database/prisma.js";

import type {
  CreateRestaurantData,
  UpdateRestaurantData,
} from "./restaurants.dto.js";

export class RestaurantsRepository {
  async createRestaurant(userId: number, restaurantData: CreateRestaurantData) {
    return prisma.restaurant.create({
      data: { userId, ...restaurantData },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findRestaurantByUserId(userId: number) {
    return prisma.restaurant.findUnique({
      where: {
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async updateRestaurantByUserId(
    userId: number,
    restaurantData: UpdateRestaurantData,
  ) {
    return prisma.restaurant.update({
      where: { userId },
      data: { ...restaurantData },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findPublicRestaurants() {
    return prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isOpen: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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

  async findCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }
}
