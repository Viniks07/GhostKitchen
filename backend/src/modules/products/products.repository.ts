import { prisma } from "../../shared/database/prisma.js";
import type { CreateProductDTO, UpdateProductDTO } from "./products.dto.js";

export class ProductsRepository {
  async createProduct(restaurantId: number, productData: CreateProductDTO) {
    return prisma.product.create({
      data: {
        restaurantId,
        ...productData,
      },
    });
  }

  async findRestaurantByUserId(userId: number) {
    return prisma.restaurant.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  async findProductById(productId: number) {
    return prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }

  async findProductsByRestaurantId(restaurantId: number) {
    return prisma.product.findMany({
      where: {
        restaurantId,
      },
    });
  }

  async updateProductById(productId: number, productData: UpdateProductDTO) {
    return prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...productData,
      },
    });
  }

  async findFeaturedProducts(limit: number) {
    return prisma.product.findMany({
      where: {
        isAvailable: true,
        restaurant: {
          isOpen: true,
        },
      },
      select: {
        id: true,
        name: true,
        priceInCents: true,
        isAvailable: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            isOpen: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
}
