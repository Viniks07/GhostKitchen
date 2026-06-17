import { AppError } from "../../shared/errors/AppError.js";
import { OrdersRepository } from "./orders.repository.js";
import type { CreateOrderDTO, UpdateOrderStatusDTO } from "./orders.dto.js";
import { OrderStatus } from "@prisma/client";
import {
  MAX_ORDER_ITEM_QUANTITY,
  MAX_ORDER_TOTAL_IN_CENTS,
} from "../../shared/constants/business-rules.js";

const allowedStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.CREATED]: [OrderStatus.ACCEPTED, OrderStatus.CANCELED],
  [OrderStatus.ACCEPTED]: [OrderStatus.PREPARING, OrderStatus.CANCELED],
  [OrderStatus.PREPARING]: [OrderStatus.ON_THE_WAY, OrderStatus.CANCELED],
  [OrderStatus.ON_THE_WAY]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELED]: [],
};

const ordersRepository = new OrdersRepository();

export class OrdersService {
  async create(userId: number, data: CreateOrderDTO) {
    if (typeof data.restaurantId !== "number") {
      throw new AppError("Restaurante com o formato inválido", 400);
    }

    if (!Number.isInteger(data.restaurantId) || data.restaurantId <= 0) {
      throw new AppError("Restaurante inválido", 400);
    }

    if (!Array.isArray(data.items)) {
      throw new AppError("Itens do pedido com formato inválido", 400);
    }

    if (data.items.length === 0) {
      throw new AppError("Nenhum item para adicionar", 400);
    }

    for (const item of data.items) {
      if (typeof item.productId !== "number") {
        throw new AppError("Produto com o formato inválido", 400);
      }

      if (!Number.isInteger(item.productId) || item.productId <= 0) {
        throw new AppError("Produto inválido", 400);
      }

      if (typeof item.quantity !== "number") {
        throw new AppError("Quantidade com formato inválido", 400);
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new AppError("Quantidade inválida", 400);
      }
      if (item.quantity > MAX_ORDER_ITEM_QUANTITY) {
        throw new AppError("Quantidade excede o limite permitido", 400);
      }
    }

    const restaurant = await ordersRepository.findRestaurantById(
      data.restaurantId,
    );

    if (!restaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    if (!restaurant.isOpen) {
      throw new AppError("Restaurante não está aberto", 400);
    }

    const productsId = data.items.map((item) => item.productId);

    const uniqueProductsId = new Set(productsId);

    if (uniqueProductsId.size !== productsId.length) {
      throw new AppError("Pedido contém produtos duplicados", 400);
    }

    const products = await ordersRepository.findProductsById(
      data.restaurantId,
      productsId,
    );

    if (products.length !== productsId.length) {
      throw new AppError("Um ou mais produtos são inválidos", 400);
    }

    for (const product of products) {
      if (!product.isAvailable) {
        throw new AppError("Há pelo menos um produto indisponível", 400);
      }
    }

    const orderItems = data.items.map((item) => {
      const product = products.find((product) => product.id === item.productId);

      if (!product) {
        throw new AppError("Produto inválido", 400);
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        priceInCents: product.priceInCents,
      };
    });

    const totalInCents = orderItems.reduce((total, item) => {
      return total + item.priceInCents * item.quantity;
    }, 0);

    if (totalInCents > MAX_ORDER_TOTAL_IN_CENTS) {
      throw new AppError(
        "Valor total do pedido excede o limite permitido",
        400,
      );
    }

    const order = await ordersRepository.createOrderWithItems(
      userId,
      data.restaurantId,
      totalInCents,
      orderItems,
    );

    return order;
  }

  async getMyOrders(userId: number) {
    const myOrders = await ordersRepository.findOrdersByClientId(userId);

    return myOrders;
  }

  async getMyOrderById(userId: number, orderId: number) {
    const order = await ordersRepository.findOrderById(userId, orderId);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    return order;
  }

  async getMyRestaurantOrders(userId: number) {
    const restaurant = await ordersRepository.findRestaurantByUserId(userId);

    if (!restaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    const myOrders = await ordersRepository.findOrdersByRestaurantId(
      restaurant.id,
    );

    return myOrders;
  }

  async getMyRestaurantOrderById(userId: number, orderId: number) {
    const restaurant = await ordersRepository.findRestaurantByUserId(userId);

    if (!restaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    const order = await ordersRepository.findRestaurantOrderById(
      restaurant.id,
      orderId,
    );
    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    return order;
  }

  async updateMyRestaurantOrderStatus(
    userId: number,
    orderId: number,
    data: UpdateOrderStatusDTO,
  ) {
    const restaurant = await ordersRepository.findRestaurantByUserId(userId);

    if (!restaurant) {
      throw new AppError("Restaurante não encontrado", 404);
    }

    if (typeof data.status !== "string") {
      throw new AppError("Status com formato inválido", 400);
    }

    if (!Object.values(OrderStatus).includes(data.status as OrderStatus)) {
      throw new AppError("Status inválido", 400);
    }

    const order = await ordersRepository.findRestaurantOrderById(
      restaurant.id,
      orderId,
    );

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    const allowedNextStatuses = allowedStatusTransitions[order.status];

    if (!allowedNextStatuses.includes(data.status)) {
      throw new AppError("Transição de status inválida", 400);
    }

    const updateOrder = await ordersRepository.updateOrderStatus(
      order.id,
      data.status,
    );

    return updateOrder;
  }
}
