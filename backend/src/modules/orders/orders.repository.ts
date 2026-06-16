import type { OrderStatus } from "@prisma/client";
import { prisma } from "../../shared/database/prisma.js";

type CreateOrderItemData = {
  productId: number;
  quantity: number;
  priceInCents: number;
};

export class OrdersRepository {
  async createOrderWithItems(
    clientId: number,
    restaurantId: number,
    totalInCents: number,
    items: CreateOrderItemData[],
  ) {
    return prisma.order.create({
      data: {
        clientId,
        restaurantId,
        totalInCents,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceInCents: item.priceInCents,
          })),
        },
      },
      include: { orderItems: true },
    });
  }

  async findRestaurantById(restaurantId: number) {
    return prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        id: true,
        isOpen: true,
      },
    });
  }

  async findRestaurantByUserId(userId: number) {
    return prisma.restaurant.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
  }

  async findProductsById(restaurantId: number, productsId: number[]) {
    return prisma.product.findMany({
      where: {
        restaurantId,
        id: {
          in: productsId,
        },
      },
      select: {
        id: true,
        restaurantId: true,
        priceInCents: true,
        isAvailable: true,
      },
    });
  }

  async findOrdersByClientId(clientId: number) {
    return prisma.order.findMany({
      where: {
        clientId,
      },
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOrderById(clientId: number, orderId: number) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        clientId,
      },
      include: {
        orderItems: true,
      },
    });
  }

  async findOrdersByRestaurantId(restaurantId: number) {
    return prisma.order.findMany({
      where: {
        restaurantId,
      },
      include: {
        orderItems: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findRestaurantOrderById(restaurantId: number, orderId: number) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        restaurantId,
      },
      include: {
        orderItems: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: {
        orderItems: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
