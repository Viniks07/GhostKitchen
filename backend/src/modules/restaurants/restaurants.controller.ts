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

    const restaurant = await restaurantsService.updateMyRestaurant(req.user.id, req.body);
    return res.status(200).json({ restaurant });
  }
}
