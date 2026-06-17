import { RestaurantsService } from "./restaurants.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { Request, Response } from "express";

const restaurantsService = new RestaurantsService();

export class RestaurantsController {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const restaurant = await restaurantsService.create(req.user.id, req.body);
    return res.status(201).json({ restaurant });
  }

  async getPublicRestaurants(req: Request, res: Response) {
    const restaurants = await restaurantsService.getPublicRestaurants();
    return res.status(200).json({ restaurants });
  }

  async getPublicRestaurantById(req: Request, res: Response) {
    const restaurantId = Number(req.params.id);

    if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
      throw new AppError("ID do restaurante inválido", 400);
    }

    const restaurant =
      await restaurantsService.getPublicRestaurantById(restaurantId);

    return res.status(200).json({ restaurant });
  }

  async getPublicRestaurantProducts(req: Request, res: Response) {
    const restaurantId = Number(req.params.id);

    if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
      throw new AppError("ID do restaurante inválido", 400);
    }

    const products =
      await restaurantsService.getPublicRestaurantProducts(restaurantId);

    return res.status(200).json({ products });
  }

  async getMyRestaurant(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const restaurant = await restaurantsService.getMyRestaurant(req.user.id);
    return res.status(200).json({ restaurant });
  }

  async updateMyRestaurant(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const restaurant = await restaurantsService.updateMyRestaurant(
      req.user.id,
      req.body,
    );
    return res.status(200).json({ restaurant });
  }
}
