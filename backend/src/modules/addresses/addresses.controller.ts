import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { AddressesService } from "./addresses.service.js";

const addressesService = new AddressesService();

export class AddressesController {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const address = await addressesService.create(req.user.id, req.body);
    return res.status(201).json({ address });
  }

  async getMyAddress(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const address = await addressesService.getMyAddress(req.user.id);
    return res.status(200).json({ address });
  }

  async updateMyAddress(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const address = await addressesService.updateMyAddress(
      req.user.id,
      req.body,
    );
    return res.status(200).json({ address });
  }

  async deleteMyAddress(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    await addressesService.deleteMyAddress(req.user.id);
    return res.status(204).send();
  }
}
