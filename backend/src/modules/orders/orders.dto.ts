import type { OrderStatus } from "@prisma/client";

export interface CreateOrderDTO {
  restaurantId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
};

export interface UpdateOrderStatusDTO {
  status: OrderStatus
}