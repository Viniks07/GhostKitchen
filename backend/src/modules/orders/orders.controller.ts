import { OrdersService } from "./orders.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { Request, Response } from "express";

const ordersService = new OrdersService();

export class OrdersController {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const order = await ordersService.create(req.user.id, req.body);

    return res.status(201).json({ order });
  }

  async getMyOrders(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const orders = await ordersService.getMyOrders(req.user.id);

    return res.status(200).json({ orders });
  }

  async getMyOrderById(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError("ID do pedido inválido", 400);
    }

    const order = await ordersService.getMyOrderById(req.user.id, orderId);

    return res.status(200).json({ order });
  }

  async getMyRestaurantOrders(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const orders = await ordersService.getMyRestaurantOrders(req.user.id);

    return res.status(200).json({ orders });
  }

  async getMyRestaurantOrderById(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError("ID do pedido inválido", 400);
    }

    const order = await ordersService.getMyRestaurantOrderById(
      req.user.id,
      orderId,
    );

    return res.status(200).json({ order });
  }

  async updateMyRestaurantOrderStatus(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError("ID do pedido inválido", 400);
    }

    const order = await ordersService.updateMyRestaurantOrderStatus(
      req.user.id,
      orderId,
      req.body
    )

    return res.status(200).json({order})
  }
}
